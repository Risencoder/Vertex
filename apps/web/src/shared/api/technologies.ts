import { API_BASE_URL } from '@/shared/config/api'

export type TechnologyModule = {
  id: string
  slug: string
  title: string
  description: string | null
  order: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isPublished: boolean
}

export type TechnologyDetails = {
  id: string
  slug: string
  title: string
  description: string | null
  category: string | null
  isPublished: boolean
  modules: TechnologyModule[]
}

export class TechnologiesApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'TechnologiesApiError'
    this.status = status
  }
}

export async function getTechnologyBySlug(slug: string, signal?: AbortSignal) {
  const response = await fetch(
    `${API_BASE_URL}/api/technologies/${encodeURIComponent(slug)}`,
    {
      credentials: 'include',
      signal,
    },
  )

  if (!response.ok) {
    throw new TechnologiesApiError(
      response.status === 404
        ? 'Technology not found.'
        : 'Unable to load technology.',
      response.status,
    )
  }

  return (await response.json()) as TechnologyDetails
}
