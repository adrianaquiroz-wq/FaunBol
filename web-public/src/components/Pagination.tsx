import { useTranslation } from 'react-i18next'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

/** Devuelve la lista de páginas a mostrar con huecos ("…"): 1 … 4 5 6 … 10 */
function pageItems(page: number, total: number): (number | 'gap')[] {
  const pages = new Set<number>([1, total, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const items: (number | 'gap')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push('gap')
    items.push(p)
  })
  return items
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const { t } = useTranslation()
  if (totalPages <= 1) return null

  const base =
    'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors'

  return (
    <nav aria-label={t('pagination.label')} className="flex flex-col items-center gap-3">
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        <li>
          <button
            type="button"
            className={`${base} border border-line hover:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-40`}
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
          >
            <span aria-hidden="true">←</span>
            <span className="ml-1 hidden sm:inline">{t('pagination.prev')}</span>
            <span className="sr-only sm:hidden">{t('pagination.prev')}</span>
          </button>
        </li>
        {pageItems(page, totalPages).map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-ink-muted">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={`${base} ${
                  item === page ? 'bg-forest-800 text-sand-50' : 'border border-line hover:bg-sand-100'
                }`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className={`${base} border border-line hover:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-40`}
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
          >
            <span className="mr-1 hidden sm:inline">{t('pagination.next')}</span>
            <span className="sr-only sm:hidden">{t('pagination.next')}</span>
            <span aria-hidden="true">→</span>
          </button>
        </li>
      </ul>
      <p className="text-xs text-ink-muted">{t('pagination.status', { page, total: totalPages })}</p>
    </nav>
  )
}
