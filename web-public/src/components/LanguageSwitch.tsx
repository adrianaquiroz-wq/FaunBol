import { useTranslation } from 'react-i18next'
import type { Lang } from '../api/types'
import { SUPPORTED_LANGS } from '../i18n'
import { useLang } from '../i18n/useLang'

/** Selector ES | EN. La elección se guarda en localStorage (ver src/i18n/index.ts). */
export function LanguageSwitch() {
  const { t, i18n } = useTranslation()
  const current = useLang()

  const change = (lang: Lang) => {
    if (lang !== current) void i18n.changeLanguage(lang)
  }

  return (
    <div role="group" aria-label={t('lang.label')} className="inline-flex rounded-full border border-line bg-sand-50 p-0.5">
      {SUPPORTED_LANGS.map((lang) => {
        const active = lang === current
        return (
          <button
            key={lang}
            type="button"
            lang={lang}
            onClick={() => change(lang)}
            aria-pressed={active}
            title={t(`lang.${lang}`)}
            className={`min-h-9 min-w-10 rounded-full px-2.5 text-xs font-semibold tracking-wider uppercase transition-colors ${
              active ? 'bg-forest-800 text-sand-50' : 'text-ink-soft hover:text-forest-900'
            }`}
          >
            <span aria-hidden="true">{lang}</span>
            <span className="sr-only">{t(`lang.${lang}`)}</span>
          </button>
        )
      })}
    </div>
  )
}
