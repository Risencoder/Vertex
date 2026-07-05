import { env } from '../config/env.ts'
import { createApp } from './app.ts'

export function startServer() {
  const app = createApp()

  app.listen(env.PORT, () => {
    console.log(`API server is running on port ${env.PORT}`)
  })
}
