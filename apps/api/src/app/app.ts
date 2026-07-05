import express from 'express'
import { toNodeHandler } from 'better-auth/node'

import { errorHandler } from '../middleware/error-handler.ts'
import { notFound } from '../middleware/not-found.ts'
import { auth } from '../modules/auth/auth.ts'
import { registerRoutes } from './routes.ts'

export function createApp() {
  const app = express()

  app.all('/api/auth/{*any}', toNodeHandler(auth))

  app.use(express.json())

  registerRoutes(app)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
