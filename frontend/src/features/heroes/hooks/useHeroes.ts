import { useQuery } from '@tanstack/react-query'
import { heroApi } from '../services/hero.api'
import { heroKeys } from '../services/hero.keys'
import type { ListHeroesParams } from '../types/hero.types'

export function useHeroes(params: ListHeroesParams) {
  return useQuery({
    queryKey: heroKeys.list(params),
    queryFn: () => heroApi.list(params),
    meta: {
      errorMessage: 'Erro ao carregar heróis',
    },
  })
}
