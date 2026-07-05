import type { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
) => {
  console.error(error)

  response.status(500).json({
    error: {
      message: 'Internal Server Error',
    },
  })
}
