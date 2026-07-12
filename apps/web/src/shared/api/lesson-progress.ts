import { API_BASE_URL } from '@/shared/config/api'

export type LessonProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export type LessonProgress = {
  lessonId: string
  status: LessonProgressStatus
  completedAt: string | null
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
    throw new LessonProgressApiError(
      response.status === 401
        ? 'Authentication required.'
        : 'Unable to load lesson progress.',
      response.status,
    )
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

  return parseLessonProgressResponse(response)
}
