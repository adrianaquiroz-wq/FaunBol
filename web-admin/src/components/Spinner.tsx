import { useTranslation } from 'react-i18next'

export function Spinner({ label }: { label?: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2 py-4 text-sm text-neutral-600" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-green-700" />
      {label ?? t('common.loading')}
    </div>
  )
}
