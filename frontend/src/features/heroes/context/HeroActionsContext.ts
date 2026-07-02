import { createContext, useContext } from "react";
import type { Hero } from "../types/hero.types";

// Existe só pra evitar prop drilling: sem isso, HeroesPage precisaria passar
// onEdit/onDelete/onToggleActive por HeroList e HeroCard, que não usam esses
// callbacks — só repassam pro HeroActionsMenu. Por isso o Context carrega
// APENAS as funções de abrir cada ação, nunca o estado dos modais em si —
// quem guarda isOpen/qual herói e renderiza os modais continua sendo a
// própria HeroesPage, como já era antes dessa mudança.
export interface HeroActionsContextValue {
  openEdit: (hero: Hero) => void;
  openDelete: (hero: Hero) => void;
  openActivate: (hero: Hero) => void;
}

export const HeroActionsContext = createContext<HeroActionsContextValue | null>(null);

export function useHeroActions(): HeroActionsContextValue {
  const context = useContext(HeroActionsContext);
  if (!context)
    throw new Error("useHeroActions deve ser usado dentro de <HeroActionsContext.Provider>");
  return context;
}
