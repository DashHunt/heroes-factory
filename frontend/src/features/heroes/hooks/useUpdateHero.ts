import { useMutation, useQueryClient } from '@tanstack/react-query'
import { heroApi } from '../services/hero.api'
import { heroKeys } from '../services/hero.keys'
import type { HeroFormValues } from '../services/hero.schema'

interface UpdateHeroInput {
  id: string
  data: HeroFormValues
}

export function useUpdateHero() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateHeroInput) => heroApi.update(id, data),
    meta: {
      successMessage: 'Herói atualizado com sucesso',
      errorMessage: 'Erro ao atualizar herói',
    },
    onSuccess: (_hero, variables) => {
      queryClient.invalidateQueries({ queryKey: heroKeys.lists() })
      queryClient.invalidateQueries({ queryKey: heroKeys.detail(variables.id) })
    },
  })
}
