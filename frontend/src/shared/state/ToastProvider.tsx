import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { toastBus, type ToastMessage } from './toastBus'
import { ToastContext, type ToastContextValue } from './ToastContext'
import { Toast } from '../ui/Toast'

const AUTO_DISMISS_MS = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    return toastBus.subscribe((toast) => {
      setToasts((current) => [...current, toast])
      setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS)
    })
  }, [dismiss])

  const value = useMemo<ToastContextValue>(
    () => ({ success: toastBus.success, error: toastBus.error }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            message={toast.message}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
