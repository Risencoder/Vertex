import { API_BASE_URL } from '@/shared/config/api'

type ProjectSubmissionStatus =
  'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'REVIEWED' | 'NEEDS_CHANGES'

export type DashboardSummary = {
  continueLearning:
    | {
        type: 'lesson'
        learningPathSlug: string
        learningPathTitle: string
        technologySlug: string
        technologyTitle: string
        moduleSlug: string
        moduleTitle: string
        lessonSlug: string
        lessonTitle: string
      }
    | {
        type: 'project'
        learningPathSlug: string
        learningPathTitle: string
        technologySlug: string
        technologyTitle: string
        projectSlug: string
        projectTitle: string
        submissionStatus: ProjectSubmissionStatus | null
        submittedAt: string | null
      }
    | null
  projects: {
    submitted: number
    total: number
    items: {
      id: string
      slug: string
      title: string
      technologySlug: string
      technologyTitle: string
      learningPathSlug: string
      learningPathTitle: string
      submissionStatus: ProjectSubmissionStatus | null
      submittedAt: string | null
    }[]
  }
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
