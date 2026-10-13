import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useLang } from '../i18n/useLang'
import { api } from './client'
import type { AnimalFilters } from './types'

export function useAnimals(filters: AnimalFilters, options: { enabled?: boolean } = {}) {
  const lang = useLang()
  return useQuery({
    queryKey: ['animals', lang, filters],
    queryFn: ({ signal }) => api.listAnimals(filters, lang, signal),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  })
}

export function useAnimalStats() {
  return useQuery({
    queryKey: ['animals', 'stats'],
    queryFn: ({ signal }) => api.getAnimalStats(signal),
  })
}

export function useAnimal(id: string | undefined) {
  const lang = useLang()
  return useQuery({
    queryKey: ['animal', lang, id],
    queryFn: ({ signal }) => api.getAnimal(id ?? '', lang, signal),
    enabled: Boolean(id),
  })
}

export function useEcoregions() {
  const lang = useLang()
  return useQuery({
    queryKey: ['ecoregions', lang],
    queryFn: ({ signal }) => api.listEcoregions(lang, signal),
    staleTime: 10 * 60 * 1000,
  })
}

export function useEcoregion(code: string | undefined) {
  const lang = useLang()
  return useQuery({
    queryKey: ['ecoregion', lang, code],
    queryFn: ({ signal }) => api.getEcoregion(code ?? '', lang, signal),
    enabled: Boolean(code),
    staleTime: 10 * 60 * 1000,
  })
}
