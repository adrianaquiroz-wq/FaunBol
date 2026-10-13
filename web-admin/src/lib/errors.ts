import type { TFunction } from 'i18next'
import { ApiError } from '../api/client'

export interface ReadableError {
  message: string
  /** Extra lines (e.g. the 400 validation `message` array). */
  details: string[]
}

/** Converts any thrown value into a translated, human-readable message. */
export function readableError(error: unknown, t: TFunction): ReadableError {
  if (!(error instanceof ApiError)) {
    return { message: t('errors.generic'), details: [] }
  }

  if (error.code === 'ACCOUNT_REJECTED') {
    const reason = error.details?.reason
    return {
      message:
        typeof reason === 'string' && reason.trim()
          ? t('errors.ACCOUNT_REJECTED_REASON', { reason })
          : t('errors.ACCOUNT_REJECTED'),
      details: [],
    }
  }

  if (error.code) {
    const key = `errors.${error.code}`
    const translated = t(key)
    if (translated !== key) return { message: translated, details: [] }
  }

  if (error.isValidation) {
    return { message: t('errors.validationTitle'), details: error.messages }
  }

  if (error.status === 403) return { message: t('errors.status403'), details: [] }
  if (error.status === 404) return { message: t('errors.status404'), details: [] }
  if (error.status === 409) return { message: t('errors.status409'), details: [] }
  if (error.status >= 500) return { message: t('errors.status500'), details: [] }
  return { message: t('errors.generic'), details: error.messages }
}

export function errorText(error: unknown, t: TFunction): string {
  const r = readableError(error, t)
  return r.details.length ? `${r.message} ${r.details.join('; ')}` : r.message
}
