import React, { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'gca-auth'

const readInitialState = () => {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return { isAuthenticated: false, user: null }
  try {
    return JSON.parse(raw)
  } catch {
    return { isAuthenticated: false, user: null }
  }
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(readInitialState)

  const login = (payload) => {
    const nextState = { isAuthenticated: true, user: payload }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
    setAuthState(nextState)
  }

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setAuthState({ isAuthenticated: false, user: null })
  }

  const value = useMemo(() => ({ ...authState, login, logout }), [authState])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
