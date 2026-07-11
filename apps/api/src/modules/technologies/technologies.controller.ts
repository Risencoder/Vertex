import type { NextFunction, Request, Response } from 'express'

import { findPublishedTechnologyBySlug } from './technologies.service.ts'

export async function getTechnologyBySlug(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const slug = request.params.slug

    if (typeof slug !== 'string') {
      response.status(404).json({
        error: {
          message: 'Technology not found.',
        },
      })
      return
    }

    const technology = await findPublishedTechnologyBySlug(slug)

    if (!technology) {
      response.status(404).json({
        error: {
          message: 'Technology not found.',
        },
      })
      return
    }

    response.status(200).json(technology)
  } catch (error) {
    next(error)
  }
}
