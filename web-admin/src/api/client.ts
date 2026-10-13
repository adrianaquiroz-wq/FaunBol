import type { ApiErrorBody } from './types'
import { storageGet, storageRemove, storageSet } from '../lib/storage'

export const API_URL: string = (
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api'
).replace(/\/+$/, '')

const TOKEN_KEY = 'faunbol_admin_token'

export const tokenStore = {
  get: () => storageGet(TOKEN_KEY),
  set: (token: string) => storageSet(TOKEN_KEY, token),
  clear: () => storageRemove(TOKEN_KEY),
}

/** Error thrown for any failed request. status 0 = network error (API unreachable). */
export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly details?: Record<string, unknown>
  readonly messages: string[]

  constructor(status: number, body?: Partial<ApiErrorBody>) {
    const raw = body?.message
    const msgs = Array.isArray(raw) ? raw : raw ? [raw] : []
    super(msgs[0] ?? `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.code = body?.code
    this.details = body?.details
    this.messages = msgs
  }

  /** True for 400 validation errors whose `message` is an array. */
  get isValidation(): boolean {
    return this.status === 400 && !this.code && this.messages.length > 0
  }
}

let unauthorizedHandler: (() => void) | null = null

/** Registered by the AuthProvider: called on any 401 from an authenticated request. */
export function setUnauthorizedHandler(fn: (() => void) | null): void {
  unauthorizedHandler = fn
}

type Query = Record<string, string | number | undefined | null>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  query?: Query
  body?: unknown
  /** Sent as multipart/form-data (browser sets the boundary). */
  formData?: FormData
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(API_URL + path)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let body: BodyInit | undefined
  if (opts.formData) {
    body = opts.formData
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(opts.body)
  }

  let res: Response
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method: opts.method ?? 'GET',
      headers,
      body,
    })
  } catch {
    throw new ApiError(0, { code: 'NETWORK_ERROR' })
  }

  if (res.status === 204) return undefined as T

  const text = await res.text()
  let data: unknown = undefined
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = undefined
    }
  }

  if (!res.ok) {
    const err = new ApiError(res.status, (data ?? {}) as Partial<ApiErrorBody>)
    if (res.status === 401 && token) {
      tokenStore.clear()
      unauthorizedHandler?.()
    }
    throw err
  }
  return data as T
}
