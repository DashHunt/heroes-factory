import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog'
import { useActivateHero } from '../hooks/useActivateHero'
import type { Hero } from '../types/hero.types'

interface HeroActivateConfirmModalProps {
  isOpen: boolean
  hero?: Hero
  onClose: () => void
}

export function HeroActivateConfirmModal({ isOpen, hero, onClose }: HeroActivateConfirmModalProps) {
  const { mutate, isPending } = useActivateHero()

  if (!hero) return null

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Ativar herói"
      description={`Deseja realmente ativar ${hero.nickname}?`}
      confirmLabel="Ativar"
      variant="primary"
      isConfirming={isPending}
      onConfirm={() => mutate(hero.id, { onSuccess: onClose })}
      onCancel={onClose}
    />
  )
}
