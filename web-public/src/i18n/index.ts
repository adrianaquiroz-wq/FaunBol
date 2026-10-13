import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { Lang } from '../api/types'
import { safeStorage } from '../lib/storage'
import en from './en.json'
import es from './es.json'

export const SUPPORTED_LANGS: readonly Lang[] = ['es', 'en']
export const DEFAULT_LANG: Lang = 'es'
const STORAGE_KEY = 'faunbol.lang'

export function isLang(value: unknown): value is Lang {
  return value === 'es' || value === 'en'
}

const stored = safeStorage.get(STORAGE_KEY)
const initialLang: Lang = isLang(stored) ? stored : DEFAULT_LANG

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: DEFAULT_LANG,
  supportedLngs: [...SUPPORTED_LANGS],
  interpolation: { escapeValue: false },
  returnNull: false,
})

function syncHtmlLang(lng: string) {
  if (typeof document !== 'undefined') document.documentElement.lang = lng
}

syncHtmlLang(initialLang)
i18n.on('languageChanged', (lng) => {
  syncHtmlLang(lng)
  if (isLang(lng)) safeStorage.set(STORAGE_KEY, lng)
})

export default i18n
