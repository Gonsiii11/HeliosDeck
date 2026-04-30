import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchIssPosition } from '../services/iss'

const Observatory = () => {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchIssPosition()
        if (isMounted) {
          setStatus(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError('No disponible')
        }
      }
    }

    load()
    const interval = setInterval(load, 10000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-aurora/70">Observatorio orbital</p>
        <h2 className="text-2xl font-semibold">Rastreo ISS</h2>
        <p className="text-sm text-nebula/70">
          Coordenadas en vivo con actualizacion cada 10 segundos.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {error ? (
          <p className="text-sm text-flare">{error}</p>
        ) : (
          <div className="grid gap-3 text-sm text-nebula/70">
            <div className="flex items-center justify-between">
              <span>Latitud</span>
              <span className="text-nebula">{status?.latitude?.toFixed(3) ?? '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Longitud</span>
              <span className="text-nebula">{status?.longitude?.toFixed(3) ?? '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Altitud</span>
              <span className="text-nebula">
                {status?.altitude ? `${status.altitude.toFixed(1)} km` : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Velocidad</span>
              <span className="text-nebula">
                {status?.velocity ? `${status.velocity.toFixed(1)} km/h` : '--'}
              </span>
            </div>
            <p className="text-xs text-nebula/40">
              Actualizado: {status?.timestamp ? new Date(status.timestamp * 1000).toUTCString() : '--'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Observatory
