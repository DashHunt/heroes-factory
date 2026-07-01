import type { Hero } from '../types/hero.types'
import { HeroActionsMenu } from './HeroActionsMenu'

interface HeroCardProps {
  hero: Hero
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onToggleActive?: () => void
}

export function HeroCard({ hero, onClick, onEdit, onDelete, onToggleActive }: HeroCardProps) {
  return (
    <div
      className={`relative flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-colors ${
        hero.is_active
          ? 'border-neutral-200 bg-white hover:border-indigo-300'
          : 'border-neutral-200 bg-neutral-100 grayscale'
      }`}
    >
      <HeroActionsMenu
        isActive={hero.is_active}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleActive={onToggleActive}
      />

      <button
        type="button"
        onClick={onClick}
        className="flex w-full flex-col items-center justify-center gap-4 text-center"
      >
        <img src={hero.avatar_url} alt={hero.name} className="h-24 w-24 shrink-0 rounded-full object-cover" />
        <p className="truncate text-xl font-semibold text-neutral-900 mt-1">{hero.nickname}</p>
      </button>
    </div>
  )
}
