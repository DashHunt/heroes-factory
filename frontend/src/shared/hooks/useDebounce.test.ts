import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  it('mantém o valor inicial antes do delay passar', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useDebounce('a', 300))
    expect(result.current).toBe('a')
    vi.useRealTimers()
  })

  it('atualiza para o valor mais recente depois do delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('ab')
    vi.useRealTimers()
  })
})
