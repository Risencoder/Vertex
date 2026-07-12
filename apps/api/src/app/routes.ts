import type { Express } from 'express'

import { dashboardRouter } from '../modules/dashboard/dashboard.routes.ts'
import { lessonsRouter } from '../modules/lessons/lessons.routes.ts'
import { learningPathsRouter } from '../modules/learning-paths/learning-paths.routes.ts'
import { technologiesRouter } from '../modules/technologies/technologies.routes.ts'

export function registerRoutes(app: Express) {
  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' })
  })

  app.use('/api/dashboard', dashboardRouter)
  app.use('/api/learning-paths', learningPathsRouter)
  app.use('/api/lessons', lessonsRouter)
  app.use('/api/technologies', technologiesRouter)
}
