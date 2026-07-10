import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'

const DEFAULT_PORT = 4000

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../.env')

if (existsSync(envPath)) {
  loadEnvFile(envPath)
}

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
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? '',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? 'http://localhost:4000',
  WEB_APP_ORIGIN: process.env.WEB_APP_ORIGIN ?? 'http://localhost:5173',
}
