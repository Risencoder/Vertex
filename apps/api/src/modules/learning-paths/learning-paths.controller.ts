import type { NextFunction, Request, Response } from 'express'

import { listPublishedLearningPaths } from './learning-paths.service.ts'

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
