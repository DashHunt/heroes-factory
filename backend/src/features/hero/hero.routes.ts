import { FastifyTypedInstance } from '../../shared/types/fastifyTypedInstance'
import { HeroController } from './hero.controller'
import {
  createHeroBodySchema,
  updateHeroBodySchema,
  listHeroesQuerySchema,
  heroParamsSchema,
  heroResponseSchema,
  listHeroesResponseSchema,
  errorResponseSchema,
  noContentResponseSchema,
} from './hero.schema'

export async function heroRoutes(app: FastifyTypedInstance) {
  app.post(
    '/heroes',
    {
      schema: {
        tags: ['Heroes'],
        description: 'Cria um novo herói',
        body: createHeroBodySchema,
        response: {
          201: heroResponseSchema,
          400: errorResponseSchema,
        },
      },
    },
    HeroController.create,
  )

  app.get(
    '/heroes',
    {
      schema: {
        tags: ['Heroes'],
        description: 'Lista heróis ativos paginados (10 por página), com busca opcional por name/nickname',
        querystring: listHeroesQuerySchema,
        response: {
          200: listHeroesResponseSchema.describe('Lista de heróis ativos paginada (10 por página)'),
        },
      },
    },
    HeroController.list,
  )

  app.get(
    '/heroes/:id',
    {
      schema: {
        tags: ['Heroes'],
        description: 'Busca um herói pelo id',
        params: heroParamsSchema,
        response: {
          200: heroResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    HeroController.getById,
  )

  app.put(
    '/heroes/update/:id',
    {
      schema: {
        tags: ['Heroes'],
        description: 'Atualiza os dados de um herói ativo',
        params: heroParamsSchema,
        body: updateHeroBodySchema,
        response: {
          200: heroResponseSchema,
          400: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    HeroController.update,
  )

  app.delete(
    '/heroes/:id',
    {
      schema: {
        tags: ['Heroes'],
        description: 'Desativa um herói (soft delete — não remove o registro do banco)',
        params: heroParamsSchema,
        response: {
          204: noContentResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    HeroController.deactivate,
  )

  app.patch(
    '/heroes/:id/activate',
    {
      schema: {
        tags: ['Heroes'],
        description: 'Reativa um herói previamente desativado',
        params: heroParamsSchema,
        response: {
          204: noContentResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    HeroController.activate,
  )
}
