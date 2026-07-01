import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'react-toastify'

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const { queryClient } = await import('./queryClient')

describe('queryClient — bridge de toast (react-toastify)', () => {
  beforeEach(() => {
    queryClient.clear()
    vi.clearAllMocks()
  })

  it('dispara toast.success quando a mutation resolve e tem meta.successMessage', async () => {
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => 'ok',
      meta: { successMessage: 'Herói criado com sucesso' },
    })

    await mutation.execute({})

    expect(toast.success).toHaveBeenCalledWith('Herói criado com sucesso')
  })

  it('dispara toast.error quando a mutation rejeita e tem meta.errorMessage', async () => {
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => {
        throw new Error('falhou')
      },
      meta: { errorMessage: 'Falha ao criar herói' },
    })

    await expect(mutation.execute({})).rejects.toThrow('falhou')
    expect(toast.error).toHaveBeenCalledWith('Falha ao criar herói: falhou')
  })

  it('não dispara toast quando a mutation não declara meta de mensagem', async () => {
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => 'ok',
    })

    await mutation.execute({})

    expect(toast.success).not.toHaveBeenCalled()
  })
})
