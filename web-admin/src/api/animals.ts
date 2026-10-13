import { request } from './client'
import type {
  AnimalClass,
  AnimalFullResponse,
  AnimalInput,
  AnimalResponse,
  ConservationStatus,
  Lang,
  Paginated,
} from './types'

export interface AnimalListParams {
  page?: number
  limit?: number
  search?: string
  iucnStatus?: ConservationStatus | ''
  animalClass?: AnimalClass | ''
  ecoregion?: string
  lang?: Lang
}

export const animalsApi = {
  list: (params: AnimalListParams) =>
    request<Paginated<AnimalResponse>>('/animals', { query: { ...params } }),
  getFull: (id: string) => request<AnimalFullResponse>(`/animals/${id}/full`),
  create: (input: AnimalInput) =>
    request<AnimalFullResponse>('/animals', { method: 'POST', body: input }),
  update: (id: string, input: Partial<AnimalInput>) =>
    request<AnimalFullResponse>(`/animals/${id}`, { method: 'PATCH', body: input }),
  remove: (id: string) => request<void>(`/animals/${id}`, { method: 'DELETE' }),
  uploadPhoto: (id: string, file: File, photoCredit?: string) => {
    const fd = new FormData()
    fd.append('file', file)
    if (photoCredit && photoCredit.trim()) fd.append('photoCredit', photoCredit.trim())
    return request<AnimalFullResponse>(`/animals/${id}/photo`, { method: 'POST', formData: fd })
  },
  removePhoto: (id: string) =>
    request<AnimalFullResponse>(`/animals/${id}/photo`, { method: 'DELETE' }),
}
