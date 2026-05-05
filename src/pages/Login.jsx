import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import ParticleField from '../components/common/ParticleField'
import LoginForm from '../components/common/LoginForm'
import { Loading } from '../components/common/StatusMessage'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { user, isLoading, error, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/dashboard'

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate(from, { replace: true })
    }
  }, [user, isLoading, from, navigate])

  async function handleLogin(username, password) {
    try {
      await login(username, password)
    } catch {
      // error already in context, displayed by LoginForm
    }
  }

  if (isLoading && !user) {
    return (
      <motion.div
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-on-surface"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ParticleField />
        <div className="glass-card relative z-10 w-full max-w-md rounded-3xl p-8 text-center backdrop-blur-xl">
          <Loading text="Restoring session…" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-on-surface"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ParticleField />
      <div className="glass-card relative z-10 w-full max-w-md rounded-3xl p-8 backdrop-blur-xl">
        <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">Geo-Physical</p>
        <h1 className="mt-3 text-h2 font-h2 text-on-surface">Cosmic Aggregator</h1>
        <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant">
          Acceso seguro a paneles de radiacion, magnetosfera y orbita.
        </p>

        <div className="mt-6">
          <LoginForm onSubmit={handleLogin} isPending={isLoading} error={error} />
        </div>

        <motion.p 
          className="mt-5 text-body-sm font-body-sm text-on-surface-variant"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          💡 Tip: <code className="bg-aurora/10 px-2 py-1 rounded border border-aurora/30 text-aurora">emilys</code> / <code className="bg-aurora/10 px-2 py-1 rounded border border-aurora/30 text-aurora">emilyspass</code>
        </motion.p>
      </div>
    </motion.div>
  )
}

export default Login
