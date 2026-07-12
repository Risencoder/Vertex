import type { Request } from 'express'

import { auth } from '../modules/auth/auth.ts'

function createHeadersFromRequest(request: Request) {
  const headers = new Headers()

  Object.entries(request.headers).forEach(([key, value]) => {
    if (typeof value === 'string') {
      headers.set(key, value)
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        headers.append(key, item)
      })
    }
  })

  return headers
}

export async function getAuthSession(request: Request) {
  return auth.api.getSession({
    headers: createHeadersFromRequest(request),
  })
}
