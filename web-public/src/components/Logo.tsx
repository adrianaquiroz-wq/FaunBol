import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <path d="M9 23c0-8 5-14 15-15-1 10-7 15-15 15z" fill="#c4873a" />
      <path d="M9 23c3-4 7-8 12-11" stroke="#1b3826" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const { t } = useTranslation()
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label={t('nav.homeLink')}>
      <LogoMark className={`h-9 w-9 shrink-0 ${inverted ? 'text-forest-700' : 'text-forest-900'}`} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-2xl font-semibold tracking-tight ${inverted ? 'text-sand-50' : 'text-forest-900'}`}
        >
          Faun<span className="text-ochre-500 italic">Bol</span>
        </span>
        <span className={`mt-0.5 hidden text-[0.65rem] tracking-[0.14em] uppercase sm:block ${inverted ? 'text-sand-200' : 'text-ink-muted'}`}>
          {t('app.subtitle')}
        </span>
      </span>
    </Link>
  )
}
