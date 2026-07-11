import { API_BASE_URL } from '@/shared/config/api'

export type LearningPath = {
  id: string
  slug: string
  title: string
  description: string | null
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isPublished: boolean
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
