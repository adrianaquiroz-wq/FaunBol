export const LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'es';

/** Text that must exist in Spanish; the English version is optional. */
export interface LocalizedText {
  es: string;
  en: string | null;
}

/** Text that may be missing in both languages. */
export interface OptionalLocalizedText {
  es: string | null;
  en: string | null;
}

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}

/** Picks the requested language, falling back to Spanish when it is missing. */
export function localize(text: LocalizedText, lang: Language): string;
export function localize(
  text: OptionalLocalizedText,
  lang: Language,
): string | null;
export function localize(
  text: LocalizedText | OptionalLocalizedText,
  lang: Language,
): string | null {
  const preferred = lang === 'en' ? text.en : text.es;
  return preferred ?? text.es ?? text.en ?? null;
}
