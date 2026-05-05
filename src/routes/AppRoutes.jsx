import React, { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import AppLayout from '../components/layout/AppLayout'
import Login from '../pages/Login'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const SolarData = lazy(() => import('../pages/SolarData'))
const Observatory = lazy(() => import('../pages/Observatory'))
const Moon = lazy(() => import('../pages/Moon'))
const Explore = lazy(() => import('../pages/Explore'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

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
        <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
        <Route path="/solar" element={<Suspense fallback={<PageLoader />}><SolarData /></Suspense>} />
        <Route path="/observatory" element={<Suspense fallback={<PageLoader />}><Observatory /></Suspense>} />
        <Route path="/moon" element={<Suspense fallback={<PageLoader />}><Moon /></Suspense>} />
        <Route path="/explore" element={<Suspense fallback={<PageLoader />}><Explore /></Suspense>} />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default AppRoutes
