import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

async function prismaPlugin(app: FastifyInstance) {
  app.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
}

export default fp(prismaPlugin, { name: 'prisma-plugin' })
