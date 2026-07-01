import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('não renderiza nada quando só há 1 página', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('mostra a página atual habilitada e a próxima como desabilitada', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)

    const current = screen.getByRole('button', { name: '1' })
    expect(current).toBeDisabled()
    expect(current).toHaveAttribute('aria-current', 'page')

    expect(screen.getByRole('button', { name: '2' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: '3' })).not.toBeInTheDocument()
  })

  it('na última página, mostra a anterior como navegável em vez da próxima', () => {
    render(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: '3' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '2' })).toBeEnabled()
  })

  it('mostra as páginas corretas com base na página atual', () => {
    render(<Pagination page={4} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: '4' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '5' })).toBeEnabled()
  })

  it('chama onPageChange com o número da outra página ao clicar nela', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()

    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: '2' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
