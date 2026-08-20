import type { NextFunction, Request, Response } from 'express'

import { getAuthSession } from '../../shared/auth-session.ts'
import {
  findPublishedProjectByTechnologyAndSlug,
  getProjectSubmissionForUser,
  upsertProjectSubmissionForUser,
} from './projects.service.ts'

function getProjectId(request: Request) {
  const { projectId } = request.params

  return typeof projectId === 'string' ? projectId : null
}

function sendUnauthorized(response: Response) {
  response.status(401).json({
    error: {
      message: 'Authentication required.',
    },
  })
}

function sendProjectNotFound(response: Response) {
  response.status(404).json({
    error: {
      message: 'Project not found.',
    },
  })
}

function sendValidationError(response: Response, message: string) {
  response.status(400).json({
    error: {
      message,
    },
  })
}

function sendSubmissionLocked(response: Response) {
  response.status(409).json({
    error: {
      message: 'Project submission cannot be updated in its current status.',
    },
  })
}

export async function getProjectByTechnologyAndSlug(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { projectSlug, technologySlug } = request.params

    if (typeof technologySlug !== 'string' || typeof projectSlug !== 'string') {
      sendProjectNotFound(response)
      return
    }

    const project = await findPublishedProjectByTechnologyAndSlug(
      technologySlug,
      projectSlug,
    )

    if (!project) {
      sendProjectNotFound(response)
      return
    }

    response.status(200).json(project)
  } catch (error) {
    next(error)
  }
}

export async function getProjectSubmission(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const session = await getAuthSession(request)

    if (!session?.user.id) {
      sendUnauthorized(response)
      return
    }

    const projectId = getProjectId(request)

    if (!projectId) {
      sendProjectNotFound(response)
      return
    }

    const result = await getProjectSubmissionForUser(session.user.id, projectId)

    if (result.status === 'not-found') {
      sendProjectNotFound(response)
      return
    }

    response.status(200).json({
      submission: result.submission,
    })
  } catch (error) {
    next(error)
  }
}

export async function upsertProjectSubmission(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const session = await getAuthSession(request)

    if (!session?.user.id) {
      sendUnauthorized(response)
      return
    }

    const projectId = getProjectId(request)

    if (!projectId) {
      sendProjectNotFound(response)
      return
    }

    const result = await upsertProjectSubmissionForUser(
      session.user.id,
      projectId,
      request.body,
    )

    if (result.status === 'not-found') {
      sendProjectNotFound(response)
      return
    }

    if (result.status === 'invalid') {
      sendValidationError(response, result.message)
      return
    }

    if (result.status === 'locked') {
      sendSubmissionLocked(response)
      return
    }

    response.status(200).json({
      submission: result.submission,
    })
  } catch (error) {
    next(error)
  }
}
