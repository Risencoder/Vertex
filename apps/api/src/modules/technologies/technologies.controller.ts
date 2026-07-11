import type { NextFunction, Request, Response } from 'express'

import {
  findPublishedLessonByModuleAndTechnologySlug,
  findPublishedModuleByTechnologyAndSlug,
  findPublishedTechnologyBySlug,
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

    const moduleDetails = await findPublishedModuleByTechnologyAndSlug(
      technologySlug,
      moduleSlug,
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
