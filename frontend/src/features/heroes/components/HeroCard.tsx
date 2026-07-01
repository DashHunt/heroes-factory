import type { Hero } from '../types/hero.types'

interface HeroCardProps {
  hero: Hero
  onClick?: () => void
}

export function HeroCard({ hero, onClick }: HeroCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors h-full shadow-sm ${
        hero.is_active
          ? 'border-neutral-200 bg-white hover:border-indigo-300'
          : 'border-neutral-200 bg-neutral-100 grayscale'
      }`}
    > 
      <img src={hero.avatar_url} alt={hero.name} className="h-30 w-30 rounded-full object-cover" />
      <div>
        <p className="font-semibold text-xl text-neutral-900 mt-4">{hero.nickname}</p>
        {/* <p className="text-sm text-neutral-500">{hero.name}</p> */}
      </div>
      {/* <p className="text-xs text-neutral-400">{hero.universe}</p> */}
      {!hero.is_active && (
        <span className="rounded-full bg-neutral-300 px-2 py-0.5 text-xs font-medium text-neutral-700">
          Inativo
        </span>
      )}
    </button>
  )
}
