import { useTranslation } from 'react-i18next'
import type { ConservationStatus } from '../api/types'
import { IUCN_COLORS } from '../lib/iucn'

interface IucnChipProps {
  status: ConservationStatus
  /** Mostrar el nombre localizado junto al código (por defecto, sí). */
  withName?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: 'text-[0.7rem] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3.5 py-1.5 gap-2',
} as const

/** Chip de categoría UICN con los colores oficiales: "CR · En peligro crítico". */
export function IucnChip({ status, withName = true, size = 'md', className = '' }: IucnChipProps) {
  const { t } = useTranslation()
  const { bg, fg } = IUCN_COLORS[status]
  const name = t(`iucn.${status}`)

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${SIZES[size]} ${className}`}
      style={{ backgroundColor: bg, color: fg }}
      title={withName ? undefined : name}
    >
      <span className="tracking-wide">{status}</span>
      {withName ? (
        <>
          <span aria-hidden="true" className="opacity-70">
            ·
          </span>
          <span className="font-medium">{name}</span>
        </>
      ) : (
        <span className="sr-only">{name}</span>
      )}
    </span>
  )
}
