import { useMutation, useQueryClient } from '@tanstack/react-query'
import { heroApi } from '../services/hero.api'
import { heroKeys } from '../services/hero.keys'

export function useActivateHero() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => heroApi.activate(id),
    meta: {
      successMessage: 'Herói ativado com sucesso',
      errorMessage: 'Erro ao ativar herói',
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroKeys.lists() })
    },
  })
}
