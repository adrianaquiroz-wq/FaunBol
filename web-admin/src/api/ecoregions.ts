import { request } from './client'
import type { EcoregionResponse, Lang } from './types'

export const ecoregionsApi = {
  list: (lang: Lang) => request<EcoregionResponse[]>('/ecoregions', { query: { lang } }),
}
