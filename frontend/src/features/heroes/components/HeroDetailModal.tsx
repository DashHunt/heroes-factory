import { Modal, ModalHeader, ModalActions } from '../../../shared/ui/Modal'
import type { Hero } from '../types/hero.types'

interface HeroDetailModalProps {
  isOpen: boolean
  onClose: () => void
  hero?: Hero
}

function formatDateOfBirth(dateOfBirth: string): string {
  const [year, month, day] = dateOfBirth.slice(0, 10).split('-')

  if (!year || !month || !day) return dateOfBirth

  return `${day}/${month}/${year}`
}

export function HeroDetailModal({ isOpen, onClose, hero }: HeroDetailModalProps) {
  if (!hero) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={`Detalhes de ${hero.nickname}`}>
      <ModalHeader title={hero.nickname} onClose={onClose} closeAriaLabel="Fechar detalhes" />

      <div className="flex justify-center">
        <img src={hero.avatar_url} alt={hero.name} className="h-24 w-24 rounded-full object-cover" />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <dt className="text-sm font-semibold text-neutral-900">Nome completo:</dt>
          <dd className="text-sm text-neutral-500">{hero.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-neutral-900">Data de nascimento</dt>
          <dd className="text-sm text-neutral-500">{formatDateOfBirth(hero.date_of_birth)}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-neutral-900">Universo</dt>
          <dd className="text-sm text-neutral-500">{hero.universe}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-neutral-900">Habilidade</dt>
          <dd className="text-sm text-neutral-500">{hero.main_power}</dd>
        </div>
      </dl>

      <ModalActions onClose={onClose} />
    </Modal>
  )
}
