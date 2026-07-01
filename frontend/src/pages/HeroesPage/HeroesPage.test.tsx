import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HeroesPage } from './HeroesPage'
import { useHeroes } from '../../features/heroes'
import type { Hero } from '../../features/heroes'

vi.mock('../../features/heroes', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../features/heroes')>()
  return {
    ...actual,
    useHeroes: vi.fn(),
    // Testado à parte em HeroFormModal.test.tsx — aqui só evita depender de QueryClientProvider
    HeroFormModal: () => null,
  }
})

const mockedUseHeroes = vi.mocked(useHeroes)

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

describe('HeroesPage', () => {
  it('mostra o spinner enquanto isPending', () => {
    mockedUseHeroes.mockReturnValue({ isPending: true, isError: false, data: undefined } as never)

    render(<HeroesPage />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('mostra estado de erro quando isError', () => {
    mockedUseHeroes.mockReturnValue({ isPending: false, isError: true, data: undefined } as never)

    render(<HeroesPage />)

    expect(screen.getByText('Não foi possível carregar os heróis')).toBeInTheDocument()
  })

  it('mostra estado vazio quando a lista não tem heróis', () => {
    mockedUseHeroes.mockReturnValue({
      isPending: false,
      isError: false,
      data: { data: [], total: 0, page: 1, totalPages: 0 },
    } as never)

    render(<HeroesPage />)

    expect(screen.getByText('Nenhum herói encontrado')).toBeInTheDocument()
  })

  it('mostra a lista de heróis e a paginação quando há dados', () => {
    mockedUseHeroes.mockReturnValue({
      isPending: false,
      isError: false,
      data: { data: [hero], total: 1, page: 1, totalPages: 2 },
    } as never)

    render(<HeroesPage />)

    expect(screen.getByText('Hulk')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1', current: 'page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
  })
})
