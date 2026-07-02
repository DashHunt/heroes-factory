import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HeroActionsMenu } from './HeroActionsMenu'
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

// HeroActionsMenu chama openEdit/openDelete/openActivate via useHeroActions(),
// então todo teste precisa renderizar dentro de um HeroActionsContext.Provider.
function renderHeroActionsMenu(isActive: boolean, actions: Partial<HeroActionsContextValue> = {}) {
  const value: HeroActionsContextValue = {
    openEdit: vi.fn(),
    openDelete: vi.fn(),
    openActivate: vi.fn(),
    ...actions,
  }

  render(
    <HeroActionsContext.Provider value={value}>
      <HeroActionsMenu hero={hero} isActive={isActive} />
    </HeroActionsContext.Provider>,
  )

  return value
}

describe('HeroActionsMenu', () => {
  it('menu começa fechado', () => {
    renderHeroActionsMenu(true)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('quando ativo, mostra Excluir e Editar (sem Ativar)', async () => {
    const user = userEvent.setup()
    renderHeroActionsMenu(true)

    await user.click(screen.getByRole('button', { name: 'Ações' }))

    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
    expect(screen.queryByRole('switch', { name: 'Ativar herói' })).not.toBeInTheDocument()
  })

  it('quando inativo, mostra só o switch de Ativar (sem Excluir/Editar)', async () => {
    const user = userEvent.setup()
    renderHeroActionsMenu(false)

    await user.click(screen.getByRole('button', { name: 'Ações' }))

    const toggle = screen.getByRole('switch', { name: 'Ativar herói' })
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(screen.queryByRole('button', { name: 'Excluir' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument()
  })

  it('chama openEdit(hero) do context e fecha o menu ao clicar em Editar', async () => {
    const user = userEvent.setup()
    const openEdit = vi.fn()
    renderHeroActionsMenu(true, { openEdit })

    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(screen.getByRole('button', { name: 'Editar' }))

    expect(openEdit).toHaveBeenCalledWith(hero)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('chama openDelete(hero) do context ao clicar em Excluir', async () => {
    const user = userEvent.setup()
    const openDelete = vi.fn()
    renderHeroActionsMenu(true, { openDelete })

    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(openDelete).toHaveBeenCalledWith(hero)
  })

  it('chama openActivate(hero) do context ao acionar o switch de Ativar', async () => {
    const user = userEvent.setup()
    const openActivate = vi.fn()
    renderHeroActionsMenu(false, { openActivate })

    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(screen.getByRole('switch', { name: 'Ativar herói' }))

    expect(openActivate).toHaveBeenCalledWith(hero)
  })
})
