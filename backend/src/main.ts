import { buildApp } from './server/app'
import { env } from './shared/config/env'

async function bootstrap() {
  const app = await buildApp()
  await app.listen({ port: env.PORT, host: '0.0.0.0' })
  console.log(`SERVER RUNNING ON PORT ${env.PORT}`)
}

bootstrap()
