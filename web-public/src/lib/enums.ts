import {
  ANIMAL_CLASSES,
  CONSERVATION_STATUSES,
  type AnimalClass,
  type ConservationStatus,
} from '../api/types'

export function isConservationStatus(value: unknown): value is ConservationStatus {
  return typeof value === 'string' && (CONSERVATION_STATUSES as readonly string[]).includes(value)
}

export function isAnimalClass(value: unknown): value is AnimalClass {
  return typeof value === 'string' && (ANIMAL_CLASSES as readonly string[]).includes(value)
}

/** "Beni, Pando, Santa Cruz" → ["Beni", "Pando", "Santa Cruz"] */
export function splitList(value: string | null | undefined): string[] {
  if (!value) return []
  return value
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter(Boolean)
}
