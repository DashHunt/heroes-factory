import type { Hero } from '../types/hero.types'
import { HeroCard } from './HeroCard'

interface HeroListProps {
  heroes: Hero[]
  onSelectHero?: (hero: Hero) => void
}

// 5 por linha em telas grandes, conforme o requisito do README
export function HeroList({ heroes, onSelectHero }: HeroListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {heroes.map((hero) => (
        <HeroCard key={hero.id} hero={hero} onClick={onSelectHero ? () => onSelectHero(hero) : undefined} />
      ))}
    </div>
  )
}
