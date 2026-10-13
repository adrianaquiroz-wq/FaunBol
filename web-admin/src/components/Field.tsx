import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  help?: string
  /** i18n key of the error message. */
  error?: string
  children: ReactNode
}

export function Field({ id, label, required, optional, help, error, children }: Props) {
  const { t } = useTranslation()
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
        {required && <span className="text-red-600"> *</span>}
        {optional && <span className="font-normal text-neutral-500"> ({t('common.optional')})</span>}
      </label>
      {children}
      {help && <p className="mt-1 text-xs text-neutral-500">{help}</p>}
      {error && <p className="mt-1 text-xs text-red-700">{t(error)}</p>}
    </div>
  )
}
