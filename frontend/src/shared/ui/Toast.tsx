import type { ToastVariant } from '../state/toastBus'

interface ToastProps {
  variant: ToastVariant
  message: string
  onDismiss: () => void
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
}

export function Toast({ variant, message, onDismiss }: ToastProps) {
  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-md px-4 py-3 shadow-lg ${variantStyles[variant]}`}
    >
      <span className="text-sm">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar"
        className="text-sm leading-none opacity-80 hover:opacity-100"
      >
        &times;
      </button>
    </div>
  )
}
