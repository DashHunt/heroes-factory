import {
  createHero,
  listHeroes,
  getHeroById,
  updateHero,
  deactivateHero,
  activateHero,
} from '../../../../src/features/hero/hero.model'
import { HeroInactiveError, HeroNotFoundError, HeroValidationError } from '../../../../src/features/hero/hero.errors'
import { prisma } from '../../../../src/server/plugins/prisma.plugin'
import { canBeEdited, validateHero } from '../../../../src/features/hero/hero.validators'

jest.mock('../../../../src/server/plugins/prisma.plugin', () => ({
  prisma: {
    hero: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

const mockedPrisma = prisma as unknown as {
  hero: {
    create: jest.Mock
    findMany: jest.Mock
    count: jest.Mock
    findUnique: jest.Mock
    update: jest.Mock
  }
}

const validInput = {
  name: 'Robert Bruce Banner',
  nickname: 'Hulk',
  date_of_birth: new Date('1962-04-10'),
  universe: 'Marvel',
  main_power: 'Força',
  avatar_url: 'https://cdn.example.com/hulk.jpg',
}

const heroRecord = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  ...validInput,
  is_active: true,
  created_at: new Date('2024-01-01T00:00:00Z'),
  updated_at: new Date('2024-01-01T00:00:00Z'),
}

describe('validateHero()', () => {
  it('não lança erro para um input válido', () => {
    expect(() => validateHero(validInput)).not.toThrow()
  })

  it('lança HeroValidationError quando nome está vazio', () => {
    expect(() => validateHero({ ...validInput, name: '' })).toThrow(HeroValidationError)
  })

  it('lança HeroValidationError quando nickname está vazio', () => {
    expect(() => validateHero({ ...validInput, nickname: '' })).toThrow(HeroValidationError)
  })

  it('lança HeroValidationError quando universe está vazio', () => {
    expect(() => validateHero({ ...validInput, universe: '' })).toThrow(HeroValidationError)
  })

  it('lança HeroValidationError quando main_power está vazio', () => {
    expect(() => validateHero({ ...validInput, main_power: '' })).toThrow(HeroValidationError)
  })

  it('lança HeroValidationError quando avatar_url não é uma URL válida', () => {
    expect(() => validateHero({ ...validInput, avatar_url: 'nao-e-uma-url' })).toThrow(HeroValidationError)
  })

  it('lança HeroValidationError quando date_of_birth é inválida', () => {
    expect(() => validateHero({ ...validInput, date_of_birth: new Date('data-invalida') })).toThrow(HeroValidationError)
  })
})

describe('canBeEdited()', () => {
  it('retorna true quando is_active é true', () => {
    expect(canBeEdited({ ...heroRecord, is_active: true } as never)).toBe(true)
  })

  it('retorna false quando is_active é false', () => {
    expect(canBeEdited({ ...heroRecord, is_active: false } as never)).toBe(false)
  })
})

describe('createHero()', () => {
  it('valida e chama prisma.hero.create uma vez com is_active true', async () => {
    mockedPrisma.hero.create.mockResolvedValue(heroRecord)

    const result = await createHero(validInput)

    expect(mockedPrisma.hero.create).toHaveBeenCalledTimes(1)
    const callArg = mockedPrisma.hero.create.mock.calls[0][0]
    expect(callArg.data.is_active).toBe(true)
    expect(callArg.data.id).toBeDefined()
    expect(result).toEqual(heroRecord)
  })

  it('não chama prisma.hero.create quando os dados são inválidos', async () => {
    await expect(createHero({ ...validInput, name: '' })).rejects.toThrow(HeroValidationError)
    expect(mockedPrisma.hero.create).not.toHaveBeenCalled()
  })
})

describe('getHeroById()', () => {
  it('lança HeroNotFoundError quando o id não existe', async () => {
    mockedPrisma.hero.findUnique.mockResolvedValue(null)
    await expect(getHeroById('id-inexistente')).rejects.toThrow(HeroNotFoundError)
  })

  it('retorna o herói quando encontrado', async () => {
    mockedPrisma.hero.findUnique.mockResolvedValue(heroRecord)
    const result = await getHeroById(heroRecord.id)
    expect(result).toEqual(heroRecord)
  })
})

describe('updateHero()', () => {
  it('lança HeroNotFoundError quando o id não existe', async () => {
    mockedPrisma.hero.findUnique.mockResolvedValue(null)
    await expect(updateHero('id-inexistente', { name: 'Novo Nome' })).rejects.toThrow(HeroNotFoundError)
    expect(mockedPrisma.hero.update).not.toHaveBeenCalled()
  })

  it('lança HeroInactiveError quando o herói está inativo, sem chamar prisma.hero.update', async () => {
    mockedPrisma.hero.findUnique.mockResolvedValue({ ...heroRecord, is_active: false })
    await expect(updateHero(heroRecord.id, { name: 'Novo Nome' })).rejects.toThrow(HeroInactiveError)
    expect(mockedPrisma.hero.update).not.toHaveBeenCalled()
  })

  it('lança HeroValidationError quando o merge resulta em dado inválido, sem chamar prisma.hero.update', async () => {
    mockedPrisma.hero.findUnique.mockResolvedValue(heroRecord)
    await expect(updateHero(heroRecord.id, { avatar_url: 'nao-e-url' })).rejects.toThrow(HeroValidationError)
    expect(mockedPrisma.hero.update).not.toHaveBeenCalled()
  })

  it('chama prisma.hero.update apenas com os campos enviados quando o herói está ativo', async () => {
    mockedPrisma.hero.findUnique.mockResolvedValue(heroRecord)
    mockedPrisma.hero.update.mockResolvedValue({ ...heroRecord, name: 'Bruce Banner' })

    const result = await updateHero(heroRecord.id, { name: 'Bruce Banner' })

    expect(mockedPrisma.hero.update).toHaveBeenCalledTimes(1)
    expect(mockedPrisma.hero.update).toHaveBeenCalledWith({
      where: { id: heroRecord.id },
      data: { name: 'Bruce Banner' },
    })
    expect(result.name).toBe('Bruce Banner')
  })
})

describe('deactivateHero()', () => {
  it('lança HeroNotFoundError quando o id não existe', async () => {
    mockedPrisma.hero.findUnique.mockResolvedValue(null)
    await expect(deactivateHero('id-inexistente')).rejects.toThrow(HeroNotFoundError)
  })

  it('seta is_active = false via prisma.hero.update, não remove o registro', async () => {
    mockedPrisma.hero.findUnique.mockResolvedValue(heroRecord)
    mockedPrisma.hero.update.mockResolvedValue({ ...heroRecord, is_active: false })

    const result = await deactivateHero(heroRecord.id)

    expect(mockedPrisma.hero.update).toHaveBeenCalledWith({
      where: { id: heroRecord.id },
      data: { is_active: false },
    })
    expect(result.is_active).toBe(false)
  })
})

describe('activateHero()', () => {
  it('seta is_active = true via prisma.hero.update', async () => {
    mockedPrisma.hero.findUnique.mockResolvedValue({ ...heroRecord, is_active: false })
    mockedPrisma.hero.update.mockResolvedValue({ ...heroRecord, is_active: true })

    const result = await activateHero(heroRecord.id)

    expect(mockedPrisma.hero.update).toHaveBeenCalledWith({
      where: { id: heroRecord.id },
      data: { is_active: true },
    })
    expect(result.is_active).toBe(true)
  })
})

describe('listHeroes()', () => {
  it('aplica paginação (10 por página) e ordenação por created_at desc', async () => {
    mockedPrisma.hero.findMany.mockResolvedValue([])
    mockedPrisma.hero.count.mockResolvedValue(0)

    await listHeroes({ page: 2 })

    expect(mockedPrisma.hero.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { created_at: 'desc' }, take: 10, skip: 10 }),
    )
  })

  it('aplica filtro de busca por name/nickname', async () => {
    mockedPrisma.hero.findMany.mockResolvedValue([])
    mockedPrisma.hero.count.mockResolvedValue(0)

    await listHeroes({ page: 1, search: 'hulk' })

    expect(mockedPrisma.hero.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { OR: [{ name: { contains: 'hulk' } }, { nickname: { contains: 'hulk' } }] },
      }),
    )
  })

  it('usa page 1 e sem filtro quando search não é informado', async () => {
    mockedPrisma.hero.findMany.mockResolvedValue([])
    mockedPrisma.hero.count.mockResolvedValue(0)

    const result = await listHeroes({ page: 1 })

    expect(mockedPrisma.hero.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {}, skip: 0 }))
    expect(result.page).toBe(1)
  })
})
