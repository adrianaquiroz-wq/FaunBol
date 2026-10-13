import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './es.json'
import en from './en.json'
import type { Lang } from '../api/types'
import { storageGet, storageSet } from '../lib/storage'

const LANG_KEY = 'faunbol_admin_lang'

function initialLang(): Lang {
  const saved = storageGet(LANG_KEY)
  return saved === 'en' ? 'en' : 'es'
}

void i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: initialLang(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

document.documentElement.lang = i18n.language

i18n.on('languageChanged', (lng) => {
  storageSet(LANG_KEY, lng)
  document.documentElement.lang = lng
})

export function currentLang(): Lang {
  return i18n.language === 'en' ? 'en' : 'es'
}

export default i18n
