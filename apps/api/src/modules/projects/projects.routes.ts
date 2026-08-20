import { Router } from 'express'

import { getProjectByTechnologyAndSlug } from './projects.controller.ts'

export const projectsRouter = Router()

projectsRouter.get(
  '/:technologySlug/projects/:projectSlug',
  getProjectByTechnologyAndSlug,
)
