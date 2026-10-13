import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/useAuth'
import { ErrorAlert } from '../components/ErrorAlert'
import { PublicShell } from '../components/PublicShell'

export function LoginPage() {
  const { t } = useTranslation()
  const { status, login, sessionExpired } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<unknown>(null)
  const [busy, setBusy] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to={from && from !== '/login' ? from : '/especies'} replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await login(email.trim(), password)
      void navigate(from && from !== '/login' ? from : '/especies', { replace: true })
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <PublicShell title={t('login.title')}>
      <form onSubmit={onSubmit} className="space-y-4">
        {sessionExpired && !error && (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {t('errors.INVALID_TOKEN')}
          </p>
        )}
        <ErrorAlert error={error} />
        <div>
          <label className="label" htmlFor="email">
            {t('login.email')}
          </label>
          <input
            id="email"
            type="email"
            className="input"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            {t('login.password')}
          </label>
          <input
            id="password"
            type="password"
            className="input"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? t('login.submitting') : t('login.submit')}
        </button>
        <p className="text-center text-sm text-neutral-600">
          {t('login.noAccount')}{' '}
          <Link to="/registro" className="font-medium text-green-700 hover:underline">
            {t('login.registerLink')}
          </Link>
        </p>
      </form>
    </PublicShell>
  )
}
