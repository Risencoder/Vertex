import { API_BASE_URL } from '@/shared/config/api'

export type LessonProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export type LessonTaskProgressResponse = {
  selectedOptionId?: string
  optionId?: string
  attempt?: string
  code?: string
  answer?: string
  reflection?: string
  [key: string]: unknown
} | null

export type LessonTaskProgress = {
  lessonTaskId: string
  response: LessonTaskProgressResponse
  isCompleted: boolean
  completedAt: string | null
}

export type MentorReviewStatus =
  'NEEDS_IMPROVEMENT' | 'READY_TO_CONTINUE' | 'REVIEW_UNAVAILABLE'

export type MentorReviewOutput = {
  summary: string
  strengths: string[]
  issues: {
    title: string
    explanation: string
    severity: 'minor' | 'important'
  }[]
  hints: string[]
  nextAction: 'CONTINUE' | 'IMPROVE_AND_RESUBMIT' | 'REVIEW_CONCEPT'
  shouldRetry: boolean
  conceptTags: string[]
}

export type LessonTaskAttempt = {
  id: string
  lessonTaskId: string
  response: NonNullable<LessonTaskProgressResponse>
  attemptNumber: number
  submittedAt: string
  createdAt: string
}

export type LessonTaskReview = {
  id: string
  lessonTaskAttemptId: string
  status: MentorReviewStatus
  output: MentorReviewOutput | null
  provider: string | null
  model: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export type LessonTaskReviewResult = {
  attempt: LessonTaskAttempt | null
  review: LessonTaskReview | null
}

export type LessonProgress = {
  lessonId: string
  status: LessonProgressStatus
  completedAt: string | null
  taskProgress?: LessonTaskProgress[]
}

export class LessonProgressApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'LessonProgressApiError'
    this.status = status
  }
}

async function parseLessonProgressResponse(response: Response) {
  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      response.status === 401
        ? 'Authentication required.'
        : 'Unable to load lesson progress.',
    )

    throw new LessonProgressApiError(message, response.status)
  }

  return (await response.json()) as LessonProgress
}

async function parseLessonTaskProgressResponse(response: Response) {
  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      response.status === 401
        ? 'Authentication required.'
        : 'Unable to save lesson task progress.',
    )

    throw new LessonProgressApiError(message, response.status)
  }

  return (await response.json()) as LessonTaskProgress
}

async function parseLessonTaskReviewResponse(response: Response) {
  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      response.status === 401
        ? 'Authentication required.'
        : 'Unable to load mentor review.',
    )

    throw new LessonProgressApiError(message, response.status)
  }

  return (await response.json()) as LessonTaskReviewResult
}

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const errorResponse: unknown = await response.json()

    if (
      errorResponse &&
      typeof errorResponse === 'object' &&
      'error' in errorResponse
    ) {
      const error = (errorResponse as { error?: { message?: unknown } }).error

      if (typeof error?.message === 'string') {
        return error.message
      }
    }
  } catch {
    return fallback
  }

  return fallback
}

async function parseLessonCompletionResponse(response: Response) {
  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      response.status === 401
        ? 'Authentication required.'
        : 'Unable to load lesson progress.',
    )

    throw new LessonProgressApiError(message, response.status)
  }

  return (await response.json()) as LessonProgress
}

export async function getLessonProgress(
  lessonId: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/lessons/${encodeURIComponent(lessonId)}/progress`,
    {
      credentials: 'include',
      signal,
    },
  )

  return parseLessonProgressResponse(response)
}

export async function completeLesson(lessonId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/lessons/${encodeURIComponent(lessonId)}/complete`,
    {
      credentials: 'include',
      method: 'POST',
    },
  )

  return parseLessonCompletionResponse(response)
}

export async function saveLessonTaskProgress(
  lessonId: string,
  lessonTaskId: string,
  taskResponse: NonNullable<LessonTaskProgressResponse>,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/lessons/${encodeURIComponent(
      lessonId,
    )}/tasks/${encodeURIComponent(lessonTaskId)}/progress`,
    {
      body: JSON.stringify({
        response: taskResponse,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  )

  return parseLessonTaskProgressResponse(response)
}

export async function getLatestLessonTaskReview(
  lessonId: string,
  lessonTaskId: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/lessons/${encodeURIComponent(
      lessonId,
    )}/tasks/${encodeURIComponent(lessonTaskId)}/review`,
    {
      credentials: 'include',
      signal,
    },
  )

  return parseLessonTaskReviewResponse(response)
}

export async function submitLessonTaskAttemptForReview(
  lessonId: string,
  lessonTaskId: string,
  taskResponse: NonNullable<LessonTaskProgressResponse>,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/lessons/${encodeURIComponent(
      lessonId,
    )}/tasks/${encodeURIComponent(lessonTaskId)}/attempts`,
    {
      body: JSON.stringify({
        response: taskResponse,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  )

  return parseLessonTaskReviewResponse(response)
}
