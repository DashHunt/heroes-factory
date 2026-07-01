import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ModalActions } from './ModalActions'

describe('ModalActions', () => {
  it('por padrão, mostra só o botão de Fechar', () => {
    render(<ModalActions onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })

  it('chama onClose ao clicar em Fechar', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<ModalActions onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('com showSave, mostra Cancelar + Salvar (sem o Fechar)', () => {
    render(<ModalActions onClose={vi.fn()} showSave />)

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Fechar' })).not.toBeInTheDocument()
  })

  it('usa saveLabel customizado e desabilita os botões quando isSaving', () => {
    render(<ModalActions onClose={vi.fn()} showSave saveLabel="Criar" isSaving />)

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDisabled()
  })

  it('chama onClose ao clicar em Cancelar', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<ModalActions onClose={onClose} showSave />)
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
