import { useMutation, useQueryClient } from '@tanstack/react-query'
import { heroApi } from '../services/hero.api'
import { heroKeys } from '../services/hero.keys'

// Usado tanto pelo botão "Excluir" quanto por "Desativar" — soft delete no backend
export function useDeactivateHero() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => heroApi.deactivate(id),
    meta: {
      successMessage: 'Herói excluído com sucesso',
      errorMessage: 'Erro ao excluir herói',
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroKeys.lists() })
    },
  })
}
