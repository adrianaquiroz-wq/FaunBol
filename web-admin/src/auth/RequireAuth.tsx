import { Navigate, Outlet, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from './useAuth'
import { Spinner } from '../components/Spinner'

/** Guards every private route: requires a restored/active session. */
export function RequireAuth() {
  const { status, retry, logout } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="card max-w-md space-y-3 text-center">
          <p className="text-red-700">{t('errors.NETWORK_ERROR')}</p>
          <div className="flex justify-center gap-2">
            <button className="btn-primary" onClick={retry}>
              {t('common.retry')}
            </button>
            <button className="btn-secondary" onClick={logout}>
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

/** ADMIN-only routes: researchers are sent back to the species list. */
export function RequireAdmin() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/especies" replace />
  return <Outlet />
}
