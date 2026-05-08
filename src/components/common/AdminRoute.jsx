import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Loading } from './StatusMessage'

const AdminRoute = ({ children }) => {
  const { user, isLoading, isAdmin } = useAuth()
  const location = useLocation()

  if (isLoading) return <Loading text="Comprobando sesión…" />

  if (!user) return <Navigate to="/" replace state={{ from: location }} />

  if (!isAdmin) return <Navigate to="/dashboard" replace state={{ from: location }} />

  return children
}

export default AdminRoute
