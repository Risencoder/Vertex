import type { Express } from 'express'

export function registerRoutes(app: Express) {
  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' })
  })
}
