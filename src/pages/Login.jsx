import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import ParticleField from '../components/common/ParticleField'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [name, setName] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = (event) => {
    event.preventDefault()
    login({ name: name || 'Cosmic Analyst' })
    const target = location.state?.from?.pathname || '/dashboard'
    navigate(target, { replace: true })
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
      <div className="glass-card relative z-10 w-full max-w-md rounded-3xl p-8 text-center backdrop-blur-xl">
        <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">Geo-Physical</p>
        <h1 className="mt-3 text-h2 font-h2 text-on-surface">Cosmic Aggregator</h1>
        <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant">
          Acceso seguro a paneles de radiacion, magnetosfera y orbita.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre del operador"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-body-sm font-body-sm text-on-surface outline-none focus:border-primary/60"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-primary/20 px-4 py-3 text-body-sm font-semibold text-primary transition active:scale-95"
          >
            Ingresar
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default Login
