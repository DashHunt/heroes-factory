import type { Hero } from '../types/hero.types'
import { HeroCard } from './HeroCard'

interface HeroListProps {
  heroes: Hero[]
  onSelectHero?: (hero: Hero) => void
}

// Editar/Excluir/Ativar não passam mais por aqui como props — HeroCard
// pega isso direto do HeroActionsContext (ver ../context/HeroActionsContext.ts).
// onSelectHero continua vindo de fora porque é o único caso que o HeroCard usa
// de verdade (no seu próprio onClick), não é só repasse.
export function HeroList({ heroes, onSelectHero }: HeroListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {heroes.map((hero) => (
        <HeroCard
          key={hero.id}
          hero={hero}
          onClick={onSelectHero ? () => onSelectHero(hero) : undefined}
        />
      ))}
    </div>
  )
}
