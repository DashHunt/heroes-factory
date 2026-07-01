import { useQuery } from '@tanstack/react-query'
import { heroApi } from '../services/hero.api'
import { heroKeys } from '../services/hero.keys'

export function useHero(id: string | undefined) {
  return useQuery({
    queryKey: heroKeys.detail(id ?? ''),
    queryFn: () => heroApi.getById(id as string),
    enabled: Boolean(id),
    meta: {
      errorMessage: 'Erro ao carregar herói',
    },
  })
}
