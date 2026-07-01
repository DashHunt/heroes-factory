import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/query/queryClient'
import { ToastProvider } from './shared/state/ToastProvider'
import { AppLayout } from './shared/layouts/AppLayout'
import { AppRouter } from './shared/router/AppRouter'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
