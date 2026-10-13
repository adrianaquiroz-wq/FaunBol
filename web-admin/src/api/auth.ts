import { request } from './client'
import type { LoginResponse, RegisterInput, UserResponse } from './types'

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } }),
  register: (input: RegisterInput) =>
    request<UserResponse>('/auth/register', { method: 'POST', body: input }),
  me: () => request<UserResponse>('/auth/me'),
}
