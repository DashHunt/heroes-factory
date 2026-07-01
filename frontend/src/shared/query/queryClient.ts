import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

function readMessage(meta: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = meta?.[key]
  return typeof value === 'string' ? value : undefined
}

// Toda query/mutation pode declarar meta.successMessage / meta.errorMessage;
// esse cache global lê esses campos e dispara o toast — sem precisar repetir
// try/catch ou onSuccess/onError em cada hook.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      const message = readMessage(query.meta, 'errorMessage')
      if (message) toast.error(message + error.message)
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const message = readMessage(mutation.meta, 'successMessage')
      if (message) toast.success(message)
    },
    onError: (error, _variables, _context, mutation) => {
      const message = readMessage(mutation.meta, 'errorMessage')
      if (message) toast.error(message + error.message)
    },
  }),
})
