import { API_BASE_URL } from '@/shared/config/api'

export type ProjectDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export type ProjectDetails = {
  id: string
  slug: string
  title: string
  description: string | null
  brief: string | null
  difficulty: ProjectDifficulty
}

export type ProjectSubmissionStatus =
  'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'REVIEWED' | 'NEEDS_CHANGES'

export type ProjectSubmission = {
  id: string
  projectId: string
  status: ProjectSubmissionStatus
  repositoryUrl: string | null
  demoUrl: string | null
  notes: string | null
  submittedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectSubmissionInput = {
  repositoryUrl: string
  demoUrl?: string
  notes: string
}

export class ProjectsApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ProjectsApiError'
    this.status = status
  }
}

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as {
      error?: {
        message?: string
      }
    }

    return body.error?.message ?? fallback
  } catch {
    return fallback
  }
}

export async function getProjectByTechnologyAndSlug(
  technologySlug: string,
  projectSlug: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/technologies/${encodeURIComponent(
      technologySlug,
    )}/projects/${encodeURIComponent(projectSlug)}`,
    {
      credentials: 'include',
      signal,
    },
  )

  if (!response.ok) {
    throw new ProjectsApiError(
      response.status === 404
        ? 'Project not found.'
        : 'Unable to load project.',
      response.status,
    )
  }

  return (await response.json()) as ProjectDetails
}

export async function getProjectSubmission(
  projectId: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${encodeURIComponent(projectId)}/submission`,
    {
      credentials: 'include',
      signal,
    },
  )

  if (!response.ok) {
    throw new ProjectsApiError(
      response.status === 401
        ? 'Authentication required.'
        : await getErrorMessage(response, 'Unable to load project submission.'),
      response.status,
    )
  }

  return (await response.json()) as {
    submission: ProjectSubmission | null
  }
}

export async function submitProject(
  projectId: string,
  input: ProjectSubmissionInput,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${encodeURIComponent(projectId)}/submission`,
    {
      body: JSON.stringify(input),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  )

  if (!response.ok) {
    throw new ProjectsApiError(
      response.status === 401
        ? 'Authentication required.'
        : await getErrorMessage(response, 'Unable to submit project.'),
      response.status,
    )
  }

  return (await response.json()) as {
    submission: ProjectSubmission
  }
}
