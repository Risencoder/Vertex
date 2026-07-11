import type { Express } from 'express'

import { learningPathsRouter } from '../modules/learning-paths/learning-paths.routes.ts'
import { technologiesRouter } from '../modules/technologies/technologies.routes.ts'

export function registerRoutes(app: Express) {
  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' })
  })

  app.use('/api/learning-paths', learningPathsRouter)
  app.use('/api/technologies', technologiesRouter)
}
