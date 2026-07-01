import { FastifyReply, FastifyRequest } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import {
  HeroInactiveError,
  HeroNotFoundError,
  HeroValidationError,
} from '../../features/hero/hero.errors'

export function errorHandler(
  error: Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof HeroNotFoundError) {
    return reply.status(404).send({ message: error.message })
  }
  if (error instanceof HeroInactiveError) {
    return reply.status(410).send({ message: error.message })
  }
  if (error instanceof HeroValidationError) {
    return reply.status(400).send({ message: error.message })
  }
  // Zod validado automaticamente na rota (schema: {...}) lança um erro do Fastify, não um ZodError puro
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({ message: 'Dados inválidos', issues: error.validation })
  }

  console.error(error)
  return reply.status(500).send({ message: 'Erro interno' })
}
