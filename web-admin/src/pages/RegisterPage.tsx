import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { authApi } from '../api/auth'
import type { RegisterInput, UserResponse } from '../api/types'
import { ErrorAlert } from '../components/ErrorAlert'
import { PublicShell } from '../components/PublicShell'

const EMPTY = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  institution: '',
  requestReason: '',
}

export function RegisterPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState(EMPTY)
  const [clientError, setClientError] = useState<string | null>(null)

  const mutation = useMutation<UserResponse, unknown, RegisterInput>({
    mutationFn: authApi.register,
  })

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setClientError(null)
    if (form.password.length < 8) return setClientError(t('register.passwordTooShort'))
    if (form.password !== form.confirmPassword) return setClientError(t('register.passwordMismatch'))
    const input: RegisterInput = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      institution: form.institution.trim(),
    }
    if (form.requestReason.trim()) input.requestReason = form.requestReason.trim()
    mutation.mutate(input)
  }

  if (mutation.isSuccess) {
    return (
      <PublicShell title={t('register.successTitle')}>
        <p className="mb-4 text-sm text-neutral-700">
          {t('register.successText', { email: mutation.data?.email ?? form.email })}
        </p>
        <Link to="/login" className="btn-primary w-full">
          {t('register.goToLogin')}
        </Link>
      </PublicShell>
    )
  }

  return (
    <PublicShell title={t('register.title')}>
      <p className="mb-4 text-sm text-neutral-600">{t('register.intro')}</p>
      <form onSubmit={onSubmit} className="space-y-4">
        {clientError && (
          <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
            {clientError}
          </p>
        )}
        <ErrorAlert error={mutation.error} />
        <div>
          <label className="label" htmlFor="fullName">
            {t('register.fullName')} *
          </label>
          <input id="fullName" className="input" required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="email">
            {t('register.email')} *
          </label>
          <input id="email" type="email" className="input" autoComplete="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="password">
            {t('register.password')} *
          </label>
          <input id="password" type="password" className="input" autoComplete="new-password" required minLength={8} maxLength={72} value={form.password} onChange={(e) => set('password', e.target.value)} />
          <p className="mt-1 text-xs text-neutral-500">{t('register.passwordHelp')}</p>
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">
            {t('register.confirmPassword')} *
          </label>
          <input id="confirmPassword" type="password" className="input" autoComplete="new-password" required value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="institution">
            {t('register.institution')} *
          </label>
          <input id="institution" className="input" required value={form.institution} onChange={(e) => set('institution', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="requestReason">
            {t('register.requestReason')} <span className="font-normal text-neutral-500">({t('common.optional')})</span>
          </label>
          <textarea id="requestReason" className="input" rows={3} value={form.requestReason} onChange={(e) => set('requestReason', e.target.value)} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={mutation.isPending}>
          {mutation.isPending ? t('register.submitting') : t('register.submit')}
        </button>
        <p className="text-center text-sm text-neutral-600">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="font-medium text-green-700 hover:underline">
            {t('register.loginLink')}
          </Link>
        </p>
      </form>
    </PublicShell>
  )
}
