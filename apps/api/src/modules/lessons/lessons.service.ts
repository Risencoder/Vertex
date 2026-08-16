import { createHash } from 'node:crypto'

import {
  Prisma,
  ProgressStatus,
  TaskType,
} from '../../generated/prisma/index.js'
import { prisma } from '../../shared/prisma.ts'

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
