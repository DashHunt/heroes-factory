import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HeroCard } from './HeroCard'
import { HeroActionsContext, type HeroActionsContextValue } from '../context/HeroActionsContext'
import type { Hero } from '../types/hero.types'

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

// HeroCard chama openEdit/openDelete/openActivate via useHeroActions(), então todo
// teste precisa renderizar dentro de um HeroActionsContext.Provider (ver
// features/heroes/context/HeroActionsContext.ts).
function renderHeroCard(onClick?: () => void, actions: Partial<HeroActionsContextValue> = {}) {
  const value: HeroActionsContextValue = {
    openEdit: vi.fn(),
    openDelete: vi.fn(),
    openActivate: vi.fn(),
    ...actions,
  }

  render(
    <HeroActionsContext.Provider value={value}>
      <HeroCard hero={hero} onClick={onClick} />
    </HeroActionsContext.Provider>,
  )

  return value
}

describe('HeroCard', () => {
  it('mostra o nome de guerra e o avatar com o nome completo como alt', () => {
    renderHeroCard()

    expect(screen.getByText('Hulk')).toBeInTheDocument()
    expect(screen.getByAltText('Robert Bruce Banner')).toBeInTheDocument()
  })

  it('chama onClick ao clicar no card', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    renderHeroCard(onClick)
    await user.click(screen.getByRole('button', { name: /Hulk/ }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('não chama onClick ao clicar no botão de ações (3 pontinhos)', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    renderHeroCard(onClick)
    await user.click(screen.getByRole('button', { name: 'Ações' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('chama openDelete(hero) do context ao clicar em Excluir', async () => {
    const user = userEvent.setup()
    const openDelete = vi.fn()

    renderHeroCard(undefined, { openDelete })
    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(openDelete).toHaveBeenCalledWith(hero)
  })

  it('chama openEdit(hero) do context ao clicar em Editar', async () => {
    const user = userEvent.setup()
    const openEdit = vi.fn()

    renderHeroCard(undefined, { openEdit })
    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(screen.getByRole('button', { name: 'Editar' }))

    expect(openEdit).toHaveBeenCalledWith(hero)
  })
})
