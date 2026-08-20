import type { NextFunction, Request, Response } from 'express'

import { findPublishedProjectByTechnologyAndSlug } from './projects.service.ts'

export async function getProjectByTechnologyAndSlug(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { projectSlug, technologySlug } = request.params

    if (typeof technologySlug !== 'string' || typeof projectSlug !== 'string') {
      response.status(404).json({
        error: {
          message: 'Project not found.',
        },
      })
      return
    }

    const project = await findPublishedProjectByTechnologyAndSlug(
      technologySlug,
      projectSlug,
    )

    if (!project) {
      response.status(404).json({
        error: {
          message: 'Project not found.',
        },
      })
      return
    }

    response.status(200).json(project)
  } catch (error) {
    next(error)
  }
}
