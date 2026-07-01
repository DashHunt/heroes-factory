import fp from 'fastify-plugin'
import { fastifyCors } from '@fastify/cors'
import type { FastifyInstance } from 'fastify'

async function corsPlugin(app: FastifyInstance) {
  // @fastify/cors usa 'GET,HEAD,POST' como default de Access-Control-Allow-Methods —
  // sem isso, o preflight nunca libera PUT/PATCH/DELETE e o navegador bloqueia essas
  // chamadas antes mesmo de chegarem no servidor.
  await app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
}

export default fp(corsPlugin, { name: 'cors-plugin' })
