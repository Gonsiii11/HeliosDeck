import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import WidgetCard from '../components/common/WidgetCard'
import { fetchMoonData } from '../services/moon'

const getPhaseLabel = (angle) => {
  if (!Number.isFinite(angle)) return '--'
  const normalized = ((angle % 360) + 360) % 360

  if (normalized < 22.5) return 'Luna nueva'
  if (normalized < 67.5) return 'Creciente'
  if (normalized < 112.5) return 'Cuarto creciente'
  if (normalized < 157.5) return 'Gibosa creciente'
  if (normalized < 202.5) return 'Luna llena'
  if (normalized < 247.5) return 'Gibosa menguante'
  if (normalized < 292.5) return 'Cuarto menguante'
  if (normalized < 337.5) return 'Menguante'
  return 'Luna nueva'
}

const formatTime = (value) => (value ? new Date(value).toLocaleString() : '--')

const Moon = () => {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchMoonData()
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
    const interval = setInterval(load, 3600000)

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
        <p className="text-xs uppercase tracking-[0.35em] text-aurora/70">Ciclo lunar</p>
        <h2 className="text-2xl font-semibold">Luna y visibilidad</h2>
        <p className="text-sm text-nebula/70">
          Ephemerides diarias para monitorear fase y horarios.
        </p>
      </header>

      <WidgetCard title="Estado lunar" subtitle="Moonrise/Moonset">
        {loading ? (
          <p className="text-sm text-nebula/60">Cargando...</p>
        ) : error ? (
          <p className="text-sm text-flare">{error}</p>
        ) : (
          <div className="space-y-3 text-sm text-nebula/70">
            <div className="flex items-center justify-between">
              <span>Fase</span>
              <span className="text-nebula">{getPhaseLabel(status?.moonphase)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Angulo fase</span>
              <span className="text-nebula">
                {Number.isFinite(status?.moonphase) ? `${status.moonphase} deg` : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Salida</span>
              <span className="text-nebula">{formatTime(status?.moonrise)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Puesta</span>
              <span className="text-nebula">{formatTime(status?.moonset)}</span>
            </div>
            <p className="text-xs text-nebula/40">
              Coordenadas: {status?.latitude ?? '--'}, {status?.longitude ?? '--'}
            </p>
          </div>
        )}
      </WidgetCard>
    </motion.div>
  )
}

export default Moon
