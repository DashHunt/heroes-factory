import { ConfirmDialog } from "../../../shared/ui/ConfirmDialog";
import { useDeactivateHero } from "../hooks/useDeactivateHero";
import { useActivateHero } from "../hooks/useActivateHero";
import type { Hero } from "../types/hero.types";

export type HeroConfirmationAction = "delete" | "activate";

interface HeroConfirmationModalProps {
  isOpen: boolean;
  hero?: Hero;
  action: HeroConfirmationAction;
  onClose: () => void;
}

interface HeroConfirmationConfig {
  title: string;
  confirmLabel: string;
  variant: "primary" | "danger";
  description: (hero: Hero) => string;
}

// Configurações específicas para cada ação de confirmação (excluir ou ativar)
const CONFIG: Record<HeroConfirmationAction, HeroConfirmationConfig> = {
  delete: {
    title: "Excluir herói",
    confirmLabel: "Excluir",
    variant: "danger",
    description: (hero) =>
      `Deseja realmente excluir ${hero.nickname}? Você pode reativá-lo depois.`,
  },
  activate: {
    title: "Ativar herói",
    confirmLabel: "Ativar",
    variant: "primary",
    description: (hero) => `Deseja realmente ativar ${hero.nickname}?`,
  },
};

export function HeroConfirmationModal({
  isOpen,
  hero,
  action,
  onClose,
}: HeroConfirmationModalProps) {
  // Para cada ação, pega a mutation correspondente (deactivate ou activate) e o estado de isPending.
  const deactivateHero = useDeactivateHero();
  const activateHero = useActivateHero();
  
  const { mutate, isPending } = action === "delete" ? deactivateHero : activateHero;

  if (!hero) return null;

  const config = CONFIG[action];

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={config.title}
      description={config.description(hero)}
      confirmLabel={config.confirmLabel}
      variant={config.variant}
      isConfirming={isPending}
      onConfirm={() => mutate(hero.id, { onSuccess: onClose })}
      onCancel={onClose}
    />
  );
}
