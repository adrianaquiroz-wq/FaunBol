import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from './api/client'
import { AuthProvider } from './auth/AuthProvider'
import { RequireAdmin, RequireAuth } from './auth/RequireAuth'
import { Layout } from './components/Layout'
import { ToastProvider } from './components/toast/ToastProvider'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'
import { SpeciesFormPage } from './pages/SpeciesFormPage'
import { SpeciesListPage } from './pages/SpeciesListPage'
import { UsersPage } from './pages/UsersPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Retry only network/server errors, never 4xx.
      retry: (count, error) =>
        count < 1 && error instanceof ApiError && (error.status === 0 || error.status >= 500),
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route element={<RequireAuth />}>
                <Route element={<Layout />}>
                  <Route index element={<Navigate to="/especies" replace />} />
                  <Route path="/especies" element={<SpeciesListPage />} />
                  <Route path="/especies/nueva" element={<SpeciesFormPage />} />
                  <Route path="/especies/:id/editar" element={<SpeciesFormPage />} />
                  <Route element={<RequireAdmin />}>
                    <Route path="/usuarios" element={<UsersPage />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}
