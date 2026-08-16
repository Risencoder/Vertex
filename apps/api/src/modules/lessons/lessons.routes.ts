import { Router } from 'express'

import {
  completeLesson,
  getLessonProgress,
  upsertLessonTaskProgress,
} from './lessons.controller.ts'

export const lessonsRouter = Router()

lessonsRouter.get('/:lessonId/progress', getLessonProgress)
lessonsRouter.post(
  '/:lessonId/tasks/:lessonTaskId/progress',
  upsertLessonTaskProgress,
)
lessonsRouter.post('/:lessonId/complete', completeLesson)
