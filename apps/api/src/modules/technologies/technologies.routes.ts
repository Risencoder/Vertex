import { Router } from 'express'

import { getTechnologyBySlug } from './technologies.controller.ts'

export const technologiesRouter = Router()

technologiesRouter.get('/:slug', getTechnologyBySlug)
