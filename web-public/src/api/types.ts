// Tipos que reflejan el contrato de docs/API.md (FaunBol API v0.2).

export const CONSERVATION_STATUSES = ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD'] as const
export type ConservationStatus = (typeof CONSERVATION_STATUSES)[number]

export const ANIMAL_CLASSES = ['MAMMAL', 'BIRD', 'REPTILE', 'AMPHIBIAN', 'FISH'] as const
export type AnimalClass = (typeof ANIMAL_CLASSES)[number]

export const POPULATION_TRENDS = ['INCREASING', 'STABLE', 'DECREASING', 'UNKNOWN'] as const
export type PopulationTrend = (typeof POPULATION_TRENDS)[number]

export type Lang = 'es' | 'en'

export interface Photo {
  url: string
  thumbnailUrl: string
  credit: string | null
}

export interface EcoregionRef {
  id: string
  code: string
  name: string
}

export interface Animal {
  id: string
  commonName: string
  scientificName: string
  animalClass: AnimalClass
  description: string | null
  iucnStatus: ConservationStatus
  boliviaRedBookStatus: ConservationStatus | null
  threats: string | null
  populationTrend: PopulationTrend | null
  estimatedPopulation: number | null
  habitat: string
  distribution: string
  sourceReference: string
  photo: Photo | null
  ecoregions: EcoregionRef[]
  createdAt: string
  updatedAt: string
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AnimalStats {
  total: number
  byIucnStatus: Record<ConservationStatus, number>
}

export interface Ecoregion {
  id: string
  code: string
  name: string
  description: string | null
  animalCount: number
}

export interface AnimalFilters {
  page?: number
  limit?: number
  search?: string
  iucnStatus?: ConservationStatus
  animalClass?: AnimalClass
  ecoregion?: string
}

export interface ApiErrorBody {
  statusCode: number
  error: string
  message: string | string[]
  code?: string
  details?: Record<string, unknown>
}
