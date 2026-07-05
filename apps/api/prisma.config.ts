import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'prisma/config'

const apiRoot = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(apiRoot, '.env')

if (existsSync(envPath)) {
  loadEnvFile(envPath)
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
})
