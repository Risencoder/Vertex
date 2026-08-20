import { SubmissionStatus } from '../../generated/prisma/index.js'
import { prisma } from '../../shared/prisma.ts'

type ProjectSubmissionInput = {
  repositoryUrl: string
  demoUrl?: string | null
  notes: string
}

type ProjectSubmissionValidationResult =
  | {
      isValid: true
      data: ProjectSubmissionInput
    }
  | {
      isValid: false
      message: string
    }

type UpsertProjectSubmissionResult =
  | {
      status: 'success'
      submission: ProjectSubmissionPayload
    }
  | {
      status: 'not-found'
    }
  | {
      status: 'locked'
    }
  | {
      status: 'invalid'
      message: string
    }

type ProjectSubmissionPayload = {
  id: string
  projectId: string
  status: SubmissionStatus
  repositoryUrl: string | null
  demoUrl: string | null
  notes: string | null
  submittedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

type GetProjectSubmissionResult =
  | {
      status: 'success'
      submission: ProjectSubmissionPayload | null
    }
  | {
      status: 'not-found'
    }

const editableSubmissionStatuses = new Set<SubmissionStatus>([
  SubmissionStatus.DRAFT,
  SubmissionStatus.SUBMITTED,
  SubmissionStatus.NEEDS_CHANGES,
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getOptionalString(value: unknown) {
  return typeof value === 'string' ? value : null
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function validateProjectSubmissionInput(
  body: unknown,
): ProjectSubmissionValidationResult {
  if (!isRecord(body)) {
    return {
      isValid: false,
      message: 'Submission data is required.',
    }
  }

  const repositoryUrl = getOptionalString(body.repositoryUrl)?.trim()
  const demoUrl = getOptionalString(body.demoUrl)?.trim()
  const notes = getOptionalString(body.notes)?.trim()

  if (!repositoryUrl) {
    return {
      isValid: false,
      message: 'Repository URL is required.',
    }
  }

  if (!isHttpUrl(repositoryUrl)) {
    return {
      isValid: false,
      message: 'Repository URL must be a valid http or https URL.',
    }
  }

  if (demoUrl && !isHttpUrl(demoUrl)) {
    return {
      isValid: false,
      message: 'Demo URL must be a valid http or https URL.',
    }
  }

  if (!notes || notes.length < 10) {
    return {
      isValid: false,
      message: 'Submission notes must be at least 10 characters.',
    }
  }

  return {
    isValid: true,
    data: {
      repositoryUrl,
      demoUrl: demoUrl || null,
      notes,
    },
  }
}

export function findPublishedProjectByTechnologyAndSlug(
  technologySlug: string,
  projectSlug: string,
) {
  return prisma.project.findFirst({
    where: {
      slug: projectSlug,
      isPublished: true,
      technology: {
        slug: technologySlug,
        isPublished: true,
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      brief: true,
      difficulty: true,
    },
  })
}

export async function getProjectSubmissionForUser(
  userId: string,
  projectId: string,
): Promise<GetProjectSubmissionResult> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      isPublished: true,
      technology: {
        isPublished: true,
      },
    },
    select: {
      id: true,
    },
  })

  if (!project) {
    return {
      status: 'not-found',
    }
  }

  const submission = await prisma.projectSubmission.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    select: {
      id: true,
      projectId: true,
      status: true,
      repositoryUrl: true,
      demoUrl: true,
      notes: true,
      submittedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return {
    status: 'success',
    submission,
  }
}

export async function upsertProjectSubmissionForUser(
  userId: string,
  projectId: string,
  body: unknown,
): Promise<UpsertProjectSubmissionResult> {
  const validationResult = validateProjectSubmissionInput(body)

  if (!validationResult.isValid) {
    return {
      status: 'invalid',
      message: validationResult.message,
    }
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      isPublished: true,
      technology: {
        isPublished: true,
      },
    },
    select: {
      id: true,
    },
  })

  if (!project) {
    return {
      status: 'not-found',
    }
  }

  const existingSubmission = await prisma.projectSubmission.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    select: {
      status: true,
    },
  })

  if (
    existingSubmission &&
    !editableSubmissionStatuses.has(existingSubmission.status)
  ) {
    return {
      status: 'locked',
    }
  }

  const submittedAt = new Date()
  const submission = await prisma.projectSubmission.upsert({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    update: {
      ...validationResult.data,
      status: SubmissionStatus.SUBMITTED,
      submittedAt,
    },
    create: {
      userId,
      projectId,
      ...validationResult.data,
      status: SubmissionStatus.SUBMITTED,
      submittedAt,
    },
    select: {
      id: true,
      projectId: true,
      status: true,
      repositoryUrl: true,
      demoUrl: true,
      notes: true,
      submittedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return {
    status: 'success',
    submission,
  }
}
