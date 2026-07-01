import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('não renderiza nada quando isOpen é false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Excluir herói"
        description="Deseja realmente excluir?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('chama onConfirm ao clicar no botão de confirmação', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmDialog
        isOpen
        title="Excluir herói"
        description="Deseja realmente excluir Hulk?"
        confirmLabel="Excluir"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('chama onCancel ao clicar em cancelar', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmDialog
        isOpen
        title="Ativar herói"
        description="Deseja realmente ativar?"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('desabilita os botões quando isConfirming é true', () => {
    render(
      <ConfirmDialog
        isOpen
        isConfirming
        title="Excluir herói"
        description="Deseja realmente excluir?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Aguarde...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })
})
