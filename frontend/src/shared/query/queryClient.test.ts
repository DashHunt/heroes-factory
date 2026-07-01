import { beforeEach, describe, expect, it, vi } from 'vitest'
import { queryClient } from './queryClient'
import { toastBus } from '../state/toastBus'

describe('queryClient — bridge de toast', () => {
  beforeEach(() => {
    queryClient.clear()
    vi.restoreAllMocks()
  })

  it('dispara toastBus.success quando a mutation resolve e tem meta.successMessage', async () => {
    const successSpy = vi.spyOn(toastBus, 'success')

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => 'ok',
      meta: { successMessage: 'Herói criado com sucesso' },
    })

    await mutation.execute({})

    expect(successSpy).toHaveBeenCalledWith('Herói criado com sucesso')
  })

  it('dispara toastBus.error quando a mutation rejeita e tem meta.errorMessage', async () => {
    const errorSpy = vi.spyOn(toastBus, 'error')

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => {
        throw new Error('falhou')
      },
      meta: { errorMessage: 'Falha ao criar herói' },
    })

    await expect(mutation.execute({})).rejects.toThrow('falhou')
    expect(errorSpy).toHaveBeenCalledWith('Falha ao criar herói')
  })

  it('não dispara toast quando a mutation não declara meta de mensagem', async () => {
    const successSpy = vi.spyOn(toastBus, 'success')

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => 'ok',
    })

    await mutation.execute({})

    expect(successSpy).not.toHaveBeenCalled()
  })
})
