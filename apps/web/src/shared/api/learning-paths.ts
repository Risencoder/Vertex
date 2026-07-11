import { API_BASE_URL } from '@/shared/config/api'

export type LearningPath = {
  id: string
  slug: string
  title: string
  description: string | null
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isPublished: boolean
}

export type Technology = {
  id: string
  slug: string
  name: string
  description: string | null
}

export type LearningPathDetails = Omit<LearningPath, 'isPublished'> & {
  technologies: Technology[]
}

export class LearningPathsApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'LearningPathsApiError'
    this.status = status
  }
}

export async function getLearningPaths(signal?: AbortSignal) {
  const response = await fetch(`${API_BASE_URL}/api/learning-paths`, {
    credentials: 'include',
    signal,
  })

  if (!response.ok) {
    throw new Error('Unable to load learning paths.')
  }

  return (await response.json()) as LearningPath[]
}

export async function getLearningPathBySlug(
  slug: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/learning-paths/${encodeURIComponent(slug)}`,
    {
      credentials: 'include',
      signal,
    },
  )

  if (!response.ok) {
    throw new LearningPathsApiError(
      response.status === 404
        ? 'Learning path not found.'
        : 'Unable to load learning path.',
      response.status,
    )
  }

  return (await response.json()) as LearningPathDetails
}
