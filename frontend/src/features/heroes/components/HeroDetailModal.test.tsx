import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HeroDetailModal } from './HeroDetailModal'
import type { Hero } from '../types/hero.types'

const hero: Hero = {
  id: '1',
  name: 'Robert Bruce Banner',
  nickname: 'Hulk',
  date_of_birth: '1962-04-10 00:00:00',
  universe: 'Marvel',
  main_power: 'Força',
  avatar_url: 'https://cdn.example.com/hulk.jpg',
  is_active: true,
  created_at: '2024-01-01 00:00:00',
  updated_at: '2024-01-01 00:00:00',
}

describe('HeroDetailModal', () => {
  it('não renderiza nada quando não há herói selecionado', () => {
    render(<HeroDetailModal isOpen onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mostra o nickname como título e os dados do herói', () => {
    render(<HeroDetailModal isOpen onClose={vi.fn()} hero={hero} />)

    expect(screen.getByRole('heading', { name: 'Hulk' })).toBeInTheDocument()
    expect(screen.getByAltText('Robert Bruce Banner')).toBeInTheDocument()
    expect(screen.getByText('Robert Bruce Banner')).toBeInTheDocument()
    expect(screen.getByText('10/04/1962')).toBeInTheDocument()
    expect(screen.getByText('Marvel')).toBeInTheDocument()
    expect(screen.getByText('Força')).toBeInTheDocument()
  })

  it('chama onClose ao clicar no X', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<HeroDetailModal isOpen onClose={onClose} hero={hero} />)
    await user.click(screen.getByRole('button', { name: 'Fechar detalhes' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('chama onClose ao clicar no botão Fechar', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<HeroDetailModal isOpen onClose={onClose} hero={hero} />)
    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
