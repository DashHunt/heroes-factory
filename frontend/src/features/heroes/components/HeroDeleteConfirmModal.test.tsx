import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroDeleteConfirmModal } from './HeroDeleteConfirmModal'
import { useDeactivateHero } from '../hooks/useDeactivateHero'
import type { Hero } from '../types/hero.types'

vi.mock('../hooks/useDeactivateHero', () => ({ useDeactivateHero: vi.fn() }))

const mockedUseDeactivateHero = vi.mocked(useDeactivateHero)

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

describe('HeroDeleteConfirmModal', () => {
  const mutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseDeactivateHero.mockReturnValue({ mutate, isPending: false } as never)
  })

  it('não renderiza nada quando não há herói', () => {
    render(<HeroDeleteConfirmModal isOpen onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mostra o nickname do herói na descrição', () => {
    render(<HeroDeleteConfirmModal isOpen onClose={vi.fn()} hero={hero} />)
    expect(screen.getByText(/Deseja realmente excluir Hulk/)).toBeInTheDocument()
  })

  it('chama useDeactivateHero.mutate com o id ao confirmar', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<HeroDeleteConfirmModal isOpen onClose={onClose} hero={hero} />)
    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(1))
    expect(mutate.mock.calls[0][0]).toBe('1')
  })

  it('chama onClose ao cancelar', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<HeroDeleteConfirmModal isOpen onClose={onClose} hero={hero} />)
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(mutate).not.toHaveBeenCalled()
  })
})
