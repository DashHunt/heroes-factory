import fp from 'fastify-plugin'
import { fastifyCors } from '@fastify/cors'
import type { FastifyInstance } from 'fastify'

async function corsPlugin(app: FastifyInstance) {
  await app.register(fastifyCors, { origin: '*' })
}

export default fp(corsPlugin, { name: 'cors-plugin' })
