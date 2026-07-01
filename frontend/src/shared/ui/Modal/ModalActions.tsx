import { Button } from '../Button'

interface ModalActionsProps {
  onClose: () => void
  closeLabel?: string
  // Quando true, mostra Cancelar + Salvar (submit); quando false, só o botão de Fechar
  showSave?: boolean
  saveLabel?: string
  isSaving?: boolean
}

// -mx-6/px-6 cancela o padding lateral do Modal pra a borda esticar de fora a fora do card
export function ModalActions({
  onClose,
  closeLabel = 'Fechar',
  showSave = false,
  saveLabel = 'Salvar',
  isSaving = false,
}: ModalActionsProps) {
  return (
    <div className="-mx-6 mt-6 flex justify-center gap-3 border-t border-neutral-200 px-6 pt-4">
      {showSave ? (
        <>
          <Button type="button" variant="white" className="shadow" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="shadow" disabled={isSaving}>
            {isSaving ? 'Salvando...' : saveLabel}
          </Button>
        </>
      ) : (
        <Button type="button" variant="white" className="shadow" onClick={onClose}>
          {closeLabel}
        </Button>
      )}
    </div>
  )
}
