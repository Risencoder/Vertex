import { Router } from 'express'

import {
  getLearningPathBySlug,
  getLearningPaths,
} from './learning-paths.controller.ts'

export const learningPathsRouter = Router()

learningPathsRouter.get('/', getLearningPaths)
learningPathsRouter.get('/:slug', getLearningPathBySlug)
