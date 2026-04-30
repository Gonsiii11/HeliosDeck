import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import AppLayout from '../components/layout/AppLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import SolarData from '../pages/SolarData'
import Observatory from '../pages/Observatory'

const AppRoutes = () => {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/solar" element={<SolarData />} />
        <Route path="/observatory" element={<Observatory />} />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default AppRoutes
