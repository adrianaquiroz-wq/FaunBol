import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface StateMessageProps {
  title: string
  text?: string
  icon?: ReactNode
  children?: ReactNode
  tone?: 'neutral' | 'error'
}

/** Bloque genérico para estados vacíos, de error o "no encontrado". */
export function StateMessage({ title, text, icon, children, tone = 'neutral' }: StateMessageProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className="card mx-auto flex max-w-xl flex-col items-center gap-3 px-6 py-10 text-center"
    >
      {icon ?? <LeafIcon className={tone === 'error' ? 'text-ochre-500' : 'text-forest-300'} />}
      <h2 className="text-2xl font-semibold">{title}</h2>
      {text && <p className="max-w-md text-ink-soft">{text}</p>}
      {children && <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}

interface ErrorStateProps {
  onRetry?: () => void
  retrying?: boolean
}

export function ErrorState({ onRetry, retrying = false }: ErrorStateProps) {
  const { t } = useTranslation()
  return (
    <StateMessage tone="error" title={t('states.errorTitle')} text={t('states.errorText')}>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry} disabled={retrying}>
          <RetryIcon className={retrying ? 'animate-spin' : ''} />
          {t('states.retry')}
        </button>
      )}
    </StateMessage>
  )
}

export function LoadingState({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <div role="status" className={`flex items-center justify-center gap-3 py-16 text-ink-soft ${className}`}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-forest-300 border-t-forest-800" aria-hidden="true" />
      <span>{t('states.loading')}</span>
    </div>
  )
}

export function LeafIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`h-12 w-12 ${className}`} aria-hidden="true" focusable="false">
      <path d="M8 40c0-18 11-30 32-32-2 21-14 32-32 32z" fill="currentColor" opacity="0.35" />
      <path d="M8 40C15 31 23 22 34 14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function RetryIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} aria-hidden="true" focusable="false">
      <path
        d="M20 11a8 8 0 1 0-2.34 5.66M20 4v7h-7"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
