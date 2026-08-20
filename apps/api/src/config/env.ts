import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'

const DEFAULT_PORT = 4000
const DEFAULT_MENTOR_PROVIDER = 'local_mock'
const DEFAULT_OPENAI_MENTOR_MODEL = 'gpt-5.6-terra'
const DEFAULT_GEMINI_MENTOR_MODEL = 'gemini-2.5-flash'

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

const mentorProvider = process.env.MENTOR_PROVIDER ?? DEFAULT_MENTOR_PROVIDER

function getDefaultMentorModel(provider: string) {
  return provider.toLowerCase() === 'gemini'
    ? DEFAULT_GEMINI_MENTOR_MODEL
    : DEFAULT_OPENAI_MENTOR_MODEL
}

export const env = {
  PORT: parsePort(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? '',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? 'http://localhost:4000',
  WEB_APP_ORIGIN: process.env.WEB_APP_ORIGIN ?? 'http://localhost:5173',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
  MENTOR_PROVIDER: mentorProvider,
  MENTOR_MODEL:
    process.env.MENTOR_MODEL ?? getDefaultMentorModel(mentorProvider),
}
