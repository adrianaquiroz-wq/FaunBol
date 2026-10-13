import type {
  Animal,
  AnimalFilters,
  AnimalStats,
  ApiErrorBody,
  Ecoregion,
  Lang,
  Paginated,
} from './types'

const DEFAULT_API_URL = 'http://localhost:3000/api'

export const API_URL: string = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '')

/** Error normalizado. `status` es 0 cuando no hubo respuesta (red caída, API apagada). */
export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

type QueryValue = string | number | undefined | null

function buildUrl(path: string, params: Record<string, QueryValue>): string {
  const url = new URL(`${API_URL}${path}`)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

function isErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null && 'statusCode' in value
}

async function request<T>(
  path: string,
  params: Record<string, QueryValue>,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError(0, 'Network error')
  }

  if (!response.ok) {
    let message = response.statusText
    let code: string | undefined
    try {
      const body: unknown = await response.json()
      if (isErrorBody(body)) {
        message = Array.isArray(body.message) ? body.message.join(', ') : body.message
        code = body.code
      }
    } catch {
      // cuerpo no JSON: se usa statusText
    }
    throw new ApiError(response.status, message, code)
  }

  return (await response.json()) as T
}

export const api = {
  listAnimals(filters: AnimalFilters, lang: Lang, signal?: AbortSignal) {
    return request<Paginated<Animal>>('/animals', { ...filters, lang }, signal)
  },
  getAnimalStats(signal?: AbortSignal) {
    return request<AnimalStats>('/animals/stats', {}, signal)
  },
  getAnimal(id: string, lang: Lang, signal?: AbortSignal) {
    return request<Animal>(`/animals/${encodeURIComponent(id)}`, { lang }, signal)
  },
  listEcoregions(lang: Lang, signal?: AbortSignal) {
    return request<Ecoregion[]>('/ecoregions', { lang }, signal)
  },
  getEcoregion(code: string, lang: Lang, signal?: AbortSignal) {
    return request<Ecoregion>(`/ecoregions/${encodeURIComponent(code)}`, { lang }, signal)
  },
}
