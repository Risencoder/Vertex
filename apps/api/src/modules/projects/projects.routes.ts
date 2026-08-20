import { Router } from 'express'

import {
  getProjectByTechnologyAndSlug,
  getProjectSubmission,
  upsertProjectSubmission,
} from './projects.controller.ts'

export const technologyProjectsRouter = Router()
export const projectsRouter = Router()

technologyProjectsRouter.get(
  '/:technologySlug/projects/:projectSlug',
  getProjectByTechnologyAndSlug,
)

projectsRouter.get('/:projectId/submission', getProjectSubmission)
projectsRouter.post('/:projectId/submission', upsertProjectSubmission)
