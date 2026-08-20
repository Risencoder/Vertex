import { Router } from 'express'

import {
  completeLesson,
  getLatestLessonTaskReview,
  getLessonProgress,
  submitLessonTaskAttempt,
  upsertLessonTaskProgress,
} from './lessons.controller.ts'

export const lessonsRouter = Router()

lessonsRouter.get('/:lessonId/progress', getLessonProgress)
lessonsRouter.get(
  '/:lessonId/tasks/:lessonTaskId/review',
  getLatestLessonTaskReview,
)
lessonsRouter.post(
  '/:lessonId/tasks/:lessonTaskId/attempts',
  submitLessonTaskAttempt,
)
lessonsRouter.post(
  '/:lessonId/tasks/:lessonTaskId/progress',
  upsertLessonTaskProgress,
)
lessonsRouter.post('/:lessonId/complete', completeLesson)
