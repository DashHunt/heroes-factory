import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroConfirmationModal } from './HeroConfirmationModal'
import { useDeactivateHero } from '../hooks/useDeactivateHero'
import { useActivateHero } from '../hooks/useActivateHero'
import type { Hero } from '../types/hero.types'

vi.mock('../hooks/useDeactivateHero', () => ({ useDeactivateHero: vi.fn() }))
vi.mock('../hooks/useActivateHero', () => ({ useActivateHero: vi.fn() }))

const mockedUseDeactivateHero = vi.mocked(useDeactivateHero)
const mockedUseActivateHero = vi.mocked(useActivateHero)

const hero: Hero = {
  id: '1',
  name: 'Robert Bruce Banner',
  nickname: 'Hulk',
  date_of_birth: '1962-04-10',
  universe: 'Marvel',
  main_power: 'Força',
  avatar_url: 'https://cdn.example.com/hulk.jpg',
  is_active: true,
  created_at: '2024-01-01 00:00:00',
  updated_at: '2024-01-01 00:00:00',
}

describe('HeroConfirmationModal', () => {
  const deactivateMutate = vi.fn()
  const activateMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseDeactivateHero.mockReturnValue({ mutate: deactivateMutate, isPending: false } as never)
    mockedUseActivateHero.mockReturnValue({ mutate: activateMutate, isPending: false } as never)
  })

  it('não renderiza nada quando não há herói', () => {
    render(<HeroConfirmationModal isOpen action="delete" onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  describe('action="delete"', () => {
    it('mostra o texto de exclusão com o nickname do herói', () => {
      render(<HeroConfirmationModal isOpen action="delete" hero={hero} onClose={vi.fn()} />)
      expect(screen.getByText(/Deseja realmente excluir Hulk/)).toBeInTheDocument()
    })

    it('chama useDeactivateHero.mutate com o id ao confirmar', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      render(<HeroConfirmationModal isOpen action="delete" hero={hero} onClose={onClose} />)
      await user.click(screen.getByRole('button', { name: 'Excluir' }))

      await waitFor(() => expect(deactivateMutate).toHaveBeenCalledTimes(1))
      expect(deactivateMutate.mock.calls[0][0]).toBe('1')
      expect(activateMutate).not.toHaveBeenCalled()
    })
  })

  describe('action="activate"', () => {
    it('mostra o texto de ativação com o nickname do herói', () => {
      render(<HeroConfirmationModal isOpen action="activate" hero={hero} onClose={vi.fn()} />)
      expect(screen.getByText(/Deseja realmente ativar Hulk/)).toBeInTheDocument()
    })

    it('chama useActivateHero.mutate com o id ao confirmar', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      render(<HeroConfirmationModal isOpen action="activate" hero={hero} onClose={onClose} />)
      await user.click(screen.getByRole('button', { name: 'Ativar' }))

      await waitFor(() => expect(activateMutate).toHaveBeenCalledTimes(1))
      expect(activateMutate.mock.calls[0][0]).toBe('1')
      expect(deactivateMutate).not.toHaveBeenCalled()
    })
  })

  it('chama onClose ao cancelar', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<HeroConfirmationModal isOpen action="delete" hero={hero} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(deactivateMutate).not.toHaveBeenCalled()
  })
})
