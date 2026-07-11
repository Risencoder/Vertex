import { Router } from 'express'

import { getLearningPaths } from './learning-paths.controller.ts'

export const learningPathsRouter = Router()

learningPathsRouter.get('/', getLearningPaths)
