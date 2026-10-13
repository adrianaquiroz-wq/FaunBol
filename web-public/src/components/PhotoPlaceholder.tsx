import { useId } from 'react'
import { useTranslation } from 'react-i18next'

interface PhotoPlaceholderProps {
  name: string
  className?: string
}

/** Ilustración de reemplazo cuando una especie no tiene foto: patrón de hojas + inicial. */
export function PhotoPlaceholder({ name, className = '' }: PhotoPlaceholderProps) {
  const { t } = useTranslation()
  // useId puede incluir caracteres no válidos para url(#…): se normaliza.
  const patternId = `leaf-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      role="img"
      aria-label={`${name} — ${t('animal.noPhoto')}`}
      className={`relative flex items-center justify-center overflow-hidden bg-forest-100 ${className}`}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={patternId} width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
            <path
              d="M10 40c0-14 9-24 26-26-2 17-12 26-26 26z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path d="M10 40c6-7 12-14 22-21" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} className="text-forest-300" />
      </svg>
      <div className="relative flex flex-col items-center gap-2 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-forest-300 bg-sand-50/90 font-display text-4xl text-forest-800 italic">
          {initial}
        </span>
        <span className="rounded-full bg-sand-50/80 px-2.5 py-0.5 text-[0.7rem] font-medium text-forest-800">
          {t('animal.noPhoto')}
        </span>
      </div>
    </div>
  )
}
