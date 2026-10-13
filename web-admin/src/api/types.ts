export const CONSERVATION_STATUSES = ['CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'EW', 'EX'] as const
export type ConservationStatus = (typeof CONSERVATION_STATUSES)[number]

export const ANIMAL_CLASSES = ['MAMMAL', 'BIRD', 'REPTILE', 'AMPHIBIAN', 'FISH'] as const
export type AnimalClass = (typeof ANIMAL_CLASSES)[number]

export const POPULATION_TRENDS = ['INCREASING', 'STABLE', 'DECREASING', 'UNKNOWN'] as const
export type PopulationTrend = (typeof POPULATION_TRENDS)[number]

export const USER_ROLES = ['ADMIN', 'RESEARCHER'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const USER_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'DISABLED'] as const
export type UserStatus = (typeof USER_STATUSES)[number]

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

export interface AnimalResponse {
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

export interface AnimalFullResponse {
  id: string
  scientificName: string
  animalClass: AnimalClass
  iucnStatus: ConservationStatus
  boliviaRedBookStatus: ConservationStatus | null
  populationTrend: PopulationTrend | null
  estimatedPopulation: number | null
  distribution: string
  sourceReference: string
  photo: Photo | null
  createdAt: string
  updatedAt: string
  commonNameEs: string
  commonNameEn: string | null
  descriptionEs: string | null
  descriptionEn: string | null
  threatsEs: string | null
  threatsEn: string | null
  habitatEs: string
  habitatEn: string | null
  ecoregionIds: string[]
}

export interface AnimalInput {
  commonNameEs: string
  commonNameEn: string | null
  scientificName: string
  animalClass: AnimalClass
  descriptionEs: string | null
  descriptionEn: string | null
  iucnStatus: ConservationStatus
  boliviaRedBookStatus: ConservationStatus | null
  threatsEs: string | null
  threatsEn: string | null
  populationTrend: PopulationTrend | null
  estimatedPopulation: number | null
  habitatEs: string
  habitatEn: string | null
  distribution: string
  sourceReference: string
  ecoregionIds: string[]
}

export interface EcoregionResponse {
  id: string
  code: string
  name: string
  description: string | null
  animalCount: number
}

export interface UserResponse {
  id: string
  fullName: string
  email: string
  institution: string
  requestReason: string | null
  role: UserRole
  status: UserStatus
  rejectionReason: string | null
  createdAt: string
}

export interface LoginResponse {
  accessToken: string
  user: UserResponse
}

export interface RegisterInput {
  fullName: string
  email: string
  password: string
  institution: string
  requestReason?: string
}

export interface ApiErrorBody {
  statusCode: number
  error?: string
  message?: string | string[]
  code?: string
  details?: Record<string, unknown>
}
