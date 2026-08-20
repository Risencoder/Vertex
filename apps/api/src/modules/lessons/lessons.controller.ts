import type { NextFunction, Request, Response } from 'express'

import { getAuthSession } from '../../shared/auth-session.ts'
import {
  completeLessonForUser,
  getLatestLessonTaskReviewForUser,
  getLessonProgressForUser,
  submitLessonTaskAttemptForReview,
  upsertLessonTaskProgressForUser,
} from './lessons.service.ts'

function getLessonId(request: Request) {
  const { lessonId } = request.params

  return typeof lessonId === 'string' ? lessonId : null
}

function getLessonTaskId(request: Request) {
  const { lessonTaskId } = request.params

  return typeof lessonTaskId === 'string' ? lessonTaskId : null
}

function getTaskProgressResponse(request: Request) {
  const body: unknown = request.body

  if (!body || typeof body !== 'object' || !('response' in body)) {
    return null
  }

  return (body as { response: unknown }).response
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

function sendTaskNotFound(response: Response) {
  response.status(404).json({
    error: {
      message: 'Lesson task not found.',
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

function sendRequiredTasksIncomplete(
  response: Response,
  missingTaskIds: string[],
) {
  response.status(409).json({
    error: {
      message: 'Complete required lesson tasks before completing the lesson.',
      missingTaskIds,
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

    const result = await completeLessonForUser(session.user.id, lessonId)

    if (result.status === 'not-found') {
      sendLessonNotFound(response)
      return
    }

    if (result.status === 'required-tasks-incomplete') {
      sendRequiredTasksIncomplete(response, result.missingTaskIds)
      return
    }

    response.status(200).json(result.progress)
  } catch (error) {
    next(error)
  }
}

export async function upsertLessonTaskProgress(
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
    const lessonTaskId = getLessonTaskId(request)

    if (!lessonId || !lessonTaskId) {
      sendTaskNotFound(response)
      return
    }

    const result = await upsertLessonTaskProgressForUser(
      session.user.id,
      lessonId,
      lessonTaskId,
      getTaskProgressResponse(request),
    )

    if (result.status === 'not-found') {
      sendTaskNotFound(response)
      return
    }

    if (result.status === 'invalid') {
      sendValidationError(response, result.message)
      return
    }

    response.status(200).json(result.progress)
  } catch (error) {
    next(error)
  }
}

export async function submitLessonTaskAttempt(
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
    const lessonTaskId = getLessonTaskId(request)

    if (!lessonId || !lessonTaskId) {
      sendTaskNotFound(response)
      return
    }

    const result = await submitLessonTaskAttemptForReview(
      session.user.id,
      lessonId,
      lessonTaskId,
      getTaskProgressResponse(request),
    )

    if (result.status === 'not-found') {
      sendTaskNotFound(response)
      return
    }

    if (result.status === 'invalid') {
      sendValidationError(response, result.message)
      return
    }

    response.status(201).json({
      attempt: result.attempt,
      review: result.review,
    })
  } catch (error) {
    next(error)
  }
}

export async function getLatestLessonTaskReview(
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
    const lessonTaskId = getLessonTaskId(request)

    if (!lessonId || !lessonTaskId) {
      sendTaskNotFound(response)
      return
    }

    const result = await getLatestLessonTaskReviewForUser(
      session.user.id,
      lessonId,
      lessonTaskId,
    )

    if (result.status === 'not-found') {
      sendTaskNotFound(response)
      return
    }

    response.status(200).json({
      attempt: result.attempt,
      review: result.review,
    })
  } catch (error) {
    next(error)
  }
}
