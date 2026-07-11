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

export type ModuleLesson = {
  id: string
  slug: string
  title: string
  description: string | null
  order: number
  type: 'ARTICLE' | 'VIDEO' | 'EXERCISE' | 'PROJECT_PREP'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isPublished: boolean
}

export type LessonDetails = {
  technology: {
    id: string
    slug: string
    title: string
  }
  module: {
    id: string
    slug: string
    title: string
  }
  lesson: ModuleLesson & {
    content: string | null
  }
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

export type ModuleDetails = {
  technology: {
    id: string
    slug: string
    title: string
  }
  module: TechnologyModule
  lessons: ModuleLesson[]
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

export async function getModuleByTechnologyAndSlug(
  technologySlug: string,
  moduleSlug: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/technologies/${encodeURIComponent(
      technologySlug,
    )}/modules/${encodeURIComponent(moduleSlug)}`,
    {
      credentials: 'include',
      signal,
    },
  )

  if (!response.ok) {
    throw new TechnologiesApiError(
      response.status === 404 ? 'Module not found.' : 'Unable to load module.',
      response.status,
    )
  }

  return (await response.json()) as ModuleDetails
}

export async function getLessonByModuleAndTechnologySlug(
  technologySlug: string,
  moduleSlug: string,
  lessonSlug: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/technologies/${encodeURIComponent(
      technologySlug,
    )}/modules/${encodeURIComponent(moduleSlug)}/lessons/${encodeURIComponent(
      lessonSlug,
    )}`,
    {
      credentials: 'include',
      signal,
    },
  )

  if (!response.ok) {
    throw new TechnologiesApiError(
      response.status === 404 ? 'Lesson not found.' : 'Unable to load lesson.',
      response.status,
    )
  }

  return (await response.json()) as LessonDetails
}
