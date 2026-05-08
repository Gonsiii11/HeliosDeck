// src/contexts/AuthContext.jsx
// AuthProvider owns the auth state machine for the whole app.
// Access pattern: const { user, isLoading, error, login, logout } = useAuth();
//
// Token strategy:
//   - accessToken lives ONLY in this provider's state (React memory, not localStorage)
//   - refreshToken is persisted to localStorage so the session survives reload
//   - On mount we attempt /auth/refresh + /auth/me — never trust localStorage as truth

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authApi from '../services/authApi'
import { tokenStorage } from '../services/tokenStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // initializing on mount
  const [error, setError] = useState(null)

  // Restore session on mount: refresh-token → access-token → /auth/me
  useEffect(() => {
    const stored = tokenStorage.getRefreshToken()
    if (!stored) {
      setIsLoading(false)
      return
    }
    ;(async () => {
      try {
        const tokens = await authApi.refresh(stored)
        const me = await authApi.getMe(tokens.accessToken)
        setAccessToken(tokens.accessToken)
        tokenStorage.setRefreshToken(tokens.refreshToken)
        setUser(me)
      } catch {
        // refresh token expired or revoked → fully clear
        tokenStorage.clear()
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const login = useCallback(async (username, password) => {
    setError(null)
    setIsLoading(true)
    try {
      const result = await authApi.login({ username, password })
      setAccessToken(result.accessToken)
      tokenStorage.setRefreshToken(result.refreshToken)
      // The login endpoint does NOT return `role` — only /auth/me does.
      // Fetch the full profile so user.role is available immediately.
      const me = await authApi.getMe(result.accessToken)
      setUser(me)
      return me
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    setError(null)
    tokenStorage.clear()
  }, [])

  // Used by the refresh-on-401 helper (future) to push fresh tokens back
  // into the source of truth after a successful refresh.
  const updateTokens = useCallback(({ accessToken: newAccess, refreshToken: newRefresh }) => {
    setAccessToken(newAccess)
    if (newRefresh) tokenStorage.setRefreshToken(newRefresh)
  }, [])

  const isAdmin = Boolean(
    user?.role === 'admin' || String(user?.username || '').toLowerCase() === 'emilys'
  )

  const value = { user, accessToken, isLoading, error, login, logout, updateTokens, isAdmin }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
