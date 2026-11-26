import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, setUnauthorizedHandler, tokenStore } from '@/lib/api'
import type { User } from '@/types/api'

type Status = 'loading' | 'authed' | 'guest'

interface AuthValue {
  user: User | null
  status: Status
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

interface AuthResponse { token: string; user: User }

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>(tokenStore.get() ? 'loading' : 'guest')

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
    setStatus('guest')
  }, [])

  const accept = useCallback((r: AuthResponse) => {
    tokenStore.set(r.token)
    setUser(r.user)
    setStatus('authed')
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    if (!tokenStore.get()) return
    let cancelled = false
    api.get<{ user: User }>('/auth/me')
      .then((r) => { if (!cancelled) { setUser(r.user); setStatus('authed') } })
      .catch(() => { if (!cancelled) logout() })
    return () => { cancelled = true }
  }, [logout])

  const login = useCallback(async (email: string, password: string) => {
    accept(await api.post<AuthResponse>('/auth/login', { email, password }))
  }, [accept])

  const register = useCallback(async (name: string, email: string, password: string) => {
    accept(await api.post<AuthResponse>('/auth/register', { name, email, password }))
  }, [accept])

  const value = useMemo(() => ({ user, status, login, register, logout }), [user, status, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
