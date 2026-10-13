import { useTranslation } from 'react-i18next'
import type { ConservationStatus } from '../api/types'
import { IUCN_COLORS } from '../lib/iucn'

export function IucnChip({ status }: { status: ConservationStatus }) {
  const { t } = useTranslation()
  const c = IUCN_COLORS[status]
  const label = t(`enums.iucn.${status}`)
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.fg }}
      title={label}
    >
      {status}
      <span className="hidden font-normal sm:inline">· {label}</span>
    </span>
  )
}
