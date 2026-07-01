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
  it('mostra nome, nome de guerra e universo', () => {
    render(<HeroCard hero={hero} />)

    expect(screen.getByText('Hulk')).toBeInTheDocument()
    expect(screen.getByText('Robert Bruce Banner')).toBeInTheDocument()
    expect(screen.getByText('Marvel')).toBeInTheDocument()
  })

  it('não mostra a marca de "Inativo" quando o herói está ativo', () => {
    render(<HeroCard hero={hero} />)
    expect(screen.queryByText('Inativo')).not.toBeInTheDocument()
  })

  it('mostra a marca de "Inativo" quando is_active é false', () => {
    render(<HeroCard hero={{ ...hero, is_active: false }} />)
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })

  it('chama onClick ao clicar no card', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<HeroCard hero={hero} onClick={onClick} />)
    await user.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
