import { FastifyReply, FastifyRequest } from 'fastify'
import type { Hero } from '@prisma/client'
import { createHero, listHeroes, getHeroById, updateHero, deactivateHero, activateHero } from './hero.model'
import type { CreateHeroInput, UpdateHeroInput, ListHeroesQuery } from './hero.schema'

type IdParams = { Params: { id: string } }
type CreateRequest = { Body: CreateHeroInput }
type UpdateRequest = { Params: { id: string }; Body: UpdateHeroInput }
type ListRequest = { Querystring: ListHeroesQuery }

// Formata Date para o padrão do contrato: "YYYY-MM-DD HH:mm:ss"
function formatDate(date: Date): string {
  return date.toISOString().replace('T', ' ').slice(0, 19)
}

function toHeroResponse(hero: Hero) {
  return {
    id: hero.id,
    name: hero.name,
    nickname: hero.nickname,
    date_of_birth: formatDate(hero.date_of_birth),
    universe: hero.universe,
    main_power: hero.main_power,
    avatar_url: hero.avatar_url,
    is_active: hero.is_active,
    created_at: formatDate(hero.created_at),
    updated_at: formatDate(hero.updated_at),
  }
}

export class HeroController {
  static async create(request: FastifyRequest<CreateRequest>, reply: FastifyReply) {
    const hero = await createHero(request.body)
    return reply.status(201).send(toHeroResponse(hero))
  }

  static async list(request: FastifyRequest<ListRequest>, reply: FastifyReply) {
    const result = await listHeroes(request.query)
    return reply.status(200).send({
      data: result.data.map(toHeroResponse),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    })
  }

  static async getById(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const hero = await getHeroById(request.params.id)
    return reply.status(200).send(toHeroResponse(hero))
  }

  static async update(request: FastifyRequest<UpdateRequest>, reply: FastifyReply) {
    const hero = await updateHero(request.params.id, request.body)
    return reply.status(200).send(toHeroResponse(hero))
  }

  static async deactivate(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    await deactivateHero(request.params.id)
    return reply.status(204).send()
  }

  static async activate(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    await activateHero(request.params.id)
    return reply.status(204).send()
  }
}
