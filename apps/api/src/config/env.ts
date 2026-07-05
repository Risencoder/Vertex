const DEFAULT_PORT = 4000

function parsePort(value: string | undefined) {
  if (!value) {
    return DEFAULT_PORT
  }

  const port = Number(value)

  return Number.isInteger(port) && port > 0 ? port : DEFAULT_PORT
}

export const env = {
  PORT: parsePort(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
}
