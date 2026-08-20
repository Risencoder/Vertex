import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'

import { useRootLayout } from '@/app/layouts/use-root-layout'
import {
  completeLesson,
  getLatestLessonTaskReview,
  getLessonProgress,
  LessonProgressApiError,
  submitLessonTaskAttemptForReview,
  type LessonProgress,
  type LessonTaskAttempt,
  type LessonTaskProgress,
  type LessonTaskReview,
  saveLessonTaskProgress,
} from '@/shared/api/lesson-progress'
import {
  getLessonByModuleAndTechnologySlug,
  TechnologiesApiError,
  type LessonDetails,
  type LessonTask,
} from '@/shared/api/technologies'
import { formatDifficulty, formatLessonType } from '@/shared/lib/labels'
import { Button } from '@/shared/ui/button'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
} from '@/shared/ui/page-state'

type LessonState =
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: LessonDetails
      error: string
    }
  | {
      status: 'not-found'
      data: null
      error: string
    }
  | {
      status: 'error'
      data: null
      error: string
    }

type ProgressState =
  | {
      status: 'idle'
      data: null
      error: string
    }
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: LessonProgress
      error: string
    }
  | {
      status: 'error'
      data: null
      error: string
    }

type MentorReviewState =
  | {
      status: 'idle'
      attempt: null
      review: null
      reviewedAttempt: string
      isStale: boolean
      error: string
    }
  | {
      status: 'loading'
      attempt: LessonTaskAttempt | null
      review: LessonTaskReview | null
      reviewedAttempt: string
      isStale: boolean
      error: string
    }
  | {
      status: 'success'
      attempt: LessonTaskAttempt | null
      review: LessonTaskReview | null
      reviewedAttempt: string
      isStale: boolean
      error: string
    }
  | {
      status: 'error'
      attempt: LessonTaskAttempt | null
      review: LessonTaskReview | null
      reviewedAttempt: string
      isStale: boolean
      error: string
    }

const lessonFlowSteps = [
  { id: 'predict', label: 'Predict' },
  { id: 'learn', label: 'Learn' },
  { id: 'practice', label: 'Practice' },
  { id: 'reflect', label: 'Reflect' },
] as const

type LessonFlowStepId = (typeof lessonFlowSteps)[number]['id']
type LessonFlowStep = (typeof lessonFlowSteps)[number]

function getMarkdownBeforeSection(markdown: string, sectionHeading: string) {
  const lines = markdown.split('\n')
  const sectionIndex = lines.findIndex((line) => line.trim() === sectionHeading)

  if (sectionIndex === -1) {
    return markdown
  }

  return lines.slice(0, sectionIndex).join('\n').trim()
}

function LessonStepProgress({
  currentStep,
  steps,
}: {
  currentStep: LessonFlowStepId
  steps: LessonFlowStep[]
}) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <nav aria-label="Lesson steps" className="border-b py-6">
      <ol
        className={`grid gap-3 ${steps.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}
      >
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep
          const isComplete = index < currentStepIndex

          return (
            <li key={step.id}>
              <div
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium ${
                  isCurrent
                    ? 'border-primary bg-primary/5 text-primary'
                    : isComplete
                      ? 'border-border bg-muted/50 text-card-foreground'
                      : 'border-border bg-background text-muted-foreground'
                }`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs ${
                    isCurrent
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isComplete
                        ? 'border-card-foreground bg-card-foreground text-background'
                        : 'border-border bg-background'
                  }`}
                >
                  {index + 1}
                </span>
                <span>{step.label}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function renderMarkdown(markdown: string) {
  const blocks: ReactNode[] = []
  const lines = markdown.split('\n')
  let paragraph: string[] = []
  let code: string[] = []
  let listItems: string[] = []
  let listType: 'ordered' | 'unordered' | null = null
  let isCodeBlock = false

  function flushParagraph(key: string) {
    if (paragraph.length === 0) {
      return
    }

    blocks.push(
      <p key={key} className="text-base leading-8 text-card-foreground/90">
        {paragraph.join(' ')}
      </p>,
    )
    paragraph = []
  }

  function flushList(key: string) {
    if (listItems.length === 0 || !listType) {
      return
    }

    const className =
      listType === 'ordered'
        ? 'list-decimal space-y-2 pl-5 text-base leading-8 text-card-foreground/90'
        : 'list-disc space-y-2 pl-5 text-base leading-8 text-card-foreground/90'

    const items = listItems.map((item, itemIndex) => (
      <li key={`${key}-${itemIndex}`}>{item}</li>
    ))

    blocks.push(
      listType === 'ordered' ? (
        <ol key={key} className={className}>
          {items}
        </ol>
      ) : (
        <ul key={key} className={className}>
          {items}
        </ul>
      ),
    )

    listItems = []
    listType = null
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    const unorderedListMatch = /^[-*]\s+(.+)/.exec(trimmedLine)
    const orderedListMatch = /^\d+\.\s+(.+)/.exec(trimmedLine)

    if (trimmedLine.startsWith('```')) {
      if (isCodeBlock) {
        blocks.push(
          <pre
            key={`code-${index}`}
            className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm leading-6"
          >
            <code>{code.join('\n')}</code>
          </pre>,
        )
        code = []
        isCodeBlock = false
        return
      }

      flushParagraph(`paragraph-before-code-${index}`)
      flushList(`list-before-code-${index}`)
      isCodeBlock = true
      return
    }

    if (isCodeBlock) {
      code.push(line)
      return
    }

    if (trimmedLine === '') {
      flushParagraph(`paragraph-${index}`)
      flushList(`list-${index}`)
      return
    }

    if (trimmedLine.startsWith('# ')) {
      flushParagraph(`paragraph-before-heading-${index}`)
      flushList(`list-before-heading-${index}`)
      blocks.push(
        <h1
          key={`heading-${index}`}
          className="font-heading text-2xl font-semibold leading-tight"
        >
          {trimmedLine.slice(2)}
        </h1>,
      )
      return
    }

    if (trimmedLine.startsWith('## ')) {
      flushParagraph(`paragraph-before-subheading-${index}`)
      flushList(`list-before-subheading-${index}`)
      blocks.push(
        <h2
          key={`subheading-${index}`}
          className="pt-2 font-heading text-xl font-semibold leading-tight"
        >
          {trimmedLine.slice(3)}
        </h2>,
      )
      return
    }

    if (trimmedLine.startsWith('### ')) {
      flushParagraph(`paragraph-before-small-heading-${index}`)
      flushList(`list-before-small-heading-${index}`)
      blocks.push(
        <h3
          key={`small-heading-${index}`}
          className="pt-1 font-heading text-lg font-semibold leading-tight"
        >
          {trimmedLine.slice(4)}
        </h3>,
      )
      return
    }

    if (unorderedListMatch) {
      flushParagraph(`paragraph-before-list-${index}`)

      if (listType && listType !== 'unordered') {
        flushList(`list-before-unordered-${index}`)
      }

      listType = 'unordered'
      listItems.push(unorderedListMatch[1])
      return
    }

    if (orderedListMatch) {
      flushParagraph(`paragraph-before-list-${index}`)

      if (listType && listType !== 'ordered') {
        flushList(`list-before-ordered-${index}`)
      }

      listType = 'ordered'
      listItems.push(orderedListMatch[1])
      return
    }

    paragraph.push(trimmedLine)
  })

  flushParagraph('paragraph-final')
  flushList('list-final')

  if (code.length > 0) {
    blocks.push(
      <pre
        key="code-final"
        className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm leading-6"
      >
        <code>{code.join('\n')}</code>
      </pre>,
    )
  }

  return blocks
}

function getEstimatedReadingTime(content: string) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  if (wordCount === 0) {
    return 'Short read'
  }

  return `${Math.max(3, Math.ceil(wordCount / 180))} min read`
}

function getTaskByType(tasks: LessonTask[], type: LessonTask['type']) {
  return tasks.find((task) => task.type === type)
}

function getLessonFlowSteps(tasks: LessonTask[]) {
  const steps: LessonFlowStep[] = []

  if (getTaskByType(tasks, 'PREDICTION')) {
    steps.push(lessonFlowSteps[0])
  }

  steps.push(lessonFlowSteps[1])

  if (getTaskByType(tasks, 'CODE')) {
    steps.push(lessonFlowSteps[2])
  }

  if (getTaskByType(tasks, 'REFLECTION')) {
    steps.push(lessonFlowSteps[3])
  }

  return steps
}

function getInitialLessonFlowStep(tasks: LessonTask[]): LessonFlowStepId {
  return getTaskByType(tasks, 'PREDICTION') ? 'predict' : 'learn'
}

function isLessonFlowStepId(value: string | null): value is LessonFlowStepId {
  return lessonFlowSteps.some((step) => step.id === value)
}

function hasLessonFlowStep(steps: LessonFlowStep[], stepId: LessonFlowStepId) {
  return steps.some((step) => step.id === stepId)
}

function getNextLessonFlowStep(
  steps: LessonFlowStep[],
  currentStep: LessonFlowStepId,
) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  return steps[currentStepIndex + 1]?.id ?? null
}

function getLessonFlowStepIndex(
  steps: LessonFlowStep[],
  stepId: LessonFlowStepId,
) {
  return steps.findIndex((step) => step.id === stepId)
}

function isTaskRequired(task?: LessonTask) {
  return task?.isRequired === true
}

function getFirstBlockedLessonFlowStep({
  canContinueAfterPractice,
  isLessonCompleted,
  isPredictionRevealed,
  isReflectionAccepted,
  predictionTask,
  codeTask,
  reflectionTask,
}: {
  canContinueAfterPractice: boolean
  isLessonCompleted: boolean
  isPredictionRevealed: boolean
  isReflectionAccepted: boolean
  predictionTask?: LessonTask
  codeTask?: LessonTask
  reflectionTask?: LessonTask
}) {
  if (isLessonCompleted) {
    return null
  }

  if (isTaskRequired(predictionTask) && !isPredictionRevealed) {
    return 'predict'
  }

  if (isTaskRequired(codeTask) && !canContinueAfterPractice) {
    return 'practice'
  }

  if (isTaskRequired(reflectionTask) && !isReflectionAccepted) {
    return 'reflect'
  }

  return null
}

function getAccessibleLessonFlowStep({
  blockedStep,
  requestedStep,
  steps,
}: {
  blockedStep: LessonFlowStepId | null
  requestedStep: LessonFlowStepId
  steps: LessonFlowStep[]
}) {
  if (!blockedStep) {
    return requestedStep
  }

  const requestedStepIndex = getLessonFlowStepIndex(steps, requestedStep)
  const blockedStepIndex = getLessonFlowStepIndex(steps, blockedStep)

  if (requestedStepIndex === -1) {
    return blockedStep
  }

  if (blockedStepIndex !== -1 && requestedStepIndex > blockedStepIndex) {
    return blockedStep
  }

  return requestedStep
}

function getResumeLessonFlowStep({
  blockedStep,
  hasStoredInteraction,
  isLessonCompleted,
  steps,
  tasks,
}: {
  blockedStep: LessonFlowStepId | null
  hasStoredInteraction: boolean
  isLessonCompleted: boolean
  steps: LessonFlowStep[]
  tasks: LessonTask[]
}) {
  if (isLessonCompleted) {
    return 'learn'
  }

  if (!hasStoredInteraction) {
    return getInitialLessonFlowStep(tasks)
  }

  if (blockedStep) {
    return blockedStep
  }

  return steps[steps.length - 1]?.id ?? 'learn'
}

function getCorrectPredictionOptionId(task?: LessonTask) {
  return task?.validation?.correctOptionId ?? task?.feedback?.correctOptionId
}

function getTaskProgressByTaskId(
  taskProgress: LessonTaskProgress[] | undefined,
  lessonTaskId: string,
) {
  return taskProgress?.find(
    (progress) => progress.lessonTaskId === lessonTaskId,
  )
}

function getStringResponseValue(
  progress: LessonTaskProgress | undefined,
  keys: string[],
) {
  const response = progress?.response

  if (!response || typeof response !== 'object') {
    return null
  }

  for (const key of keys) {
    const value = response[key]

    if (typeof value === 'string') {
      return value
    }
  }

  return null
}

function getStringFromResponse(
  response: Record<string, unknown> | null,
  keys: string[],
) {
  if (!response) {
    return null
  }

  for (const key of keys) {
    const value = response[key]

    if (typeof value === 'string') {
      return value
    }
  }

  return null
}

function getRecordFromResponse(
  response: Record<string, unknown> | null,
  key: string,
) {
  const value = response?.[key]

  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function getAttemptFromReviewAttempt(attempt: LessonTaskAttempt | null) {
  return getStringFromResponse(attempt?.response ?? null, ['attempt', 'code'])
}

function isUnreviewedFallbackProgress(progress?: LessonTaskProgress) {
  if (!progress?.isCompleted || !progress.response) {
    return false
  }

  const mentorReview = getRecordFromResponse(progress.response, 'mentorReview')

  return (
    mentorReview?.status === 'REVIEW_UNAVAILABLE' &&
    mentorReview.continuedWithoutReview === true
  )
}

function isMentorReviewReady(state: MentorReviewState) {
  return (
    state.status === 'success' &&
    !state.isStale &&
    state.review?.status === 'READY_TO_CONTINUE'
  )
}

function isMentorReviewUnavailable(state: MentorReviewState) {
  return (
    state.status === 'success' &&
    !state.isStale &&
    state.review?.status === 'REVIEW_UNAVAILABLE'
  )
}

function isMentorReviewEnabled(task?: LessonTask) {
  const mentorReview = task?.metadata?.mentorReview

  return (
    mentorReview !== null &&
    typeof mentorReview === 'object' &&
    !Array.isArray(mentorReview) &&
    'enabled' in mentorReview &&
    mentorReview.enabled === true
  )
}

function upsertTaskProgressItem(
  taskProgress: LessonTaskProgress[] | undefined,
  updatedProgress: LessonTaskProgress,
) {
  const currentTaskProgress = taskProgress ?? []
  const existingProgressIndex = currentTaskProgress.findIndex(
    (progress) => progress.lessonTaskId === updatedProgress.lessonTaskId,
  )

  if (existingProgressIndex === -1) {
    return [...currentTaskProgress, updatedProgress]
  }

  return currentTaskProgress.map((progress, index) =>
    index === existingProgressIndex ? updatedProgress : progress,
  )
}

function formatMentorReviewStatus(status: string) {
  if (status === 'READY_TO_CONTINUE') {
    return 'Ready to continue'
  }

  if (status === 'NEEDS_IMPROVEMENT') {
    return 'Needs improvement'
  }

  return 'Review unavailable'
}

function formatMentorNextAction(action: string) {
  if (action === 'CONTINUE') {
    return 'Continue'
  }

  if (action === 'IMPROVE_AND_RESUBMIT') {
    return 'Improve and resubmit'
  }

  return 'Review concept'
}

function MentorReviewPanel({ state }: { state: MentorReviewState }) {
  if (state.status === 'idle') {
    return null
  }

  return (
    <div className="grid gap-4 rounded-lg border bg-background p-4">
      <div className="grid gap-1">
        <p className="text-sm font-medium">Mentor Review</p>
        <p className="text-sm leading-6 text-muted-foreground">
          Submit your code for review before continuing. The Mentor checks your
          attempt without executing code or giving you a full solution.
        </p>
      </div>

      {state.status === 'loading' ? (
        <p className="text-sm text-muted-foreground" role="status">
          Loading Mentor Review...
        </p>
      ) : null}

      {state.status === 'error' ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.isStale && state.review ? (
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800"
          role="status"
        >
          This review is for an earlier attempt. Submit again when you are ready
          to review your updated code.
        </div>
      ) : null}

      {state.status === 'success' && !state.review ? (
        <p className="text-sm text-muted-foreground">
          No Mentor Review has been submitted for this practice task yet.
        </p>
      ) : null}

      {state.review ? (
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              Attempt #{state.attempt?.attemptNumber ?? '-'}
            </span>
            <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {formatMentorReviewStatus(state.review.status)}
            </span>
          </div>

          {state.review.status === 'REVIEW_UNAVAILABLE' ? (
            <p className="text-sm leading-6 text-muted-foreground">
              Mentor Review is unavailable right now. Your code is preserved.
              Retry review, or continue without review if the outage persists.
            </p>
          ) : null}

          {state.review.output ? (
            <div className="grid gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium">Summary</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {state.review.output.summary}
                </p>
              </div>

              {state.review.output.strengths.length > 0 ? (
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Strengths</p>
                  <ul className="grid gap-2 text-sm leading-6 text-muted-foreground">
                    {state.review.output.strengths.map((strength) => (
                      <li key={strength}>- {strength}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {state.review.output.issues.length > 0 ? (
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Issues</p>
                  <div className="grid gap-2">
                    {state.review.output.issues.map((issue) => (
                      <div
                        className="rounded-lg border bg-muted/30 p-3"
                        key={`${issue.severity}-${issue.title}`}
                      >
                        <p className="text-sm font-medium">
                          {issue.title}{' '}
                          <span className="text-xs text-muted-foreground">
                            {issue.severity}
                          </span>
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {issue.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {state.review.output.hints.length > 0 ? (
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Hints</p>
                  <ul className="grid gap-2 text-sm leading-6 text-muted-foreground">
                    {state.review.output.hints.map((hint) => (
                      <li key={hint}>- {hint}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm font-medium">Next action</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {formatMentorNextAction(state.review.output.nextAction)}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function LessonPage() {
  const { lessonSlug, moduleSlug, technologySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { session } = useRootLayout()
  const [lessonState, setLessonState] = useState<LessonState>({
    status: 'loading',
    data: null,
    error: '',
  })
  const [progressState, setProgressState] = useState<ProgressState>({
    status: 'idle',
    data: null,
    error: '',
  })
  const [isCompletingLesson, setIsCompletingLesson] = useState(false)
  const [predictionAnswer, setPredictionAnswer] = useState<string | null>(null)
  const [isPredictionRevealed, setIsPredictionRevealed] = useState(false)
  const [isSavingPrediction, setIsSavingPrediction] = useState(false)
  const [predictionSaveError, setPredictionSaveError] = useState('')
  const [practiceAttempt, setPracticeAttempt] = useState('')
  const [isPracticeAttemptSaved, setIsPracticeAttemptSaved] = useState(false)
  const [isSavingPracticeAttempt, setIsSavingPracticeAttempt] = useState(false)
  const [practiceSaveError, setPracticeSaveError] = useState('')
  const [mentorReviewState, setMentorReviewState] = useState<MentorReviewState>(
    {
      status: 'idle',
      attempt: null,
      review: null,
      reviewedAttempt: '',
      isStale: false,
      error: '',
    },
  )
  const [isSubmittingMentorReview, setIsSubmittingMentorReview] =
    useState(false)
  const [reflectionAnswer, setReflectionAnswer] = useState('')
  const [isReflectionAccepted, setIsReflectionAccepted] = useState(false)
  const [isSavingReflection, setIsSavingReflection] = useState(false)
  const [reflectionSaveError, setReflectionSaveError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    async function loadLesson() {
      if (!technologySlug || !moduleSlug || !lessonSlug) {
        setLessonState({
          status: 'not-found',
          data: null,
          error: 'Lesson not found.',
        })
        return
      }

      setLessonState({
        status: 'loading',
        data: null,
        error: '',
      })
      setProgressState({
        status: 'idle',
        data: null,
        error: '',
      })

      setPredictionAnswer(null)
      setIsPredictionRevealed(false)
      setIsSavingPrediction(false)
      setPredictionSaveError('')
      setPracticeAttempt('')
      setIsPracticeAttemptSaved(false)
      setIsSavingPracticeAttempt(false)
      setPracticeSaveError('')
      setMentorReviewState({
        status: 'idle',
        attempt: null,
        review: null,
        reviewedAttempt: '',
        isStale: false,
        error: '',
      })
      setIsSubmittingMentorReview(false)
      setReflectionAnswer('')
      setIsReflectionAccepted(false)
      setIsSavingReflection(false)
      setReflectionSaveError('')

      try {
        const lessonDetails = await getLessonByModuleAndTechnologySlug(
          technologySlug,
          moduleSlug,
          lessonSlug,
          abortController.signal,
        )
        const tasks = lessonDetails.lesson.tasks ?? []
        const codeTask = getTaskByType(tasks, 'CODE')

        setLessonState({
          status: 'success',
          data: lessonDetails,
          error: '',
        })
        setPracticeAttempt(codeTask?.starterCode ?? '')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof TechnologiesApiError && error.status === 404) {
          setLessonState({
            status: 'not-found',
            data: null,
            error: 'Lesson not found.',
          })
          return
        }

        setLessonState({
          status: 'error',
          data: null,
          error: 'Unable to load lesson. Please try again later.',
        })
      }
    }

    void loadLesson()

    return () => {
      abortController.abort()
    }
  }, [lessonSlug, moduleSlug, technologySlug])

  function restoreTaskInteractionState(
    lessonDetails: LessonDetails,
    progress: LessonProgress,
  ) {
    const tasks = lessonDetails.lesson.tasks ?? []
    const predictionTask = getTaskByType(tasks, 'PREDICTION')
    const codeTask = getTaskByType(tasks, 'CODE')
    const reflectionTask = getTaskByType(tasks, 'REFLECTION')

    if (predictionTask) {
      const predictionProgress = getTaskProgressByTaskId(
        progress.taskProgress,
        predictionTask.id,
      )
      const selectedOptionId = getStringResponseValue(predictionProgress, [
        'selectedOptionId',
        'optionId',
      ])

      if (predictionProgress?.isCompleted && selectedOptionId) {
        setPredictionAnswer(selectedOptionId)
        setIsPredictionRevealed(true)
        setPredictionSaveError('')
      }
    }

    if (codeTask) {
      const codeProgress = getTaskProgressByTaskId(
        progress.taskProgress,
        codeTask.id,
      )
      const savedAttempt = getStringResponseValue(codeProgress, [
        'attempt',
        'code',
      ])

      if (codeProgress?.isCompleted && savedAttempt !== null) {
        setPracticeAttempt(savedAttempt)
        setIsPracticeAttemptSaved(true)
        setPracticeSaveError('')
      }
    }

    if (reflectionTask) {
      const reflectionProgress = getTaskProgressByTaskId(
        progress.taskProgress,
        reflectionTask.id,
      )
      const savedReflection = getStringResponseValue(reflectionProgress, [
        'answer',
        'reflection',
      ])

      if (reflectionProgress?.isCompleted && savedReflection !== null) {
        setReflectionAnswer(savedReflection)
        setIsReflectionAccepted(true)
        setReflectionSaveError('')
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController()

    async function loadProgress() {
      if (lessonState.status !== 'success') {
        setProgressState({
          status: 'idle',
          data: null,
          error: '',
        })
        return
      }

      if (session.isPending) {
        return
      }

      if (!session.data) {
        setProgressState({
          status: 'idle',
          data: null,
          error: '',
        })
        return
      }

      setProgressState({
        status: 'loading',
        data: null,
        error: '',
      })

      try {
        const progress = await getLessonProgress(
          lessonState.data.lesson.id,
          abortController.signal,
        )

        setProgressState({
          status: 'success',
          data: progress,
          error: '',
        })
        restoreTaskInteractionState(lessonState.data, progress)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof LessonProgressApiError && error.status === 401) {
          setProgressState({
            status: 'idle',
            data: null,
            error: '',
          })
          return
        }

        setProgressState({
          status: 'error',
          data: null,
          error: 'Unable to load lesson progress. Please try again later.',
        })
      }
    }

    void loadProgress()

    return () => {
      abortController.abort()
    }
  }, [lessonState, session.data, session.isPending])

  useEffect(() => {
    const abortController = new AbortController()

    async function loadMentorReview() {
      if (lessonState.status !== 'success') {
        setMentorReviewState({
          status: 'idle',
          attempt: null,
          review: null,
          reviewedAttempt: '',
          isStale: false,
          error: '',
        })
        return
      }

      const codeTask = getTaskByType(
        lessonState.data.lesson.tasks ?? [],
        'CODE',
      )

      if (!isMentorReviewEnabled(codeTask)) {
        setMentorReviewState({
          status: 'idle',
          attempt: null,
          review: null,
          reviewedAttempt: '',
          isStale: false,
          error: '',
        })
        return
      }

      if (session.isPending) {
        return
      }

      if (!session.data || !codeTask) {
        setMentorReviewState({
          status: 'idle',
          attempt: null,
          review: null,
          reviewedAttempt: '',
          isStale: false,
          error: '',
        })
        return
      }

      setMentorReviewState((currentState) => ({
        status: 'loading',
        attempt: currentState.attempt,
        review: currentState.review,
        reviewedAttempt: currentState.reviewedAttempt,
        isStale: currentState.isStale,
        error: '',
      }))

      try {
        const result = await getLatestLessonTaskReview(
          lessonState.data.lesson.id,
          codeTask.id,
          abortController.signal,
        )
        const restoredAttempt = getAttemptFromReviewAttempt(result.attempt)

        if (restoredAttempt !== null) {
          setPracticeAttempt(restoredAttempt)
        }

        setMentorReviewState({
          status: 'success',
          attempt: result.attempt,
          review: result.review,
          reviewedAttempt: restoredAttempt ?? '',
          isStale: false,
          error: '',
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof LessonProgressApiError && error.status === 401) {
          setMentorReviewState({
            status: 'idle',
            attempt: null,
            review: null,
            reviewedAttempt: '',
            isStale: false,
            error: '',
          })
          return
        }

        setMentorReviewState({
          status: 'error',
          attempt: null,
          review: null,
          reviewedAttempt: '',
          isStale: false,
          error: 'Unable to load mentor review. Please try again later.',
        })
      }
    }

    void loadMentorReview()

    return () => {
      abortController.abort()
    }
  }, [lessonState, session.data, session.isPending])

  function updateSavedTaskProgress(savedTaskProgress: LessonTaskProgress) {
    setProgressState((currentState) => {
      if (currentState.status !== 'success') {
        return currentState
      }

      return {
        status: 'success',
        data: {
          ...currentState.data,
          taskProgress: upsertTaskProgressItem(
            currentState.data.taskProgress,
            savedTaskProgress,
          ),
        },
        error: '',
      }
    })
  }

  function getSaveTaskProgressErrorMessage(error: unknown) {
    if (error instanceof LessonProgressApiError && error.status === 401) {
      return 'Sign in to save your progress.'
    }

    if (error instanceof LessonProgressApiError) {
      return error.message
    }

    return 'Unable to save progress. Please try again later.'
  }

  function setLessonFlowStep(step: LessonFlowStepId) {
    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.set('step', step)
    setSearchParams(nextSearchParams, { replace: true })
  }

  async function handleSavePrediction(
    lessonId: string,
    task: LessonTask,
    selectedOptionId: string,
  ) {
    if (isSavingPrediction || isPredictionRevealed) {
      return
    }

    setIsSavingPrediction(true)
    setPredictionSaveError('')

    try {
      const savedTaskProgress = await saveLessonTaskProgress(
        lessonId,
        task.id,
        {
          selectedOptionId,
        },
      )

      updateSavedTaskProgress(savedTaskProgress)
      setIsPredictionRevealed(true)
    } catch (error) {
      setPredictionSaveError(getSaveTaskProgressErrorMessage(error))
    } finally {
      setIsSavingPrediction(false)
    }
  }

  async function handleSavePracticeAttempt(lessonId: string, task: LessonTask) {
    if (isSavingPracticeAttempt || isPracticeAttemptSaved) {
      return
    }

    setIsSavingPracticeAttempt(true)
    setPracticeSaveError('')

    try {
      const savedTaskProgress = await saveLessonTaskProgress(
        lessonId,
        task.id,
        {
          attempt: practiceAttempt,
        },
      )

      updateSavedTaskProgress(savedTaskProgress)
      setIsPracticeAttemptSaved(true)
    } catch (error) {
      setPracticeSaveError(getSaveTaskProgressErrorMessage(error))
    } finally {
      setIsSavingPracticeAttempt(false)
    }
  }

  async function handleSubmitMentorReview(lessonId: string, task: LessonTask) {
    if (isSubmittingMentorReview || !isMentorReviewEnabled(task)) {
      return
    }

    setIsSubmittingMentorReview(true)
    setMentorReviewState((currentState) => ({
      status: 'loading',
      attempt: currentState.attempt,
      review: currentState.review,
      reviewedAttempt: currentState.reviewedAttempt,
      isStale: currentState.isStale,
      error: '',
    }))

    try {
      const result = await submitLessonTaskAttemptForReview(lessonId, task.id, {
        attempt: practiceAttempt,
      })
      if (!result.review) {
        throw new Error('Mentor Review was not returned.')
      }

      const reviewedAttempt = getAttemptFromReviewAttempt(result.attempt) ?? ''

      setMentorReviewState({
        status: 'success',
        attempt: result.attempt,
        review: result.review,
        reviewedAttempt,
        isStale: false,
        error: '',
      })
      setIsPracticeAttemptSaved(result.review.status === 'READY_TO_CONTINUE')

      const progress = await getLessonProgress(lessonId)
      setProgressState({
        status: 'success',
        data: progress,
        error: '',
      })
      restoreTaskInteractionState(lessonState.data!, progress)
    } catch (error) {
      setMentorReviewState((currentState) => ({
        status: 'error',
        attempt: currentState.attempt,
        review: currentState.review,
        reviewedAttempt: currentState.reviewedAttempt,
        isStale: currentState.isStale,
        error: getSaveTaskProgressErrorMessage(error),
      }))
    } finally {
      setIsSubmittingMentorReview(false)
    }
  }

  async function handleContinueWithoutReview(
    lessonId: string,
    task: LessonTask,
  ) {
    if (
      isSavingPracticeAttempt ||
      !isMentorReviewEnabled(task) ||
      !isMentorReviewUnavailable(mentorReviewState)
    ) {
      return
    }

    setIsSavingPracticeAttempt(true)
    setPracticeSaveError('')

    try {
      const savedTaskProgress = await saveLessonTaskProgress(
        lessonId,
        task.id,
        {
          attempt: practiceAttempt,
          continueWithoutReview: true,
        },
      )

      updateSavedTaskProgress(savedTaskProgress)
      setIsPracticeAttemptSaved(true)
    } catch (error) {
      setPracticeSaveError(getSaveTaskProgressErrorMessage(error))
    } finally {
      setIsSavingPracticeAttempt(false)
    }
  }

  async function handleSaveReflection(lessonId: string, task: LessonTask) {
    if (isSavingReflection || isReflectionAccepted) {
      return
    }

    setIsSavingReflection(true)
    setReflectionSaveError('')

    try {
      const savedTaskProgress = await saveLessonTaskProgress(
        lessonId,
        task.id,
        {
          answer: reflectionAnswer,
        },
      )

      updateSavedTaskProgress(savedTaskProgress)
      setIsReflectionAccepted(true)
    } catch (error) {
      setReflectionSaveError(getSaveTaskProgressErrorMessage(error))
    } finally {
      setIsSavingReflection(false)
    }
  }

  async function handleCompleteLesson(lessonId: string) {
    if (isCompletingLesson) {
      return
    }

    setIsCompletingLesson(true)
    setProgressState((currentState) => {
      if (currentState.status === 'success') {
        return {
          status: 'success',
          data: currentState.data,
          error: '',
        }
      }

      return {
        status: 'loading',
        data: null,
        error: '',
      }
    })

    try {
      const progress = await completeLesson(lessonId)

      setProgressState({
        status: 'success',
        data: progress,
        error: '',
      })
    } catch (error) {
      const message =
        error instanceof LessonProgressApiError && error.status === 401
          ? 'Sign in to track your progress.'
          : 'Unable to complete lesson. Please try again later.'

      setProgressState({
        status: 'error',
        data: null,
        error: message,
      })
    } finally {
      setIsCompletingLesson(false)
    }
  }

  const lessonDetails =
    lessonState.status === 'success' ? lessonState.data : null
  const estimatedReadingTime = lessonDetails
    ? getEstimatedReadingTime(lessonDetails.lesson.content ?? '')
    : null
  const isLessonCompleted = progressState.data?.status === 'COMPLETED'
  const lessonTasks = lessonDetails?.lesson.tasks ?? []
  const predictionTask = getTaskByType(lessonTasks, 'PREDICTION')
  const codeTask = getTaskByType(lessonTasks, 'CODE')
  const reflectionTask = getTaskByType(lessonTasks, 'REFLECTION')
  const isCodeTaskMentorReviewEnabled = isMentorReviewEnabled(codeTask)
  const codeTaskProgress = codeTask
    ? getTaskProgressByTaskId(progressState.data?.taskProgress, codeTask.id)
    : undefined
  const hasUnreviewedFallbackProgress =
    isCodeTaskMentorReviewEnabled &&
    isUnreviewedFallbackProgress(codeTaskProgress)
  const lessonFlow = getLessonFlowSteps(lessonTasks)
  const usesStepLessonFlow = lessonTasks.some((task) =>
    ['PREDICTION', 'CODE', 'REFLECTION'].includes(task.type),
  )
  const selectedPrediction = predictionTask?.options?.find(
    (option) => option.id === predictionAnswer,
  )
  const correctPredictionOptionId = getCorrectPredictionOptionId(predictionTask)
  const selectedPredictionFeedback = predictionAnswer
    ? predictionTask?.feedback?.responses?.[predictionAnswer]
    : undefined
  const lessonMarkdown = lessonDetails?.lesson.content ?? ''
  const stepLessonLearnMarkdown = getMarkdownBeforeSection(
    lessonMarkdown,
    '## 7. Practice Task',
  )
  const canSavePracticeAttempt =
    practiceAttempt.trim().length > 0 &&
    !isCodeTaskMentorReviewEnabled &&
    !isPracticeAttemptSaved &&
    !isSavingPracticeAttempt
  const canSubmitMentorReview =
    Boolean(session.data) &&
    Boolean(codeTask) &&
    isCodeTaskMentorReviewEnabled &&
    practiceAttempt.trim().length > 0 &&
    !isMentorReviewReady(mentorReviewState) &&
    !isSubmittingMentorReview
  const canContinueWithoutReview =
    Boolean(session.data) &&
    Boolean(codeTask) &&
    isCodeTaskMentorReviewEnabled &&
    isMentorReviewUnavailable(mentorReviewState) &&
    !isPracticeAttemptSaved &&
    !isSavingPracticeAttempt
  const canContinueAfterPractice = isCodeTaskMentorReviewEnabled
    ? isMentorReviewReady(mentorReviewState) || hasUnreviewedFallbackProgress
    : isPracticeAttemptSaved
  const reflectionText = reflectionAnswer.trim()
  const reflectionCharacterCount = reflectionText.length
  const reflectionWordCount = reflectionText.split(/\s+/).filter(Boolean).length
  const reflectionMinWords = reflectionTask?.validation?.minWords ?? 1
  const reflectionMinCharacters = reflectionTask?.validation?.minCharacters ?? 1
  const canAcceptReflection =
    reflectionText.length > 0 && !isReflectionAccepted && !isSavingReflection
  const nextStepAfterLearn = getNextLessonFlowStep(lessonFlow, 'learn')
  const nextStepAfterPractice = getNextLessonFlowStep(lessonFlow, 'practice')
  const finalLessonFlowStep = lessonFlow[lessonFlow.length - 1]?.id
  const requiresReflection = Boolean(reflectionTask?.isRequired)
  const canUseLessonFinishFlow =
    !usesStepLessonFlow ||
    isLessonCompleted ||
    !requiresReflection ||
    isReflectionAccepted
  const requestedLessonFlowStepValue = searchParams.get('step')
  const requestedLessonFlowStep = isLessonFlowStepId(
    requestedLessonFlowStepValue,
  )
    ? requestedLessonFlowStepValue
    : null
  const hasValidRequestedLessonFlowStep = Boolean(
    requestedLessonFlowStep &&
    hasLessonFlowStep(lessonFlow, requestedLessonFlowStep),
  )
  const hasStoredInteraction =
    Boolean(
      progressState.data?.taskProgress?.some(
        (progress) => progress.isCompleted,
      ),
    ) || Boolean(mentorReviewState.review)
  const isMentorReviewResolved =
    !isCodeTaskMentorReviewEnabled ||
    !session.data ||
    mentorReviewState.status === 'success' ||
    mentorReviewState.status === 'error'
  const canResolvePersistedLessonFlow =
    !session.isPending &&
    (!session.data ||
      progressState.status === 'success' ||
      progressState.status === 'error') &&
    isMentorReviewResolved
  const blockedLessonFlowStep = canResolvePersistedLessonFlow
    ? getFirstBlockedLessonFlowStep({
        canContinueAfterPractice,
        codeTask,
        isLessonCompleted,
        isPredictionRevealed,
        isReflectionAccepted,
        predictionTask,
        reflectionTask,
      })
    : null
  const fallbackLessonFlowStep = canResolvePersistedLessonFlow
    ? getResumeLessonFlowStep({
        blockedStep: blockedLessonFlowStep,
        hasStoredInteraction,
        isLessonCompleted,
        steps: lessonFlow,
        tasks: lessonTasks,
      })
    : getInitialLessonFlowStep(lessonTasks)
  const lessonFlowStep =
    usesStepLessonFlow &&
    requestedLessonFlowStep &&
    hasValidRequestedLessonFlowStep
      ? canResolvePersistedLessonFlow
        ? getAccessibleLessonFlowStep({
            blockedStep: blockedLessonFlowStep,
            requestedStep: requestedLessonFlowStep,
            steps: lessonFlow,
          })
        : requestedLessonFlowStep
      : fallbackLessonFlowStep
  const isAtFinalLessonFlowStep = lessonFlowStep === finalLessonFlowStep

  useEffect(() => {
    if (
      lessonState.status !== 'success' ||
      !usesStepLessonFlow ||
      (!hasValidRequestedLessonFlowStep && !canResolvePersistedLessonFlow)
    ) {
      return
    }

    if (requestedLessonFlowStepValue === lessonFlowStep) {
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.set('step', lessonFlowStep)
    setSearchParams(nextSearchParams, { replace: true })
  }, [
    canResolvePersistedLessonFlow,
    hasValidRequestedLessonFlowStep,
    isMentorReviewResolved,
    lessonFlowStep,
    lessonState.status,
    requestedLessonFlowStepValue,
    searchParams,
    setSearchParams,
    usesStepLessonFlow,
  ])

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/' },
          {
            label:
              lessonState.status === 'success'
                ? lessonState.data.technology.title
                : 'Technology',
            to: technologySlug ? `/technologies/${technologySlug}` : '/',
          },
          {
            label:
              lessonState.status === 'success'
                ? lessonState.data.module.title
                : 'Module',
            to:
              technologySlug && moduleSlug
                ? `/technologies/${technologySlug}/modules/${moduleSlug}`
                : '/',
          },
          {
            label:
              lessonState.status === 'success'
                ? lessonState.data.lesson.title
                : 'Lesson',
          },
        ]}
      />
      {lessonState.status === 'loading' ? (
        <PageLoadingState message="Loading lesson..." />
      ) : null}

      {lessonState.status === 'not-found' ? (
        <PageNotFoundState
          description="The lesson may be unavailable, unpublished, or outside this module."
          message={lessonState.error}
          title="Lesson not found"
        />
      ) : null}

      {lessonState.status === 'error' ? (
        <PageErrorState message={lessonState.error} />
      ) : null}

      {lessonDetails ? (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start">
          <main className="min-w-0">
            <section className="border-b pb-8">
              <div className="grid gap-5">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{lessonDetails.technology.title}</span>
                  <span aria-hidden="true">/</span>
                  <span>{lessonDetails.module.title}</span>
                </div>
                <div className="grid gap-3">
                  <h1 className="max-w-4xl font-heading text-4xl leading-tight font-semibold text-balance">
                    {lessonDetails.lesson.title}
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                    {lessonDetails.lesson.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {estimatedReadingTime}
                  </span>
                  <span className="inline-flex rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {formatDifficulty(lessonDetails.lesson.difficulty)}
                  </span>
                  <span className="inline-flex rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {formatLessonType(lessonDetails.lesson.type)}
                  </span>
                  <span className="inline-flex rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {isLessonCompleted ? 'Completed' : 'In progress'}
                  </span>
                </div>
              </div>
            </section>

            <section
              aria-labelledby="lesson-goal-heading"
              className="border-b py-8"
            >
              <div className="grid max-w-3xl gap-3">
                <h2
                  className="font-heading text-2xl font-semibold leading-tight"
                  id="lesson-goal-heading"
                >
                  Lesson goal
                </h2>
                <p className="text-base leading-8 text-muted-foreground">
                  {lessonDetails.lesson.description}
                </p>
              </div>
            </section>

            {usesStepLessonFlow ? (
              <LessonStepProgress
                currentStep={lessonFlowStep}
                steps={lessonFlow}
              />
            ) : null}

            {predictionTask && lessonFlowStep === 'predict' ? (
              <section
                aria-labelledby="prediction-heading"
                className="border-b py-8"
              >
                <Card className="max-w-3xl bg-muted/20">
                  <CardHeader>
                    <CardDescription>Before you continue</CardDescription>
                    <CardTitle id="prediction-heading">
                      {predictionTask.prompt}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-5">
                    {predictionTask.starterCode ? (
                      <pre className="overflow-x-auto rounded-lg border bg-background p-4 text-sm leading-6">
                        <code>{predictionTask.starterCode}</code>
                      </pre>
                    ) : null}

                    <fieldset className="grid gap-3">
                      <legend className="sr-only">
                        Choose your prediction
                      </legend>
                      {predictionTask.options?.map((option) => (
                        <label
                          className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-4 text-sm leading-6 transition-colors hover:bg-muted/50 has-checked:border-primary has-checked:ring-2 has-checked:ring-primary/20"
                          key={option.id}
                        >
                          <input
                            checked={predictionAnswer === option.id}
                            className="mt-1 size-4 accent-primary"
                            name="use-state-prediction"
                            onChange={() => {
                              setPredictionAnswer(option.id)
                              setIsPredictionRevealed(false)
                              setPredictionSaveError('')
                            }}
                            type="radio"
                            value={option.id}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </fieldset>

                    {isPredictionRevealed && selectedPrediction ? (
                      <div
                        aria-live="polite"
                        className="grid gap-2 rounded-lg border bg-background p-4"
                        role="status"
                      >
                        <p className="font-medium">
                          {selectedPrediction.id === correctPredictionOptionId
                            ? 'That is right'
                            : 'Not quite'}
                        </p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {selectedPredictionFeedback}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Choose an answer, then reveal the explanation.
                      </p>
                    )}
                    {predictionSaveError ? (
                      <p className="text-sm text-destructive" role="alert">
                        {predictionSaveError}
                      </p>
                    ) : null}
                  </CardContent>
                  <CardFooter>
                    {isPredictionRevealed ? (
                      <Button
                        onClick={() => setLessonFlowStep('learn')}
                        type="button"
                      >
                        Continue to Learn
                      </Button>
                    ) : (
                      <Button
                        disabled={!predictionAnswer || isSavingPrediction}
                        onClick={() => {
                          if (predictionAnswer) {
                            void handleSavePrediction(
                              lessonDetails.lesson.id,
                              predictionTask,
                              predictionAnswer,
                            )
                          }
                        }}
                        type="button"
                      >
                        {isSavingPrediction
                          ? 'Saving...'
                          : 'Reveal explanation'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </section>
            ) : null}

            {!usesStepLessonFlow || lessonFlowStep === 'learn' ? (
              <section
                aria-labelledby="lesson-content-heading"
                className="border-b py-8"
              >
                <div className="grid gap-6">
                  <div className="grid max-w-3xl gap-2">
                    <h2
                      className="font-heading text-2xl font-semibold leading-tight"
                      id="lesson-content-heading"
                    >
                      Lesson content
                    </h2>
                  </div>
                  <article className="grid max-w-3xl gap-5">
                    {renderMarkdown(
                      usesStepLessonFlow
                        ? stepLessonLearnMarkdown
                        : (lessonDetails.lesson.content ?? ''),
                    )}
                  </article>
                  {usesStepLessonFlow && nextStepAfterLearn ? (
                    <div className="max-w-3xl">
                      <Button
                        onClick={() => setLessonFlowStep(nextStepAfterLearn)}
                        type="button"
                      >
                        {nextStepAfterLearn === 'practice'
                          ? 'Continue to Practice'
                          : 'Continue to Reflect'}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            {codeTask && lessonFlowStep === 'practice' ? (
              <section
                aria-labelledby="lesson-code-task-heading"
                className="border-b py-8"
              >
                <Card className="max-w-3xl bg-muted/20">
                  <CardHeader>
                    <CardDescription>Apply the idea</CardDescription>
                    <CardTitle id="lesson-code-task-heading">
                      {codeTask.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <article className="grid gap-5">
                        {renderMarkdown(codeTask.prompt ?? '')}
                      </article>

                      <div className="grid gap-3 rounded-lg border bg-background p-4">
                        <div className="grid gap-1">
                          <label
                            className="text-sm font-medium"
                            htmlFor="lesson-code-attempt"
                          >
                            Your coding attempt
                          </label>
                          <p
                            className="text-sm leading-6 text-muted-foreground"
                            id="lesson-code-attempt-help"
                          >
                            Edit the starter code below. Submit your attempt
                            when you are ready for review.
                          </p>
                        </div>
                        <textarea
                          aria-describedby="lesson-code-attempt-help"
                          className="min-h-80 w-full resize-y rounded-lg border bg-muted/30 p-4 font-mono text-sm leading-6 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                          id="lesson-code-attempt"
                          onChange={(event) => {
                            const nextAttempt = event.target.value

                            setPracticeAttempt(nextAttempt)
                            setIsPracticeAttemptSaved(false)
                            setPracticeSaveError('')
                            setMentorReviewState((currentState) => ({
                              ...currentState,
                              isStale: Boolean(
                                currentState.review &&
                                nextAttempt !== currentState.reviewedAttempt,
                              ),
                            }))
                          }}
                          spellCheck={false}
                          value={practiceAttempt}
                        />
                        {isCodeTaskMentorReviewEnabled ? (
                          canContinueAfterPractice ? (
                            <p
                              className="text-sm font-medium text-primary"
                              role="status"
                            >
                              You can continue to reflection.
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Submit for Mentor Review before continuing to
                              reflection.
                            </p>
                          )
                        ) : isPracticeAttemptSaved ? (
                          <p
                            className="text-sm font-medium text-primary"
                            role="status"
                          >
                            Attempt saved. You can continue to reflection.
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Save your attempt before continuing to reflection.
                          </p>
                        )}
                        {practiceSaveError ? (
                          <p className="text-sm text-destructive" role="alert">
                            {practiceSaveError}
                          </p>
                        ) : null}

                        {isCodeTaskMentorReviewEnabled ? (
                          <div className="grid gap-3">
                            {!session.isPending && !session.data ? (
                              <p className="text-sm text-muted-foreground">
                                Sign in to submit this attempt for Mentor
                                Review.
                              </p>
                            ) : null}
                            <MentorReviewPanel state={mentorReviewState} />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-3 sm:flex-row sm:items-center">
                    {isCodeTaskMentorReviewEnabled ? (
                      <Button
                        disabled={!canSubmitMentorReview}
                        onClick={() => {
                          void handleSubmitMentorReview(
                            lessonDetails.lesson.id,
                            codeTask,
                          )
                        }}
                        type="button"
                      >
                        {isSubmittingMentorReview
                          ? 'Submitting...'
                          : mentorReviewState.review
                            ? 'Resubmit for Mentor Review'
                            : 'Submit for Mentor Review'}
                      </Button>
                    ) : null}
                    {!isCodeTaskMentorReviewEnabled ? (
                      <Button
                        disabled={!canSavePracticeAttempt}
                        onClick={() => {
                          void handleSavePracticeAttempt(
                            lessonDetails.lesson.id,
                            codeTask,
                          )
                        }}
                        type="button"
                        variant="outline"
                      >
                        {isSavingPracticeAttempt
                          ? 'Saving...'
                          : isPracticeAttemptSaved
                            ? 'Attempt saved'
                            : 'Save attempt'}
                      </Button>
                    ) : null}
                    {isCodeTaskMentorReviewEnabled &&
                    mentorReviewState.review?.status ===
                      'REVIEW_UNAVAILABLE' ? (
                      <Button
                        disabled={!canContinueWithoutReview}
                        onClick={() => {
                          void handleContinueWithoutReview(
                            lessonDetails.lesson.id,
                            codeTask,
                          )
                        }}
                        type="button"
                        variant="outline"
                      >
                        {isSavingPracticeAttempt
                          ? 'Saving...'
                          : isPracticeAttemptSaved
                            ? 'Continuing without review'
                            : 'Continue without review'}
                      </Button>
                    ) : null}
                    {nextStepAfterPractice ? (
                      <Button
                        disabled={!canContinueAfterPractice}
                        onClick={() => setLessonFlowStep(nextStepAfterPractice)}
                        type="button"
                      >
                        Continue to Reflect
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              </section>
            ) : null}

            {reflectionTask && lessonFlowStep === 'reflect' ? (
              <section
                aria-labelledby="lesson-reflection-heading"
                className="border-b py-8"
              >
                <div className="grid max-w-3xl gap-6">
                  <div className="grid gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Look back before moving on
                    </p>
                    <h2
                      className="font-heading text-2xl font-semibold leading-tight"
                      id="lesson-reflection-heading"
                    >
                      {reflectionTask.title}
                    </h2>
                  </div>
                  <article className="grid gap-5">
                    {renderMarkdown(reflectionTask.prompt ?? '')}
                  </article>
                  <div className="grid gap-3 rounded-lg border bg-muted/20 p-4">
                    <div className="grid gap-1">
                      <label
                        className="text-sm font-medium"
                        htmlFor="lesson-reflection-answer"
                      >
                        Your reflection
                      </label>
                      <p
                        className="text-sm leading-6 text-muted-foreground"
                        id="lesson-reflection-answer-help"
                      >
                        Write a short answer in your own words. This is for
                        retrieval practice, not grading.
                      </p>
                    </div>
                    <textarea
                      aria-describedby="lesson-reflection-answer-help"
                      className="min-h-32 w-full resize-y rounded-lg border bg-background p-4 text-sm leading-6 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                      id="lesson-reflection-answer"
                      onChange={(event) => {
                        setReflectionAnswer(event.target.value)
                        setIsReflectionAccepted(false)
                        setReflectionSaveError('')
                      }}
                      value={reflectionAnswer}
                    />
                    {isReflectionAccepted ? (
                      <p
                        className="text-sm font-medium text-primary"
                        role="status"
                      >
                        Reflection saved.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Write at least {reflectionMinWords} words and{' '}
                        {reflectionMinCharacters} characters before saving.
                        Current: {reflectionWordCount} words,{' '}
                        {reflectionCharacterCount} characters.
                      </p>
                    )}
                    {reflectionSaveError ? (
                      <p className="text-sm text-destructive" role="alert">
                        {reflectionSaveError}
                      </p>
                    ) : null}
                    <div>
                      <Button
                        disabled={!canAcceptReflection || isReflectionAccepted}
                        onClick={() => {
                          void handleSaveReflection(
                            lessonDetails.lesson.id,
                            reflectionTask,
                          )
                        }}
                        type="button"
                        variant="outline"
                      >
                        {isSavingReflection
                          ? 'Saving...'
                          : isReflectionAccepted
                            ? 'Reflection saved'
                            : 'Save reflection'}
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {!usesStepLessonFlow || isAtFinalLessonFlowStep ? (
              <section
                aria-labelledby="lesson-practice-heading"
                className="border-b py-8"
              >
                <Card className="bg-muted/20">
                  <CardHeader>
                    <CardTitle id="lesson-practice-heading">
                      {usesStepLessonFlow ? 'Lesson progress' : 'Practice'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usesStepLessonFlow &&
                    !isReflectionAccepted &&
                    !isLessonCompleted ? (
                      <p className="text-sm text-muted-foreground">
                        Save your reflection before marking this lesson
                        complete.
                      </p>
                    ) : null}

                    {session.isPending ? (
                      <p
                        className="text-sm text-muted-foreground"
                        role="status"
                      >
                        Checking your session...
                      </p>
                    ) : null}

                    {!session.isPending && !session.data ? (
                      <p className="text-sm text-muted-foreground">
                        Sign in to track your progress.
                      </p>
                    ) : null}

                    {session.data && progressState.status === 'loading' ? (
                      <p
                        className="text-sm text-muted-foreground"
                        role="status"
                      >
                        Loading lesson progress...
                      </p>
                    ) : null}

                    {progressState.status === 'error' ? (
                      <p className="text-sm text-destructive" role="alert">
                        {progressState.error}
                      </p>
                    ) : null}

                    {progressState.status === 'success' ? (
                      <p
                        className="text-sm text-muted-foreground"
                        role="status"
                      >
                        {isLessonCompleted ? 'Completed' : 'Not completed yet'}
                      </p>
                    ) : null}
                  </CardContent>
                  <CardFooter className="flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                    {session.data ? (
                      <Button
                        disabled={
                          !canUseLessonFinishFlow ||
                          isCompletingLesson ||
                          progressState.status === 'loading' ||
                          isLessonCompleted
                        }
                        onClick={() => {
                          void handleCompleteLesson(lessonDetails.lesson.id)
                        }}
                      >
                        {isLessonCompleted
                          ? 'Completed'
                          : isCompletingLesson
                            ? 'Completing...'
                            : 'Mark as completed'}
                      </Button>
                    ) : (
                      <Button disabled>Mark as completed</Button>
                    )}
                  </CardFooter>
                </Card>
              </section>
            ) : null}

            {!usesStepLessonFlow ||
            (isAtFinalLessonFlowStep && canUseLessonFinishFlow) ? (
              <section aria-labelledby="lesson-next-heading" className="pt-8">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle id="lesson-next-heading">Next lesson</CardTitle>
                  </CardHeader>
                  <CardFooter className="flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                    {lessonDetails.previousLesson ? (
                      <Button
                        nativeButton={false}
                        render={
                          <Link
                            to={`/technologies/${lessonDetails.technology.slug}/modules/${lessonDetails.module.slug}/lessons/${lessonDetails.previousLesson.slug}`}
                          />
                        }
                        variant="outline"
                      >
                        Previous lesson
                      </Button>
                    ) : (
                      <Button disabled variant="outline">
                        Previous lesson
                      </Button>
                    )}

                    {lessonDetails.nextLesson ? (
                      <div className="grid gap-2 sm:justify-items-end">
                        <p className="text-sm text-muted-foreground">
                          Up next: {lessonDetails.nextLesson.title}
                        </p>
                        <Button
                          nativeButton={false}
                          render={
                            <Link
                              to={`/technologies/${lessonDetails.technology.slug}/modules/${lessonDetails.module.slug}/lessons/${lessonDetails.nextLesson.slug}`}
                            />
                          }
                        >
                          Continue to next lesson
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:justify-items-end">
                        <p className="text-sm text-muted-foreground">
                          You reached the end of this module.
                        </p>
                        <Button disabled>Next lesson</Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </section>
            ) : null}
          </main>

          <aside className="grid gap-4 xl:sticky xl:top-6">
            <Card size="sm">
              <CardHeader>
                <CardDescription>Lesson overview</CardDescription>
                <CardTitle>At a glance</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Estimated time</dt>
                    <dd className="font-medium">{estimatedReadingTime}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Module</dt>
                    <dd className="font-medium">
                      {lessonDetails.module.title}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Difficulty</dt>
                    <dd className="font-medium">
                      {formatDifficulty(lessonDetails.lesson.difficulty)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Progress</dt>
                    <dd className="font-medium">
                      {session.data
                        ? isLessonCompleted
                          ? 'Completed'
                          : 'Not completed'
                        : 'Sign in to track'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
