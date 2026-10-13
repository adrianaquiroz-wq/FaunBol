import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Photo } from '../api/types'
import { PhotoPlaceholder } from './PhotoPlaceholder'

interface AnimalPhotoProps {
  photo: Photo | null
  name: string
  variant: 'thumb' | 'full'
  className?: string
  eager?: boolean
}

/** Foto de la especie; si falta o falla la carga, muestra el placeholder (nunca una imagen rota). */
export function AnimalPhoto({ photo, name, variant, className = '', eager = false }: AnimalPhotoProps) {
  const { t } = useTranslation()
  const src = photo ? (variant === 'thumb' ? photo.thumbnailUrl || photo.url : photo.url) : null
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || failedSrc === src) {
    return <PhotoPlaceholder name={name} className={className} />
  }

  return (
    <img
      src={src}
      alt={t('animal.photoOf', { name })}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={`bg-sand-200 object-cover ${className}`}
    />
  )
}
