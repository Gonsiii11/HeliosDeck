// src/components/common/LoginForm.jsx
// Reusable controlled form for credentials with cosmic theme.
// Receives onSubmit(username, password); parent owns the auth call.
// Purely presentational — no useAuth import here.

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LoginForm({ onSubmit, isPending, error }) {
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')

  const inputClass =
    'w-full px-4 py-3 mb-4 rounded-lg border border-aurora/30 bg-surface-container text-on-surface placeholder-on-surface-variant/50 text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-aurora focus:border-aurora transition-all disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(username, password)
      }}
      className="glass-panel rounded-2xl p-6 space-y-4"
    >
      <div>
        <h2 className="text-h3 font-h3 text-on-surface mb-1">Iniciar Sesión</h2>
        <p className="text-body-sm font-body-sm text-on-surface-variant">Credenciales de prueba pre-cargadas</p>
      </div>

      <motion.input
        className={inputClass}
        placeholder="Usuario"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isPending}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      />

      <motion.input
        type="password"
        className={inputClass}
        placeholder="Contraseña"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isPending}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      />

      <motion.button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 px-5 py-3 rounded-lg font-semibold text-body-sm font-body-sm text-on-primary bg-gradient-to-r from-aurora to-secondary hover:from-aurora/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shadow-glow hover:shadow-lg"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {isPending ? '⏳ Autenticando…' : '🔐 Acceder'}
      </motion.button>

      {error && (
        <motion.div
          className="mt-4 p-3 rounded-lg bg-flare/10 border border-flare/30 text-body-sm font-body-sm text-flare"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚠️ {error}
        </motion.div>
      )}
    </form>
  )
}
