import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HeroCard } from './HeroCard'
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

describe('HeroCard', () => {
  it('mostra o nome de guerra e o avatar com o nome completo como alt', () => {
    render(<HeroCard hero={hero} />)

    expect(screen.getByText('Hulk')).toBeInTheDocument()
    expect(screen.getByAltText('Robert Bruce Banner')).toBeInTheDocument()
  })

  it('chama onClick ao clicar no card', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<HeroCard hero={hero} onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: /Hulk/ }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('não chama onClick ao clicar no botão de ações (3 pontinhos)', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<HeroCard hero={hero} onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Ações' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('repassa onEdit/onDelete/onToggleActive pro HeroActionsMenu', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()

    render(<HeroCard hero={hero} onDelete={onDelete} />)
    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
