import { createHash } from 'node:crypto'

import {
  Prisma,
  ProgressStatus,
  TaskType,
} from '../../generated/prisma/index.js'
import { prisma } from '../../shared/prisma.ts'
import {
  getConfiguredMentorReviewer,
  isValidMentorReviewOutput,
  type MentorReviewContext,
  type MentorReviewResult,
} from './mentor-reviewer.ts'

type JsonRecord = Record<string, unknown>

type LessonProgressPayload = {
  lessonId: string
  status: ProgressStatus
  completedAt: Date | null
}

type LessonTaskProgressPayload = {
  lessonTaskId: string
  response: Prisma.JsonValue | null
  isCompleted: boolean
  completedAt: Date | null
}

type CompleteLessonResult =
  | {
      status: 'success'
      progress: LessonProgressPayload
    }
  | {
      status: 'not-found'
    }
  | {
      status: 'required-tasks-incomplete'
      missingTaskIds: string[]
    }

type UpsertTaskProgressResult =
  | {
      status: 'success'
      progress: LessonTaskProgressPayload
    }
  | {
      status: 'not-found'
    }
  | {
      status: 'invalid'
      message: string
    }

type LessonTaskAttemptPayload = {
  id: string
  lessonTaskId: string
  response: Prisma.JsonValue
  attemptNumber: number
  submittedAt: Date
  createdAt: Date
}

type LessonTaskReviewPayload = {
  id: string
  lessonTaskAttemptId: string
  status: string
  output: Prisma.JsonValue | null
  provider: string | null
  model: string | null
  errorMessage: string | null
  createdAt: Date
  updatedAt: Date
}

type SubmitLessonTaskAttemptResult =
  | {
      status: 'success'
      attempt: LessonTaskAttemptPayload
      review: LessonTaskReviewPayload
    }
  | {
      status: 'not-found'
    }
  | {
      status: 'invalid'
      message: string
    }

type GetLatestLessonTaskReviewResult =
  | {
      status: 'success'
      attempt: LessonTaskAttemptPayload | null
      review: LessonTaskReviewPayload | null
    }
  | {
      status: 'not-found'
    }

type TaskValidationResult =
  | {
      isValid: true
      response: JsonRecord
    }
  | {
      isValid: false
      message: string
    }

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : null
}

function getNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function getBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : null
}

function getJsonRecord(value: Prisma.JsonValue | null) {
  return isRecord(value) ? value : {}
}

function getOptionIds(options: Prisma.JsonValue | null) {
  if (!Array.isArray(options)) {
    return []
  }

  return options
    .map((option) => (isRecord(option) ? getString(option.id) : null))
    .filter((optionId): optionId is string => Boolean(optionId))
}

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function normalizeValue(value: string, normalization: unknown) {
  return normalization === 'trim' ? value.trim() : value
}

function hashStarterCode(value: string) {
  return createHash('sha256').update(value.trim()).digest('hex')
}

function validatePredictionResponse(
  response: unknown,
  options: Prisma.JsonValue | null,
): TaskValidationResult {
  if (!isRecord(response)) {
    return {
      isValid: false,
      message: 'Prediction response is required.',
    }
  }

  const selectedOptionId =
    getString(response.selectedOptionId) ?? getString(response.optionId)

  if (!selectedOptionId) {
    return {
      isValid: false,
      message: 'Prediction option is required.',
    }
  }

  if (!getOptionIds(options).includes(selectedOptionId)) {
    return {
      isValid: false,
      message: 'Selected prediction option is invalid.',
    }
  }

  return {
    isValid: true,
    response: {
      ...response,
      selectedOptionId,
    },
  }
}

function validateCodeResponse(
  response: unknown,
  starterCode: string | null,
  validation: JsonRecord,
): TaskValidationResult {
  if (!isRecord(response)) {
    return {
      isValid: false,
      message: 'Code response is required.',
    }
  }

  const attempt = getString(response.attempt) ?? getString(response.code)

  if (!attempt?.trim()) {
    return {
      isValid: false,
      message: 'Code attempt is required.',
    }
  }

  const shouldRejectUnchangedStarter =
    getBoolean(validation.rejectUnchangedStarter) === true

  if (shouldRejectUnchangedStarter) {
    const starterCodeHash = getString(validation.starterCodeHash)
    const normalization = validation.normalization
    const normalizedAttempt = normalizeValue(attempt, normalization)
    const normalizedStarter = normalizeValue(starterCode ?? '', normalization)
    const isUnchanged =
      starterCodeHash !== null
        ? hashStarterCode(attempt) === starterCodeHash
        : normalizedAttempt === normalizedStarter

    if (isUnchanged) {
      return {
        isValid: false,
        message: 'Update the starter code before saving your attempt.',
      }
    }
  }

  return {
    isValid: true,
    response: {
      ...response,
      attempt,
    },
  }
}

function validateReflectionResponse(
  response: unknown,
  validation: JsonRecord,
): TaskValidationResult {
  if (!isRecord(response)) {
    return {
      isValid: false,
      message: 'Reflection response is required.',
    }
  }

  const answer = getString(response.answer) ?? getString(response.reflection)

  if (!answer?.trim()) {
    return {
      isValid: false,
      message: 'Reflection answer is required.',
    }
  }

  const minWords = getNumber(validation.minWords) ?? 1
  const minCharacters = getNumber(validation.minCharacters) ?? 1

  if (countWords(answer) < minWords || answer.trim().length < minCharacters) {
    return {
      isValid: false,
      message: `Reflection must be at least ${minWords} words and ${minCharacters} characters.`,
    }
  }

  return {
    isValid: true,
    response: {
      ...response,
      answer,
    },
  }
}

function validateTaskResponse(
  task: {
    type: TaskType
    starterCode: string | null
    options: Prisma.JsonValue | null
    validation: Prisma.JsonValue | null
  },
  response: unknown,
): TaskValidationResult {
  const validation = getJsonRecord(task.validation)

  if (task.type === TaskType.PREDICTION) {
    return validatePredictionResponse(response, task.options)
  }

  if (task.type === TaskType.CODE) {
    return validateCodeResponse(response, task.starterCode, validation)
  }

  if (task.type === TaskType.REFLECTION) {
    return validateReflectionResponse(response, validation)
  }

  return {
    isValid: false,
    message: 'Lesson task type is not supported for progress.',
  }
}

function validateMentorReviewResult(
  reviewResult: MentorReviewResult,
): MentorReviewResult {
  if (
    reviewResult.status === 'REVIEW_UNAVAILABLE' ||
    isValidMentorReviewOutput(reviewResult.output)
  ) {
    return reviewResult
  }

  return {
    status: 'REVIEW_UNAVAILABLE',
    output: null,
    provider: reviewResult.provider,
    model: reviewResult.model,
    errorMessage: 'Reviewer returned invalid structured output.',
  }
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  )
}

function getPreviousReviewSummary(output: Prisma.JsonValue | null) {
  return isRecord(output) && typeof output.summary === 'string'
    ? output.summary
    : null
}

function toUnavailableReviewResult(): MentorReviewResult {
  return {
    status: 'REVIEW_UNAVAILABLE',
    output: null,
    provider: 'MENTOR_REVIEWER',
    model: 'unknown',
    errorMessage: 'Reviewer unavailable for this attempt.',
  }
}

async function createAttemptAndReview(
  userId: string,
  lessonTaskId: string,
  response: JsonRecord,
  reviewResult: MentorReviewResult,
) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(async (transaction) => {
        const latestAttempt = await transaction.lessonTaskAttempt.aggregate({
          where: {
            userId,
            lessonTaskId,
          },
          _max: {
            attemptNumber: true,
          },
        })
        const attemptNumber = (latestAttempt._max.attemptNumber ?? 0) + 1
        const lessonTaskAttempt = await transaction.lessonTaskAttempt.create({
          data: {
            userId,
            lessonTaskId,
            response: response as Prisma.InputJsonValue,
            attemptNumber,
          },
          select: {
            id: true,
            lessonTaskId: true,
            response: true,
            attemptNumber: true,
            submittedAt: true,
            createdAt: true,
          },
        })
        const review = await transaction.lessonTaskReview.create({
          data: {
            lessonTaskAttemptId: lessonTaskAttempt.id,
            status: reviewResult.status,
            output:
              reviewResult.output === null
                ? Prisma.JsonNull
                : (reviewResult.output as Prisma.InputJsonValue),
            provider: reviewResult.provider,
            model: reviewResult.model,
            errorMessage: reviewResult.errorMessage,
          },
          select: {
            id: true,
            lessonTaskAttemptId: true,
            status: true,
            output: true,
            provider: true,
            model: true,
            errorMessage: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        return {
          attempt: lessonTaskAttempt,
          review,
        }
      })
    } catch (error) {
      if (isUniqueConstraintError(error) && attempt < 2) {
        continue
      }

      throw error
    }
  }

  throw new Error('Unable to create lesson task attempt.')
}

function defaultLessonProgress(lessonId: string): LessonProgressPayload {
  return {
    lessonId,
    status: ProgressStatus.NOT_STARTED,
    completedAt: null,
  }
}

function defaultTaskProgress(lessonTaskId: string): LessonTaskProgressPayload {
  return {
    lessonTaskId,
    response: null,
    isCompleted: false,
    completedAt: null,
  }
}

export async function getLessonProgressForUser(
  userId: string,
  lessonId: string,
) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      isPublished: true,
    },
    select: {
      id: true,
      tasks: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
        },
      },
    },
  })

  if (!lesson) {
    return null
  }

  const [progress, taskProgress] = await Promise.all([
    prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      select: {
        lessonId: true,
        status: true,
        completedAt: true,
      },
    }),
    prisma.lessonTaskProgress.findMany({
      where: {
        userId,
        lessonTask: {
          lessonId,
        },
      },
      select: {
        lessonTaskId: true,
        response: true,
        isCompleted: true,
        completedAt: true,
      },
    }),
  ])

  const taskProgressById = new Map(
    taskProgress.map((progressItem) => [
      progressItem.lessonTaskId,
      progressItem,
    ]),
  )

  return {
    ...(progress ?? defaultLessonProgress(lessonId)),
    taskProgress: lesson.tasks.map(
      (task) => taskProgressById.get(task.id) ?? defaultTaskProgress(task.id),
    ),
  }
}

export async function upsertLessonTaskProgressForUser(
  userId: string,
  lessonId: string,
  lessonTaskId: string,
  response: unknown,
): Promise<UpsertTaskProgressResult> {
  const task = await prisma.lessonTask.findFirst({
    where: {
      id: lessonTaskId,
      lessonId,
      lesson: {
        isPublished: true,
      },
    },
    select: {
      id: true,
      type: true,
      starterCode: true,
      options: true,
      validation: true,
    },
  })

  if (!task) {
    return {
      status: 'not-found',
    }
  }

  const validationResult = validateTaskResponse(task, response)

  if (!validationResult.isValid) {
    return {
      status: 'invalid',
      message: validationResult.message,
    }
  }

  const completedAt = new Date()
  const progress = await prisma.lessonTaskProgress.upsert({
    where: {
      userId_lessonTaskId: {
        userId,
        lessonTaskId,
      },
    },
    update: {
      response: validationResult.response as Prisma.InputJsonValue,
      isCompleted: true,
      completedAt,
    },
    create: {
      userId,
      lessonTaskId,
      response: validationResult.response as Prisma.InputJsonValue,
      isCompleted: true,
      completedAt,
    },
    select: {
      lessonTaskId: true,
      response: true,
      isCompleted: true,
      completedAt: true,
    },
  })

  return {
    status: 'success',
    progress,
  }
}

export async function submitLessonTaskAttemptForReview(
  userId: string,
  lessonId: string,
  lessonTaskId: string,
  response: unknown,
): Promise<SubmitLessonTaskAttemptResult> {
  const task = await prisma.lessonTask.findFirst({
    where: {
      id: lessonTaskId,
      lessonId,
      lesson: {
        isPublished: true,
      },
    },
    select: {
      id: true,
      title: true,
      prompt: true,
      starterCode: true,
      metadata: true,
      validation: true,
      type: true,
      lesson: {
        select: {
          title: true,
          description: true,
          module: {
            select: {
              title: true,
              technology: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!task) {
    return {
      status: 'not-found',
    }
  }

  if (task.type !== TaskType.CODE) {
    return {
      status: 'invalid',
      message: 'Mentor review is available for CODE tasks only.',
    }
  }

  const validationResult = validateCodeResponse(
    response,
    task.starterCode,
    getJsonRecord(task.validation),
  )

  if (!validationResult.isValid) {
    return {
      status: 'invalid',
      message: validationResult.message,
    }
  }

  const latestReview = await prisma.lessonTaskReview.findFirst({
    where: {
      lessonTaskAttempt: {
        userId,
        lessonTaskId,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      output: true,
    },
  })

  const reviewContext: MentorReviewContext = {
    lesson: {
      title: task.lesson.title,
      description: task.lesson.description,
    },
    module: {
      title: task.lesson.module.title,
    },
    technology: {
      title: task.lesson.module.technology.title,
    },
    task: {
      title: task.title,
      prompt: task.prompt,
      starterCode: task.starterCode,
      metadata: task.metadata,
      validation: task.validation,
    },
    response: validationResult.response as Prisma.JsonValue,
    previousReviewSummary: getPreviousReviewSummary(
      latestReview?.output ?? null,
    ),
  }
  const reviewer = getConfiguredMentorReviewer()
  const rawReviewResult = await reviewer
    .reviewCodeAttempt(reviewContext)
    .catch(toUnavailableReviewResult)
  const reviewResult = validateMentorReviewResult(rawReviewResult)
  const result = await createAttemptAndReview(
    userId,
    lessonTaskId,
    validationResult.response,
    reviewResult,
  )

  return {
    status: 'success',
    attempt: result.attempt,
    review: result.review,
  }
}

export async function getLatestLessonTaskReviewForUser(
  userId: string,
  lessonId: string,
  lessonTaskId: string,
): Promise<GetLatestLessonTaskReviewResult> {
  const task = await prisma.lessonTask.findFirst({
    where: {
      id: lessonTaskId,
      lessonId,
      lesson: {
        isPublished: true,
      },
    },
    select: {
      id: true,
      type: true,
    },
  })

  if (!task) {
    return {
      status: 'not-found',
    }
  }

  if (task.type !== TaskType.CODE) {
    return {
      status: 'not-found',
    }
  }

  const latestAttempt = await prisma.lessonTaskAttempt.findFirst({
    where: {
      userId,
      lessonTaskId,
    },
    orderBy: {
      attemptNumber: 'desc',
    },
    select: {
      id: true,
      lessonTaskId: true,
      response: true,
      attemptNumber: true,
      submittedAt: true,
      createdAt: true,
      reviews: {
        take: 1,
        select: {
          id: true,
          lessonTaskAttemptId: true,
          status: true,
          output: true,
          provider: true,
          model: true,
          errorMessage: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  })

  if (!latestAttempt) {
    return {
      status: 'success',
      attempt: null,
      review: null,
    }
  }

  const [review] = latestAttempt.reviews

  return {
    status: 'success',
    attempt: {
      id: latestAttempt.id,
      lessonTaskId: latestAttempt.lessonTaskId,
      response: latestAttempt.response,
      attemptNumber: latestAttempt.attemptNumber,
      submittedAt: latestAttempt.submittedAt,
      createdAt: latestAttempt.createdAt,
    },
    review: review ?? null,
  }
}

export async function completeLessonForUser(
  userId: string,
  lessonId: string,
): Promise<CompleteLessonResult> {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      isPublished: true,
    },
    select: {
      id: true,
      tasks: {
        where: {
          isRequired: true,
        },
        select: {
          id: true,
        },
      },
    },
  })

  if (!lesson) {
    return {
      status: 'not-found',
    }
  }

  const existingProgress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    select: {
      lessonId: true,
      status: true,
      completedAt: true,
    },
  })

  if (existingProgress?.status === ProgressStatus.COMPLETED) {
    return {
      status: 'success',
      progress: existingProgress,
    }
  }

  const requiredTaskIds = lesson.tasks.map((task) => task.id)

  if (requiredTaskIds.length > 0) {
    const completedTasks = await prisma.lessonTaskProgress.findMany({
      where: {
        userId,
        lessonTaskId: {
          in: requiredTaskIds,
        },
        isCompleted: true,
      },
      select: {
        lessonTaskId: true,
      },
    })
    const completedTaskIds = new Set(
      completedTasks.map((task) => task.lessonTaskId),
    )
    const missingTaskIds = requiredTaskIds.filter(
      (taskId) => !completedTaskIds.has(taskId),
    )

    if (missingTaskIds.length > 0) {
      return {
        status: 'required-tasks-incomplete',
        missingTaskIds,
      }
    }
  }

  const completedAt = new Date()
  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    update: {
      status: ProgressStatus.COMPLETED,
      completedAt,
    },
    create: {
      userId,
      lessonId,
      status: ProgressStatus.COMPLETED,
      completedAt,
    },
    select: {
      lessonId: true,
      status: true,
      completedAt: true,
    },
  })

  return {
    status: 'success',
    progress,
  }
}
