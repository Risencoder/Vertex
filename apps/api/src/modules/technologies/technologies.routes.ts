import { Router } from 'express'

import {
  getModuleByTechnologyAndSlug,
  getTechnologyBySlug,
} from './technologies.controller.ts'

export const technologiesRouter = Router()

technologiesRouter.get(
  '/:technologySlug/modules/:moduleSlug',
  getModuleByTechnologyAndSlug,
)
technologiesRouter.get('/:slug', getTechnologyBySlug)
