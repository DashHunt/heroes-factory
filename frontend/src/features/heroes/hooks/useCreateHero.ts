import { useMutation, useQueryClient } from '@tanstack/react-query'
import { heroApi } from '../services/hero.api'
import { heroKeys } from '../services/hero.keys'
import type { HeroFormValues } from '../services/hero.schema'

export function useCreateHero() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: HeroFormValues) => heroApi.create(data),
    meta: {
      successMessage: 'Herói criado com sucesso',
      errorMessage: 'Erro ao criar herói',
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroKeys.lists() })
    },
  })
}
