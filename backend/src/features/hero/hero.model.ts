import { randomUUID } from "crypto";
import type { Hero } from "@prisma/client";
import { prisma } from "../../server/plugins/prisma.plugin";
import { HeroInactiveError, HeroNotFoundError } from "./hero.errors";
import { canBeEdited, validateHero } from "./hero.validators";

const PAGE_SIZE = 10;

interface HeroInput {
  name: string;
  nickname: string;
  date_of_birth: Date;
  universe: string;
  main_power: string;
  avatar_url: string;
}

interface ListHeroesParams {
  page: number;
  search?: string;
}

export async function createHero(input: HeroInput): Promise<Hero> {
  validateHero(input);
  return prisma.hero.create({
    data: { id: randomUUID(), ...input, is_active: true },
  });
}

export async function listHeroes({ page, search }: ListHeroesParams) {
  const offset = (page - 1) * PAGE_SIZE;
  const where = search
    ? {
        OR: [{ name: { contains: search } }, { nickname: { contains: search } }],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.hero.findMany({
      where,
      orderBy: { created_at: "desc" as const },
      take: PAGE_SIZE,
      skip: offset,
    }),
    prisma.hero.count({ where }),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export async function getHeroById(id: string): Promise<Hero> {
  const hero = await prisma.hero.findUnique({ where: { id } });
  if (!hero) throw new HeroNotFoundError(id);
  return hero;
}

export async function updateHero(id: string, input: Partial<HeroInput>): Promise<Hero> {
  const hero = await getHeroById(id);
  if (!canBeEdited(hero)) throw new HeroInactiveError();

  validateHero({
    name: input.name ?? hero.name,
    nickname: input.nickname ?? hero.nickname,
    date_of_birth: input.date_of_birth ?? hero.date_of_birth,
    universe: input.universe ?? hero.universe,
    main_power: input.main_power ?? hero.main_power,
    avatar_url: input.avatar_url ?? hero.avatar_url,
  });

  return prisma.hero.update({ where: { id }, data: input });
}

// Usado tanto por "Excluir" quanto por "Desativar" na UI — soft delete, nunca remove o registro
export async function deactivateHero(id: string): Promise<Hero> {
  await getHeroById(id);
  return prisma.hero.update({ where: { id }, data: { is_active: false } });
}

export async function activateHero(id: string): Promise<Hero> {
  await getHeroById(id);
  return prisma.hero.update({ where: { id }, data: { is_active: true } });
}
