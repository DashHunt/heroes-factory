import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog'
import { useDeactivateHero } from '../hooks/useDeactivateHero'
import type { Hero } from '../types/hero.types'

interface HeroDeleteConfirmModalProps {
  isOpen: boolean
  hero?: Hero
  onClose: () => void
}

export function HeroDeleteConfirmModal({ isOpen, hero, onClose }: HeroDeleteConfirmModalProps) {
  const { mutate, isPending } = useDeactivateHero()

  if (!hero) return null

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Excluir herói"
      description={`Deseja realmente excluir ${hero.nickname}? Você pode reativá-lo depois.`}
      confirmLabel="Excluir"
      variant="danger"
      isConfirming={isPending}
      onConfirm={() => mutate(hero.id, { onSuccess: onClose })}
      onCancel={onClose}
    />
  )
}
