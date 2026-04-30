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
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f16] text-nebula"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ParticleField />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-aurora/70">Geo-Physical</p>
        <h1 className="mt-3 text-3xl font-semibold">Cosmic Aggregator</h1>
        <p className="mt-3 text-sm text-nebula/70">
          Acceso seguro a paneles de radiacion, magnetosfera y orbita.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre del operador"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-nebula outline-none focus:border-aurora/60"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-aurora/20 px-4 py-3 text-sm font-semibold text-aurora transition active:scale-95"
          >
            Ingresar
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default Login
