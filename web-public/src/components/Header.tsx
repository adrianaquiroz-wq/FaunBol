import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router'
import { NAV_ITEMS } from '../lib/nav'
import { LanguageSwitch } from './LanguageSwitch'
import { Logo } from './Logo'

export function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const [openAt, setOpenAt] = useState<string | null>(null)
  // El menú móvil se cierra solo al cambiar de ruta.
  const open = openAt === location.pathname

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex min-h-11 items-center px-1 text-sm font-medium transition-colors ${
      isActive
        ? 'text-forest-900 after:absolute after:inset-x-1 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-ochre-500'
        : 'text-ink-soft hover:text-forest-900'
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-12 items-center rounded-xl px-4 font-display text-lg ${
      isActive ? 'bg-forest-50 text-forest-900' : 'text-ink hover:bg-sand-100'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
        <Logo />

        <nav aria-label={t('nav.label')} className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass}>
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-forest-900 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setOpenAt(open ? null : location.pathname)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label={t('nav.label')} className="border-t border-line bg-paper md:hidden">
          <ul className="container-page flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={mobileLinkClass} onClick={() => setOpenAt(null)}>
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
