import { NavLink, Outlet } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/useAuth'
import { usersApi } from '../api/users'
import { queryKeys } from '../api/queryKeys'
import { LanguageSwitch } from './LanguageSwitch'

function navClass({ isActive }: { isActive: boolean }) {
  return `inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium ${
    isActive ? 'bg-green-100 text-green-900' : 'text-neutral-700 hover:bg-neutral-100'
  }`
}

export function Layout() {
  const { t } = useTranslation()
  const { user, isAdmin, logout } = useAuth()

  const pending = useQuery({
    queryKey: queryKeys.usersByStatus('PENDING'),
    queryFn: () => usersApi.list({ status: 'PENDING' }),
    enabled: isAdmin,
    refetchInterval: 60_000,
  })
  const pendingCount = pending.data?.length ?? 0

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <NavLink to="/especies" className="text-lg font-bold text-green-800">
            {t('app.title')}
          </NavLink>
          <nav className="flex gap-1">
            <NavLink to="/especies" className={navClass}>
              {t('nav.species')}
            </NavLink>
            {isAdmin && (
              <NavLink to="/usuarios" className={navClass}>
                {t('nav.users')}
                {pendingCount > 0 && (
                  <span
                    className="rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white"
                    title={t('nav.pendingBadge', { count: pendingCount })}
                  >
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            )}
          </nav>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <LanguageSwitch />
            {user && (
              <span className="text-sm text-neutral-700">
                <span className="font-medium">{user.fullName}</span>{' '}
                <span className="text-neutral-500">({t(`enums.role.${user.role}`)})</span>
              </span>
            )}
            <button type="button" className="btn-secondary" onClick={logout}>
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
