import { z } from 'zod'

export const createHeroBodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  nickname: z.string().min(1, 'Nome de guerra é obrigatório'),
  date_of_birth: z.coerce.date(),
  universe: z.string().min(1, 'Universo é obrigatório'),
  main_power: z.string().min(1, 'Habilidade principal é obrigatória'),
  avatar_url: z.string().url('URL do avatar inválida'),
})

export const updateHeroBodySchema = z.object({
  name: z.string().min(1).optional(),
  nickname: z.string().min(1).optional(),
  date_of_birth: z.coerce.date().optional(),
  universe: z.string().min(1).optional(),
  main_power: z.string().min(1).optional(),
  avatar_url: z.string().url().optional(),
})

export const listHeroesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  search: z.string().optional(),
})

export const heroParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export const heroResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  nickname: z.string(),
  date_of_birth: z.string(),
  universe: z.string(),
  main_power: z.string(),
  avatar_url: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const listHeroesResponseSchema = z.object({
  data: z.array(heroResponseSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  issues: z.array(z.unknown()).optional(),
})

export const noContentResponseSchema = z.null()

export type CreateHeroInput = z.infer<typeof createHeroBodySchema>
export type UpdateHeroInput = z.infer<typeof updateHeroBodySchema>
export type ListHeroesQuery = z.infer<typeof listHeroesQuerySchema>
