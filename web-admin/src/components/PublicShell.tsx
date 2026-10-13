import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitch } from './LanguageSwitch'

/** Centered card layout used by login and register pages. */
export function PublicShell({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-green-800">{t('app.title')}</p>
            <p className="text-xs text-neutral-500">{t('app.subtitle')}</p>
          </div>
          <LanguageSwitch />
        </div>
        <div className="card">
          <h1 className="mb-4 text-lg font-semibold">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  )
}
