import { Modal } from './Modal'
import { Button } from './Button'
import { Loader2Icon } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'primary' | 'danger'
  isConfirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} ariaLabel={title}>
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      <p className="mt-2 text-sm text-neutral-600">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={isConfirming}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant}
          onClick={onConfirm}
          disabled={isConfirming}
          aria-label={isConfirming ? 'Aguarde...' : undefined}
        >
          {isConfirming ? <Loader2Icon className="animate-spin" data-testid="spinner" /> : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
