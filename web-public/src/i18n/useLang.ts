import { useTranslation } from 'react-i18next'
import type { Lang } from '../api/types'

/** Idioma actual de la interfaz, normalizado a 'es' | 'en'. */
export function useLang(): Lang {
  const { i18n } = useTranslation()
  const lng = i18n.resolvedLanguage ?? i18n.language
  return lng?.startsWith('en') ? 'en' : 'es'
}
