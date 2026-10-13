import { useTranslation } from 'react-i18next'
import { readableError } from '../lib/errors'

interface Props {
  error: unknown
  onRetry?: () => void
}

/** Inline red box showing a translated API error (plus validation details). */
export function ErrorAlert({ error, onRetry }: Props) {
  const { t } = useTranslation()
  if (!error) return null
  const { message, details } = readableError(error, t)
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
      <p>{message}</p>
      {details.length > 0 && (
        <ul className="mt-1 list-disc pl-5">
          {details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      {onRetry && (
        <button type="button" className="btn-secondary mt-2" onClick={onRetry}>
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}
