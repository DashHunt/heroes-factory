import type { ListHeroesParams } from '../types/hero.types'

export const heroKeys = {
  all: ['heroes'] as const,
  lists: () => [...heroKeys.all, 'list'] as const,
  list: (params: ListHeroesParams) => [...heroKeys.lists(), params] as const,
  detail: (id: string) => [...heroKeys.all, 'detail', id] as const,
}
