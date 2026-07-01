import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroFormModal } from './HeroFormModal'
import { useCreateHero } from '../hooks/useCreateHero'
import { useUpdateHero } from '../hooks/useUpdateHero'
import type { Hero } from '../types/hero.types'

vi.mock('../hooks/useCreateHero', () => ({ useCreateHero: vi.fn() }))
vi.mock('../hooks/useUpdateHero', () => ({ useUpdateHero: vi.fn() }))

const mockedUseCreateHero = vi.mocked(useCreateHero)
const mockedUseUpdateHero = vi.mocked(useUpdateHero)

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

describe('HeroFormModal', () => {
  const createMutate = vi.fn()
  const updateMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseCreateHero.mockReturnValue({ mutate: createMutate, isPending: false } as never)
    mockedUseUpdateHero.mockReturnValue({ mutate: updateMutate, isPending: false } as never)
  })

  it('não renderiza nada quando isOpen é false', () => {
    render(<HeroFormModal isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('modo criação: envia os dados do form via useCreateHero', async () => {
    const user = userEvent.setup()
    render(<HeroFormModal isOpen onClose={vi.fn()} />)

    await user.type(screen.getByLabelText('Nome completo'), 'Robert Bruce Banner')
    await user.type(screen.getByLabelText('Nome de guerra'), 'Hulk')
    fireEvent.change(screen.getByLabelText('Data de nascimento'), { target: { value: '1962-04-10' } })
    await user.type(screen.getByLabelText('Universo'), 'Marvel')
    await user.type(screen.getByLabelText('Habilidade'), 'Força')
    await user.type(screen.getByLabelText('Avatar (URL)'), 'https://cdn.example.com/hulk.jpg')

    await user.click(screen.getByRole('button', { name: 'Criar' }))

    await waitFor(() => expect(createMutate).toHaveBeenCalledTimes(1))
    expect(createMutate.mock.calls[0][0]).toMatchObject({
      name: 'Robert Bruce Banner',
      nickname: 'Hulk',
      date_of_birth: '1962-04-10',
      universe: 'Marvel',
      main_power: 'Força',
      avatar_url: 'https://cdn.example.com/hulk.jpg',
    })
    expect(updateMutate).not.toHaveBeenCalled()
  })

  it('não envia quando os campos obrigatórios estão vazios', async () => {
    const user = userEvent.setup()
    render(<HeroFormModal isOpen onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Criar' }))

    await waitFor(() => expect(screen.getAllByText(/obrigat/i).length).toBeGreaterThan(0))
    expect(createMutate).not.toHaveBeenCalled()
  })

  it('modo edição: pré-preenche os campos e envia via useUpdateHero', async () => {
    const user = userEvent.setup()
    render(<HeroFormModal isOpen onClose={vi.fn()} hero={hero} />)

    expect(screen.getByLabelText('Nome completo')).toHaveValue('Robert Bruce Banner')
    expect(screen.getByLabelText('Data de nascimento')).toHaveValue('1962-04-10')

    await user.clear(screen.getByLabelText('Nome de guerra'))
    await user.type(screen.getByLabelText('Nome de guerra'), 'Hulk Verde')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(updateMutate).toHaveBeenCalledTimes(1))
    expect(updateMutate.mock.calls[0][0].id).toBe('1')
    expect(updateMutate.mock.calls[0][0].data.nickname).toBe('Hulk Verde')
    expect(createMutate).not.toHaveBeenCalled()
  })

  it('bloqueia a edição e mostra aviso quando o herói está inativo', () => {
    render(<HeroFormModal isOpen onClose={vi.fn()} hero={{ ...hero, is_active: false }} />)

    expect(screen.getByText('Não é possível editar um herói inativo.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nome completo')).not.toBeInTheDocument()
  })

  it('chama onClose ao clicar no X do cabeçalho', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<HeroFormModal isOpen onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Fechar formulário' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
