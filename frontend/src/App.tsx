import { QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { queryClient } from './shared/query/queryClient'
import { AppLayout } from './shared/layouts/AppLayout'
import { AppRouter } from './shared/router/AppRouter'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <AppRouter />
      </AppLayout>
      <ToastContainer position="bottom-right" autoClose={5000} theme="colored" />
    </QueryClientProvider>
  )
}

export default App
