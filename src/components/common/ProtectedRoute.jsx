import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Loading } from './StatusMessage'

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Show loading while checking session (never render protected UI during init)
  if (isLoading) return <Loading text="Checking session…" />

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
