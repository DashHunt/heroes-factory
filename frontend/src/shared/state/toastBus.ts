export type ToastVariant = 'success' | 'error'

export interface ToastMessage {
  id: number
  variant: ToastVariant
  message: string
}

type Listener = (toast: ToastMessage) => void

let nextId = 0
const listeners = new Set<Listener>()

function publish(variant: ToastVariant, message: string): void {
  const toast: ToastMessage = { id: ++nextId, variant, message }
  listeners.forEach((listener) => listener(toast))
}

// Ponte entre código fora da árvore React (queryCache/mutationCache do TanStack Query)
// e o ToastProvider (Context) — publish/subscribe simples, sem depender de useContext.
export const toastBus = {
  success: (message: string) => publish('success', message),
  error: (message: string) => publish('error', message),
  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
