import { httpClient } from '../../../shared/services/httpClient'
import type { PaginatedResult } from '../../../shared/types/pagination.types'
import type { Hero, ListHeroesParams } from '../types/hero.types'
import type { HeroFormValues } from './hero.schema'

export const heroApi = {
  list: async (params: ListHeroesParams): Promise<PaginatedResult<Hero>> => {
    const response = await httpClient.get<PaginatedResult<Hero>>('/heroes', { params })
    return response.data
  },

  getById: async (id: string): Promise<Hero> => {
    const response = await httpClient.get<Hero>(`/heroes/${id}`)
    return response.data
  },

  create: async (data: HeroFormValues): Promise<Hero> => {
    const response = await httpClient.post<Hero>('/heroes', data)
    return response.data
  },

  update: async (id: string, data: HeroFormValues): Promise<Hero> => {
    const response = await httpClient.put<Hero>(`/heroes/update/${id}`, data)
    return response.data
  },

  // Soft delete — usado tanto pelo "Excluir" quanto pelo "Desativar" da UI
  deactivate: async (id: string): Promise<void> => {
    await httpClient.delete(`/heroes/${id}`)
  },

  activate: async (id: string): Promise<void> => {
    await httpClient.patch(`/heroes/${id}/activate`)
  },
}
