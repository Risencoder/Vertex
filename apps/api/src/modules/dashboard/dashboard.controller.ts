import type { NextFunction, Request, Response } from 'express'

import { getAuthSession } from '../../shared/auth-session.ts'
import { getDashboardForUser } from './dashboard.service.ts'

export async function getDashboard(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const session = await getAuthSession(request)

    if (!session?.user.id) {
      response.status(401).json({
        error: {
          message: 'Authentication required.',
        },
      })
      return
    }

    const dashboard = await getDashboardForUser(session.user.id)

    response.status(200).json(dashboard)
  } catch (error) {
    next(error)
  }
}
