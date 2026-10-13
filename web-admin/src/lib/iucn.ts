import type { ConservationStatus } from '../api/types'

/** Official IUCN Red List colours. */
export const IUCN_COLORS: Record<ConservationStatus, { bg: string; fg: string }> = {
  CR: { bg: '#D81E05', fg: '#FFFFFF' },
  EN: { bg: '#FC7F3F', fg: '#000000' },
  VU: { bg: '#F9E814', fg: '#000000' },
  NT: { bg: '#CCE226', fg: '#000000' },
  LC: { bg: '#60C659', fg: '#000000' },
  DD: { bg: '#D1D1C6', fg: '#000000' },
  EW: { bg: '#542344', fg: '#FFFFFF' },
  EX: { bg: '#000000', fg: '#FFFFFF' },
}
