import { describe, expect, it, vi } from 'vitest'
import { toastBus } from './toastBus'

describe('toastBus', () => {
  it('notifica os listeners inscritos quando success() é chamado', () => {
    const listener = vi.fn()
    const unsubscribe = toastBus.subscribe(listener)

    toastBus.success('Herói criado com sucesso')

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'success', message: 'Herói criado com sucesso' }),
    )

    unsubscribe()
  })

  it('notifica os listeners inscritos quando error() é chamado', () => {
    const listener = vi.fn()
    const unsubscribe = toastBus.subscribe(listener)

    toastBus.error('Falha ao criar herói')

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error', message: 'Falha ao criar herói' }),
    )

    unsubscribe()
  })

  it('para de notificar depois de unsubscribe', () => {
    const listener = vi.fn()
    const unsubscribe = toastBus.subscribe(listener)
    unsubscribe()

    toastBus.success('não deveria chegar')

    expect(listener).not.toHaveBeenCalled()
  })
})
