import type { FastifyInstance } from 'fastify'
import heroModule from '../features/hero/index'

export async function registerRoutes(app: FastifyInstance) {
  await app.register(heroModule)
}
