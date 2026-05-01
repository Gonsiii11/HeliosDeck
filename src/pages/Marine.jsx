import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import WidgetCard from '../components/common/WidgetCard'
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
        <p className="text-xs uppercase tracking-[0.35em] text-aurora/70">Oceano</p>
        <h2 className="text-2xl font-semibold">Olas y energia marina</h2>
        <p className="text-sm text-nebula/70">
          Lecturas horarias para altura y periodo de oleaje.
        </p>
      </header>

      <WidgetCard title="Oleaje reciente" subtitle="Open-Meteo Marine">
        {loading ? (
          <p className="text-sm text-nebula/60">Cargando...</p>
        ) : error ? (
          <p className="text-sm text-flare">{error}</p>
        ) : (
          <div className="space-y-3 text-sm text-nebula/70">
            <div className="flex items-center justify-between">
              <span>Altura ola</span>
              <span className="text-nebula">{formatValue(status?.waveHeight, 'm')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Periodo</span>
              <span className="text-nebula">{formatValue(status?.wavePeriod, 's')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ola viento</span>
              <span className="text-nebula">
                {formatValue(status?.windWaveHeight, 'm')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ola swell</span>
              <span className="text-nebula">
                {formatValue(status?.swellWaveHeight, 'm')}
              </span>
            </div>
            <p className="text-xs text-nebula/40">
              Actualizado: {status?.time ?? '--'}
            </p>
            <p className="text-xs text-nebula/40">
              Coordenadas: {status?.latitude ?? '--'}, {status?.longitude ?? '--'}
            </p>
          </div>
        )}
      </WidgetCard>
    </motion.div>
  )
}

export default Marine
