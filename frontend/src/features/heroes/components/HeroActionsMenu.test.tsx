import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HeroActionsMenu } from './HeroActionsMenu'

describe('HeroActionsMenu', () => {
  it('menu começa fechado', () => {
    render(<HeroActionsMenu isActive />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('quando ativo, mostra Excluir e Editar (sem Ativar)', async () => {
    const user = userEvent.setup()
    render(<HeroActionsMenu isActive />)

    await user.click(screen.getByRole('button', { name: 'Ações' }))

    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ativar' })).not.toBeInTheDocument()
  })

  it('quando inativo, mostra só o switch de Ativar (sem Excluir/Editar)', async () => {
    const user = userEvent.setup()
    render(<HeroActionsMenu isActive={false} />)

    await user.click(screen.getByRole('button', { name: 'Ações' }))

    const toggle = screen.getByRole('switch', { name: 'Ativar herói' })
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(screen.queryByRole('button', { name: 'Excluir' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument()
  })

  it('chama onEdit e fecha o menu ao clicar em Editar', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<HeroActionsMenu isActive onEdit={onEdit} />)

    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(screen.getByRole('button', { name: 'Editar' }))

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('chama onToggleActive ao acionar o switch de Ativar', async () => {
    const onToggleActive = vi.fn()
    const user = userEvent.setup()
    render(<HeroActionsMenu isActive={false} onToggleActive={onToggleActive} />)

    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(screen.getByRole('switch', { name: 'Ativar herói' }))

    expect(onToggleActive).toHaveBeenCalledTimes(1)
  })
})
