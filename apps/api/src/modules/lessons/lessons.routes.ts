import { Router } from 'express'

import { completeLesson, getLessonProgress } from './lessons.controller.ts'

export const lessonsRouter = Router()

lessonsRouter.get('/:lessonId/progress', getLessonProgress)
lessonsRouter.post('/:lessonId/complete', completeLesson)
