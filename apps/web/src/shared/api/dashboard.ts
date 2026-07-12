import { API_BASE_URL } from '@/shared/config/api'

export type DashboardSummary = {
  continueLearning: {
    learningPathSlug: string
    learningPathTitle: string
    technologySlug: string
    technologyTitle: string
    moduleSlug: string
    moduleTitle: string
    lessonSlug: string
    lessonTitle: string
  } | null
  statistics: {
    learningPathsCompleted: number
    learningPathsTotal: number
    technologiesCompleted: number
    technologiesTotal: number
    modulesCompleted: number
    modulesTotal: number
    lessonsCompleted: number
    lessonsTotal: number
    overallProgress: number
  }
}

export class DashboardApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'DashboardApiError'
    this.status = status
  }
}

export async function getDashboard(signal?: AbortSignal) {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
    credentials: 'include',
    signal,
  })

  if (!response.ok) {
    throw new DashboardApiError(
      response.status === 401
        ? 'Authentication required.'
        : 'Unable to load dashboard.',
      response.status,
    )
  }

  return (await response.json()) as DashboardSummary
}
