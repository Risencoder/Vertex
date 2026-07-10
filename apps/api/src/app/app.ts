import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import { toNodeHandler } from 'better-auth/node'

import { env } from '../config/env.ts'
import { errorHandler } from '../middleware/error-handler.ts'
import { notFound } from '../middleware/not-found.ts'
import { auth } from '../modules/auth/auth.ts'
import { registerRoutes } from './routes.ts'

function credentialsCors(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const origin = request.headers.origin

  if (origin === env.WEB_APP_ORIGIN) {
    response.header('Access-Control-Allow-Origin', origin)
    response.header('Access-Control-Allow-Credentials', 'true')
    response.header('Vary', 'Origin')
  }

  response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  response.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  if (request.method === 'OPTIONS') {
    response.sendStatus(204)
    return
  }

  next()
}

export function createApp() {
  const app = express()

  app.use(credentialsCors)

  app.all('/api/auth/*splat', toNodeHandler(auth))

  app.use(express.json())

  registerRoutes(app)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
