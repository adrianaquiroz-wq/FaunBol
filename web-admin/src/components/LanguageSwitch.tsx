import { useTranslation } from 'react-i18next'

const LANGS = ['es', 'en'] as const

export function LanguageSwitch() {
  const { t, i18n } = useTranslation()
  return (
    <div className="flex overflow-hidden rounded-md border border-neutral-300 text-xs" role="group" aria-label={t('nav.language')}>
      {LANGS.map((lng) => {
        const active = i18n.language === lng
        return (
          <button
            key={lng}
            type="button"
            onClick={() => void i18n.changeLanguage(lng)}
            aria-pressed={active}
            className={`px-2 py-1 font-semibold uppercase ${
              active ? 'bg-green-700 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {lng}
          </button>
        )
      })}
    </div>
  )
}
