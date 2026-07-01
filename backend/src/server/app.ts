import { fastify } from 'fastify'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import corsPlugin from './plugins/cors.plugin'
import prismaPlugin from './plugins/prisma.plugin'
import { registerRoutes } from './routes'
import { errorHandler } from '../shared/middleware/errorHandler'

export async function buildApp() {
  const app = fastify({ logger: true })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(corsPlugin)
  await app.register(prismaPlugin)

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Heroes API',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/api-docs',
  })

  app.setErrorHandler(errorHandler)
  await registerRoutes(app)

  return app
}
