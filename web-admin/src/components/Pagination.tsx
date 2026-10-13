import { useTranslation } from 'react-i18next'

interface Props {
  page: number
  totalPages: number
  total: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, onChange }: Props) {
  const { t } = useTranslation()
  const pages = Math.max(totalPages, 1)
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-600">
      <span>{t('common.pageOf', { page, totalPages: pages, total })}</span>
      <div className="flex gap-2">
        <button className="btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          {t('common.previous')}
        </button>
        <button className="btn-secondary" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
