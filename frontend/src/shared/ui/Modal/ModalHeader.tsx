import { X } from 'lucide-react'

interface ModalHeaderProps {
  title: string
  onClose: () => void
  closeAriaLabel?: string
}

// -mx-6/px-6 cancela o padding lateral do Modal pra a borda esticar de fora a fora do card
export function ModalHeader({ title, onClose, closeAriaLabel = 'Fechar' }: ModalHeaderProps) {
  return (
    <div className="-mx-6 mb-4 flex items-center justify-between border-b border-neutral-200 px-6 pb-5">
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeAriaLabel}
        className="text-neutral-400 hover:text-neutral-600"
      >
        <X size={20} />
      </button>
    </div>
  )
}
