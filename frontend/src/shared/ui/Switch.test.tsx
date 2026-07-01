import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from './Switch'

describe('Switch', () => {
  it('reflete o estado checked via aria-checked', () => {
    const { rerender } = render(<Switch checked={false} onChange={vi.fn()} label="Ativar herói" />)
    expect(screen.getByRole('switch', { name: 'Ativar herói' })).toHaveAttribute('aria-checked', 'false')

    rerender(<Switch checked onChange={vi.fn()} label="Ativar herói" />)
    expect(screen.getByRole('switch', { name: 'Ativar herói' })).toHaveAttribute('aria-checked', 'true')
  })

  it('chama onChange com o valor invertido ao clicar', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<Switch checked={false} onChange={onChange} label="Ativar herói" />)
    await user.click(screen.getByRole('switch', { name: 'Ativar herói' }))

    expect(onChange).toHaveBeenCalledWith(true)
  })
})
