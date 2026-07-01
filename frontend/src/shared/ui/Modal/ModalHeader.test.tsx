import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ModalHeader } from './ModalHeader'

describe('ModalHeader', () => {
  it('mostra o título', () => {
    render(<ModalHeader title="Criar herói" onClose={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Criar herói' })).toBeInTheDocument()
  })

  it('usa "Fechar" como aria-label padrão do botão de fechar', () => {
    render(<ModalHeader title="Criar herói" onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it('aceita um aria-label customizado', () => {
    render(<ModalHeader title="Detalhes" onClose={vi.fn()} closeAriaLabel="Fechar detalhes" />)
    expect(screen.getByRole('button', { name: 'Fechar detalhes' })).toBeInTheDocument()
  })

  it('chama onClose ao clicar no X', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<ModalHeader title="Criar herói" onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
