import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchIssPosition } from '../services/iss'
import IssMap from '../components/common/IssMap'

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
        <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
          Observatorio orbital
        </p>
        <h2 className="text-h2 font-h2 text-on-surface">Rastreo ISS</h2>
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Coordenadas en vivo con actualizacion cada 10 segundos.
        </p>
      </header>

      <div className="glass-card rounded-xl p-lg">
        {error ? (
          <p className="text-body-sm font-body-sm text-error">{error}</p>
        ) : (
          <div className="grid gap-3 text-body-sm font-body-sm text-on-surface-variant">
            <div className="flex items-center justify-between">
              <span>Latitud</span>
              <span className="text-on-surface">{status?.latitude?.toFixed(3) ?? '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Longitud</span>
              <span className="text-on-surface">{status?.longitude?.toFixed(3) ?? '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Altitud</span>
              <span className="text-on-surface">
                {status?.altitude ? `${status.altitude.toFixed(1)} km` : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Velocidad</span>
              <span className="text-on-surface">
                {status?.velocity ? `${status.velocity.toFixed(1)} km/h` : '--'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Actualizado: {status?.timestamp ? new Date(status.timestamp * 1000).toUTCString() : '--'}
            </p>
          </div>
        )}
      </div>

      <div className="glass-card rounded-xl p-lg">
        <div className="mb-md">
          <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
            Trayectoria orbital
          </p>
          <h3 className="text-h3 font-h3 text-on-surface">Ultimos 90 minutos</h3>
        </div>
        <IssMap />
      </div>
    </motion.div>
  )
}

export default Observatory
