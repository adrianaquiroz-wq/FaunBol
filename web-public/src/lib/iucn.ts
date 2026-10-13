import type { ConservationStatus } from '../api/types'

/** Colores oficiales de la Lista Roja de la UICN. `fg` asegura contraste legible sobre `bg`. */
export const IUCN_COLORS: Record<ConservationStatus, { bg: string; fg: string }> = {
  EX: { bg: '#000000', fg: '#FFFFFF' },
  EW: { bg: '#542344', fg: '#FFFFFF' },
  CR: { bg: '#D81E05', fg: '#FFFFFF' },
  EN: { bg: '#FC7F3F', fg: '#1A1A1A' },
  VU: { bg: '#F9E814', fg: '#1A1A1A' },
  NT: { bg: '#CCE226', fg: '#1A1A1A' },
  LC: { bg: '#60C659', fg: '#1A1A1A' },
  DD: { bg: '#D1D1C6', fg: '#1A1A1A' },
}

/** Orden de mayor a menor riesgo (DD al final). */
export const IUCN_ORDER: readonly ConservationStatus[] = ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD']
