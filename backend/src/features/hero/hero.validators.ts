import { HeroValidationError } from "./hero.errors";
import type { Hero } from "@prisma/client";

interface HeroInput {
  name: string;
  nickname: string;
  date_of_birth: Date;
  universe: string;
  main_power: string;
  avatar_url: string;
}


// Regras de negócio da entidade — validadas de novo aqui mesmo quando o Zod já checou o formato na rota
export function validateHero(input: HeroInput): void {
  if (!input.name || input.name.trim().length === 0) {
    throw new HeroValidationError("Nome é obrigatório");
  }
  if (!input.nickname || input.nickname.trim().length === 0) {
    throw new HeroValidationError("Nome de guerra é obrigatório");
  }
  if (!input.universe || input.universe.trim().length === 0) {
    throw new HeroValidationError("Universo é obrigatório");
  }
  if (!input.main_power || input.main_power.trim().length === 0) {
    throw new HeroValidationError("Habilidade principal é obrigatória");
  }
  if (!(input.date_of_birth instanceof Date) || isNaN(input.date_of_birth.getTime())) {
    throw new HeroValidationError("Data de nascimento inválida");
  }
  try {
    new URL(input.avatar_url);
  } catch {
    throw new HeroValidationError("URL do avatar inválida");
  }
}

export function canBeEdited(hero: Hero): boolean {
  return hero.is_active;
}