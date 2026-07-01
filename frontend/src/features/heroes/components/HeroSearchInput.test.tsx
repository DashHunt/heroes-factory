import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HeroSearchInput } from './HeroSearchInput'

describe('HeroSearchInput', () => {
  it('chama onChange com o caractere digitado', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<HeroSearchInput value="" onChange={onChange} />)
    await user.type(screen.getByRole('searchbox', { name: 'Buscar heróis' }), 'h')

    expect(onChange).toHaveBeenCalledWith('h')
  })
})
