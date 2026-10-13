import {
  CONSERVATION_STATUSES,
  POPULATION_TRENDS,
  type AnimalClass,
  type AnimalFullResponse,
  type AnimalInput,
  type ConservationStatus,
  type PopulationTrend,
} from '../api/types'

export const DEFAULT_SOURCE_REFERENCE =
  'UICN Lista Roja (iucnredlist.org); Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia (MMAyA, 2009)'

/** Form state: every input kept as a string ('' = empty). */
export interface SpeciesFormValues {
  commonNameEs: string
  commonNameEn: string
  scientificName: string
  animalClass: string
  iucnStatus: string
  boliviaRedBookStatus: string
  populationTrend: string
  estimatedPopulation: string
  habitatEs: string
  habitatEn: string
  descriptionEs: string
  descriptionEn: string
  threatsEs: string
  threatsEn: string
  distribution: string
  sourceReference: string
  ecoregionIds: string[]
}

export type SpeciesFormErrors = Partial<Record<keyof SpeciesFormValues, string>>

export const REQUIRED_FIELDS: (keyof SpeciesFormValues)[] = [
  'commonNameEs',
  'scientificName',
  'animalClass',
  'iucnStatus',
  'habitatEs',
  'distribution',
  'sourceReference',
]

export function emptySpeciesValues(): SpeciesFormValues {
  return {
    commonNameEs: '',
    commonNameEn: '',
    scientificName: '',
    animalClass: '',
    iucnStatus: '',
    boliviaRedBookStatus: '',
    populationTrend: '',
    estimatedPopulation: '',
    habitatEs: '',
    habitatEn: '',
    descriptionEs: '',
    descriptionEn: '',
    threatsEs: '',
    threatsEn: '',
    distribution: '',
    sourceReference: DEFAULT_SOURCE_REFERENCE,
    ecoregionIds: [],
  }
}

export function toFormValues(a: AnimalFullResponse): SpeciesFormValues {
  return {
    commonNameEs: a.commonNameEs ?? '',
    commonNameEn: a.commonNameEn ?? '',
    scientificName: a.scientificName ?? '',
    animalClass: a.animalClass ?? '',
    iucnStatus: a.iucnStatus ?? '',
    boliviaRedBookStatus: a.boliviaRedBookStatus ?? '',
    populationTrend: a.populationTrend ?? '',
    estimatedPopulation: a.estimatedPopulation == null ? '' : String(a.estimatedPopulation),
    habitatEs: a.habitatEs ?? '',
    habitatEn: a.habitatEn ?? '',
    descriptionEs: a.descriptionEs ?? '',
    descriptionEn: a.descriptionEn ?? '',
    threatsEs: a.threatsEs ?? '',
    threatsEn: a.threatsEn ?? '',
    distribution: a.distribution ?? '',
    sourceReference: a.sourceReference ?? '',
    ecoregionIds: a.ecoregionIds ?? [],
  }
}

const nullable = (v: string): string | null => (v.trim() ? v.trim() : null)

function inList<T extends string>(list: readonly T[], v: string): v is T {
  return (list as readonly string[]).includes(v)
}

/** Returns error keys (i18n) per field; empty object = valid. */
export function validateSpecies(v: SpeciesFormValues): SpeciesFormErrors {
  const errors: SpeciesFormErrors = {}
  for (const f of REQUIRED_FIELDS) {
    const value = v[f]
    if (typeof value === 'string' && !value.trim()) errors[f] = 'form.requiredField'
  }
  if (v.estimatedPopulation.trim()) {
    const n = Number(v.estimatedPopulation)
    if (!Number.isInteger(n) || n < 0) errors.estimatedPopulation = 'form.invalidNumber'
  }
  return errors
}

/** Builds the API body. Optional empty fields are sent as null (clears them on PATCH). */
export function toAnimalInput(v: SpeciesFormValues): AnimalInput {
  return {
    commonNameEs: v.commonNameEs.trim(),
    commonNameEn: nullable(v.commonNameEn),
    scientificName: v.scientificName.trim(),
    animalClass: v.animalClass as AnimalClass,
    iucnStatus: v.iucnStatus as ConservationStatus,
    boliviaRedBookStatus: inList(CONSERVATION_STATUSES, v.boliviaRedBookStatus)
      ? v.boliviaRedBookStatus
      : null,
    populationTrend: inList(POPULATION_TRENDS, v.populationTrend)
      ? (v.populationTrend as PopulationTrend)
      : null,
    estimatedPopulation: v.estimatedPopulation.trim() ? Number(v.estimatedPopulation) : null,
    habitatEs: v.habitatEs.trim(),
    habitatEn: nullable(v.habitatEn),
    descriptionEs: nullable(v.descriptionEs),
    descriptionEn: nullable(v.descriptionEn),
    threatsEs: nullable(v.threatsEs),
    threatsEn: nullable(v.threatsEn),
    distribution: v.distribution.trim(),
    sourceReference: v.sourceReference.trim(),
    ecoregionIds: v.ecoregionIds,
  }
}

