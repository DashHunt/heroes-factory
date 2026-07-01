import { beforeEach, describe, expect, it, vi } from 'vitest'
import { httpClient } from '../../../shared/services/httpClient'
import { heroApi } from './hero.api'
import type { HeroFormValues } from './hero.schema'

vi.mock('../../../shared/services/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}))

const mockedHttpClient = vi.mocked(httpClient)

const heroInput: HeroFormValues = {
  name: 'Robert Bruce Banner',
  nickname: 'Hulk',
  date_of_birth: '1962-04-10',
  universe: 'Marvel',
  main_power: 'Força',
  avatar_url: 'https://cdn.example.com/hulk.jpg',
}

describe('heroApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('list() chama GET /heroes com os params de paginação e busca', async () => {
    mockedHttpClient.get.mockResolvedValue({ data: { data: [], total: 0, page: 1, totalPages: 0 } })

    await heroApi.list({ page: 2, search: 'hulk' })

    expect(mockedHttpClient.get).toHaveBeenCalledWith('/heroes', { params: { page: 2, search: 'hulk' } })
  })

  it('getById() chama GET /heroes/:id', async () => {
    mockedHttpClient.get.mockResolvedValue({ data: { id: '1' } })

    await heroApi.getById('1')

    expect(mockedHttpClient.get).toHaveBeenCalledWith('/heroes/1')
  })

  it('create() chama POST /heroes com o payload', async () => {
    mockedHttpClient.post.mockResolvedValue({ data: { id: '1', ...heroInput } })

    await heroApi.create(heroInput)

    expect(mockedHttpClient.post).toHaveBeenCalledWith('/heroes', heroInput)
  })

  it('update() chama PUT /heroes/:id com o payload', async () => {
    mockedHttpClient.put.mockResolvedValue({ data: { id: '1', ...heroInput } })

    await heroApi.update('1', heroInput)

    expect(mockedHttpClient.put).toHaveBeenCalledWith('/heroes/1', heroInput)
  })

  it('deactivate() chama DELETE /heroes/:id', async () => {
    mockedHttpClient.delete.mockResolvedValue({ data: undefined })

    await heroApi.deactivate('1')

    expect(mockedHttpClient.delete).toHaveBeenCalledWith('/heroes/1')
  })

  it('activate() chama PATCH /heroes/:id/activate', async () => {
    mockedHttpClient.patch.mockResolvedValue({ data: undefined })

    await heroApi.activate('1')

    expect(mockedHttpClient.patch).toHaveBeenCalledWith('/heroes/1/activate')
  })
})
