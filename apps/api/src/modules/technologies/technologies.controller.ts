import type { NextFunction, Request, Response } from 'express'

import { getAuthSession } from '../../shared/auth-session.ts'
import {
  findPublishedLessonByModuleAndTechnologySlug,
  findPublishedModuleByTechnologyAndSlug,
  findPublishedTechnologyBySlugForUser,
} from './technologies.service.ts'

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

    const session = await getAuthSession(request)
    const technology = await findPublishedTechnologyBySlugForUser(
      slug,
      session?.user.id,
    )

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

export async function getModuleByTechnologyAndSlug(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { moduleSlug, technologySlug } = request.params

    if (typeof technologySlug !== 'string' || typeof moduleSlug !== 'string') {
      response.status(404).json({
        error: {
          message: 'Module not found.',
        },
      })
      return
    }

    const session = await getAuthSession(request)
    const moduleDetails = await findPublishedModuleByTechnologyAndSlug(
      technologySlug,
      moduleSlug,
      session?.user.id,
    )

    if (!moduleDetails) {
      response.status(404).json({
        error: {
          message: 'Module not found.',
        },
      })
      return
    }

    response.status(200).json(moduleDetails)
  } catch (error) {
    next(error)
  }
}

export async function getLessonByModuleAndTechnologySlug(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { lessonSlug, moduleSlug, technologySlug } = request.params

    if (
      typeof technologySlug !== 'string' ||
      typeof moduleSlug !== 'string' ||
      typeof lessonSlug !== 'string'
    ) {
      response.status(404).json({
        error: {
          message: 'Lesson not found.',
        },
      })
      return
    }

    const lessonDetails = await findPublishedLessonByModuleAndTechnologySlug(
      technologySlug,
      moduleSlug,
      lessonSlug,
    )

    if (!lessonDetails) {
      response.status(404).json({
        error: {
          message: 'Lesson not found.',
        },
      })
      return
    }

    response.status(200).json(lessonDetails)
  } catch (error) {
    next(error)
  }
}
