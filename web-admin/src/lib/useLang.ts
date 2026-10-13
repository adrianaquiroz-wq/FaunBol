import { useTranslation } from 'react-i18next'
import type { Lang } from '../api/types'

/** Current UI language as the API `lang` value. */
export function useLang(): Lang {
  const { i18n } = useTranslation()
  return i18n.language === 'en' ? 'en' : 'es'
}

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-BO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
