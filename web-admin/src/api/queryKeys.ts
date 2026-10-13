import type { AnimalListParams } from './animals'
import type { Lang, UserStatus } from './types'

export const queryKeys = {
  animals: ['animals'] as const,
  animalList: (params: AnimalListParams) => ['animals', 'list', params] as const,
  animalFull: (id: string) => ['animals', 'full', id] as const,
  ecoregions: (lang: Lang) => ['ecoregions', lang] as const,
  users: ['users'] as const,
  usersByStatus: (status: UserStatus) => ['users', status] as const,
}
