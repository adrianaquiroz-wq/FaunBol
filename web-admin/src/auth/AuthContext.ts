import { createContext } from 'react'
import type { UserResponse } from '../api/types'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'error'

export interface AuthContextValue {
  status: AuthStatus
  user: UserResponse | null
  isAdmin: boolean
  /** True when the session ended because the API answered 401. */
  sessionExpired: boolean
  login: (email: string, password: string) => Promise<UserResponse>
  logout: () => void
  retry: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
