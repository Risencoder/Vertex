import { Router } from 'express'

import { getDashboard } from './dashboard.controller.ts'

export const dashboardRouter = Router()

dashboardRouter.get('/', getDashboard)
