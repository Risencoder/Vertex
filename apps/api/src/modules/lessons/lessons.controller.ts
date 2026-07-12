import type { NextFunction, Request, Response } from 'express'

import { getAuthSession } from '../../shared/auth-session.ts'
import {
  completeLessonForUser,
  getLessonProgressForUser,
} from './lessons.service.ts'

function getLessonId(request: Request) {
  const { lessonId } = request.params

  return typeof lessonId === 'string' ? lessonId : null
}

function sendUnauthorized(response: Response) {
  response.status(401).json({
    error: {
      message: 'Authentication required.',
    },
  })
}

function sendLessonNotFound(response: Response) {
  response.status(404).json({
    error: {
      message: 'Lesson not found.',
    },
  })
}

export async function getLessonProgress(
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

    const lessonId = getLessonId(request)

    if (!lessonId) {
      sendLessonNotFound(response)
      return
    }

    const progress = await getLessonProgressForUser(session.user.id, lessonId)

    if (!progress) {
      sendLessonNotFound(response)
      return
    }

    response.status(200).json(progress)
  } catch (error) {
    next(error)
  }
}

export async function completeLesson(
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

    const lessonId = getLessonId(request)

    if (!lessonId) {
      sendLessonNotFound(response)
      return
    }

    const progress = await completeLessonForUser(session.user.id, lessonId)

    if (!progress) {
      sendLessonNotFound(response)
      return
    }

    response.status(200).json(progress)
  } catch (error) {
    next(error)
  }
}
