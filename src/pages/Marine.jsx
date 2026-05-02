import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchMarineWaves } from '../services/marine'

const formatValue = (value, unit) =>
  Number.isFinite(value) ? `${value} ${unit}` : '--'

const Marine = () => {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchMarineWaves()
        if (isMounted) {
          setStatus(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError('No disponible')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()
    const interval = setInterval(load, 900000)

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
          Oceano
        </p>
        <h2 className="text-h2 font-h2 text-on-surface">Olas y energia marina</h2>
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Lecturas horarias para altura y periodo de oleaje.
        </p>
      </header>

      <div className="glass-card rounded-xl p-lg">
        <div className="mb-md flex items-center justify-between">
          <div>
            <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
              Open-Meteo Marine
            </p>
            <h3 className="text-h3 font-h3 text-on-surface">Oleaje reciente</h3>
          </div>
        </div>

        {loading ? (
          <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
        ) : error ? (
          <p className="text-body-sm font-body-sm text-error">{error}</p>
        ) : (
          <div className="space-y-3 text-body-sm font-body-sm text-on-surface-variant">
            <div className="flex items-center justify-between">
              <span>Altura ola</span>
              <span className="text-on-surface">{formatValue(status?.waveHeight, 'm')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Periodo</span>
              <span className="text-on-surface">{formatValue(status?.wavePeriod, 's')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ola viento</span>
              <span className="text-on-surface">{formatValue(status?.windWaveHeight, 'm')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ola swell</span>
              <span className="text-on-surface">{formatValue(status?.swellWaveHeight, 'm')}</span>
            </div>
            <p className="text-xs text-on-surface-variant">Actualizado: {status?.time ?? '--'}</p>
            <p className="text-xs text-on-surface-variant">
              Coordenadas: {status?.latitude ?? '--'}, {status?.longitude ?? '--'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Marine
