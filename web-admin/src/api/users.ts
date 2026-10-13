import { request } from './client'
import type { UserResponse, UserRole, UserStatus } from './types'

export const usersApi = {
  list: (params: { status?: UserStatus; role?: UserRole }) =>
    request<UserResponse[]>('/users', { query: { ...params } }),
  approve: (id: string) => request<UserResponse>(`/users/${id}/approve`, { method: 'PATCH' }),
  reject: (id: string, reason?: string) =>
    request<UserResponse>(`/users/${id}/reject`, {
      method: 'PATCH',
      body: reason && reason.trim() ? { reason: reason.trim() } : {},
    }),
  disable: (id: string) => request<UserResponse>(`/users/${id}/disable`, { method: 'PATCH' }),
}
