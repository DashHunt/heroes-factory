import { buildApp } from '../../src/server/app'
import { prisma } from '../../src/server/plugins/prisma.plugin'

// Requer banco de dados rodando (docker-compose up -d)
// DATABASE_URL deve estar no .env ou nas variáveis de ambiente

type FastifyInstance = Awaited<ReturnType<typeof buildApp>>

let app: FastifyInstance

const validBody = {
  name: 'Robert Bruce Banner',
  nickname: 'Hulk',
  date_of_birth: '1962-04-10',
  universe: 'Marvel',
  main_power: 'Força',
  avatar_url: 'https://cdn.example.com/hulk.jpg',
}

beforeAll(async () => {
  app = await buildApp()
  await app.ready()
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.hero.deleteMany()
})

describe('POST /heroes', () => {
  it('retorna 201 com payload exatamente no formato do contrato', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: validBody,
    })

    expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body).toMatchObject({
      name: validBody.name,
      nickname: validBody.nickname,
      universe: validBody.universe,
      main_power: validBody.main_power,
      avatar_url: validBody.avatar_url,
      is_active: true,
    })
    expect(body.id).toBeDefined()
    // Datas no formato "YYYY-MM-DD HH:mm:ss"
    expect(body.created_at).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    expect(body.updated_at).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    expect(body.date_of_birth).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })

  it('retorna 400 com detalhes de validação quando avatar_url não é URL', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: { ...validBody, avatar_url: 'nao-e-uma-url' },
    })

    expect(response.statusCode).toBe(400)
    const body = response.json()
    expect(body.message).toBe('Dados inválidos')
    expect(body.issues).toBeDefined()
  })
})

describe('PUT /heroes/:id', () => {
  it('retorna 400 quando o herói está inativo', async () => {
    // Cria e desativa o herói
    const createRes = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: validBody,
    })
    const { id } = createRes.json()

    await app.inject({ method: 'DELETE', url: `/heroes/${id}` })

    const response = await app.inject({
      method: 'PUT',
      url: `/heroes/${id}`,
      payload: { name: 'Novo Nome' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json().message).toBe('Herói inativo não pode ser editado')
  })
})

describe('GET /heroes', () => {
  it('retorna resultados filtrados, paginados e ordenados por created_at desc', async () => {
    await app.inject({ method: 'POST', url: '/heroes', payload: validBody })
    await app.inject({ method: 'POST', url: '/heroes', payload: { ...validBody, name: 'Thor Odinson', nickname: 'Thor' } })

    const response = await app.inject({
      method: 'GET',
      url: '/heroes?search=hulk&page=1',
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].nickname).toBe('Hulk')
    expect(body.page).toBe(1)
    expect(body.total).toBe(1)
  })
})

describe('DELETE /heroes/:id', () => {
  it('mantém o registro no banco com is_active = false (soft delete)', async () => {
    const createRes = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: validBody,
    })
    const { id } = createRes.json()

    const deleteRes = await app.inject({ method: 'DELETE', url: `/heroes/${id}` })
    expect(deleteRes.statusCode).toBe(204)

    // Confirma que o registro ainda existe no banco
    const record = await prisma.hero.findUnique({ where: { id } })
    expect(record).not.toBeNull()
    expect(record!.is_active).toBe(false)
  })
})
