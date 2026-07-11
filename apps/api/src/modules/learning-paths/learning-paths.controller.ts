import type { NextFunction, Request, Response } from 'express'

import { getAuthSession } from '../../shared/auth-session.ts'
import {
  findPublishedLearningPathBySlug,
  listPublishedLearningPaths,
} from './learning-paths.service.ts'

export async function getLearningPaths(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const learningPaths = await listPublishedLearningPaths()

    response.status(200).json(learningPaths)
  } catch (error) {
    next(error)
  }
}

export async function getLearningPathBySlug(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const slug = request.params.slug

    if (typeof slug !== 'string') {
      response.status(404).json({
        error: {
          message: 'Learning path not found.',
        },
      })
      return
    }

    const session = await getAuthSession(request)
    const learningPath = await findPublishedLearningPathBySlug(
      slug,
      session?.user.id,
    )

    if (!learningPath) {
      response.status(404).json({
        error: {
          message: 'Learning path not found.',
        },
      })
      return
    }

    response.status(200).json(learningPath)
  } catch (error) {
    next(error)
  }
}
