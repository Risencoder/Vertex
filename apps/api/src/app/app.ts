import express from 'express'

import { errorHandler } from '../middleware/error-handler.ts'
import { notFound } from '../middleware/not-found.ts'
import { registerRoutes } from './routes.ts'

export function createApp() {
  const app = express()

  app.use(express.json())

  registerRoutes(app)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
