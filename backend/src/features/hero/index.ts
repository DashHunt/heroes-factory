import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { heroRoutes } from './hero.routes'

async function HeroModule(fastify: FastifyInstance) {
  await fastify.register(heroRoutes)
}

export default fp(HeroModule, { name: 'hero-module' })
