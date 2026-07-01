import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { heroApi } from '../services/hero.api'
import { useHeroes } from './useHeroes'
import { useHero } from './useHero'
import { useCreateHero } from './useCreateHero'
import { useUpdateHero } from './useUpdateHero'
import { useDeactivateHero } from './useDeactivateHero'
import { useActivateHero } from './useActivateHero'

vi.mock('../services/hero.api', () => ({
  heroApi: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deactivate: vi.fn(),
    activate: vi.fn(),
  },
}))

// Mock de api
const mockedHeroApi = vi.mocked(heroApi)

// Input e record mockado para criação/atualização de herói
const heroInput = {
  name: 'Robert Bruce Banner',
  nickname: 'Hulk',
  date_of_birth: '1962-04-10',
  universe: 'Marvel',
  main_power: 'Força',
  avatar_url: 'https://cdn.example.com/hulk.jpg',
}

const heroRecord = { id: '1', ...heroInput, is_active: true, created_at: '', updated_at: '' }

// Wrapper para fornecer QueryClientProvider aos hooks
function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('hooks da feature heroes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useHeroes busca a lista com os params informados', async () => {
    mockedHeroApi.list.mockResolvedValue({ data: [heroRecord], total: 1, page: 1, totalPages: 1 })

    const { result } = renderHook(() => useHeroes({ page: 1 }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedHeroApi.list).toHaveBeenCalledWith({ page: 1 })
    expect(result.current.data?.data).toHaveLength(1)
  })

  it('useHero não busca quando id é undefined', () => {
    renderHook(() => useHero(undefined), { wrapper: createWrapper() })
    expect(mockedHeroApi.getById).not.toHaveBeenCalled()
  })

  it('useHero busca o herói pelo id quando informado', async () => {
    mockedHeroApi.getById.mockResolvedValue(heroRecord)

    const { result } = renderHook(() => useHero('1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedHeroApi.getById).toHaveBeenCalledWith('1')
  })

  it('useCreateHero chama heroApi.create com os dados do form', async () => {
    mockedHeroApi.create.mockResolvedValue(heroRecord)

    const { result } = renderHook(() => useCreateHero(), { wrapper: createWrapper() })
    result.current.mutate(heroInput)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedHeroApi.create).toHaveBeenCalledWith(heroInput)
  })

  it('useUpdateHero chama heroApi.update com id e dados', async () => {
    mockedHeroApi.update.mockResolvedValue(heroRecord)

    const { result } = renderHook(() => useUpdateHero(), { wrapper: createWrapper() })
    result.current.mutate({ id: '1', data: heroInput })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedHeroApi.update).toHaveBeenCalledWith('1', heroInput)
  })

  it('useDeactivateHero chama heroApi.deactivate com o id', async () => {
    mockedHeroApi.deactivate.mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeactivateHero(), { wrapper: createWrapper() })
    result.current.mutate('1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedHeroApi.deactivate).toHaveBeenCalledWith('1')
  })

  it('useActivateHero chama heroApi.activate com o id', async () => {
    mockedHeroApi.activate.mockResolvedValue(undefined)

    const { result } = renderHook(() => useActivateHero(), { wrapper: createWrapper() })
    result.current.mutate('1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedHeroApi.activate).toHaveBeenCalledWith('1')
  })
})
