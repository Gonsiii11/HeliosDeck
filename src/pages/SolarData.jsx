import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchNasaIrradiance } from '../services/nasaPower'

const SolarData = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const payload = await fetchNasaIrradiance({ latitude: 19.43, longitude: -99.13 })
        if (isMounted) {
          setData(payload.points)
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
    const interval = setInterval(load, 300000)

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
        <p className="text-xs uppercase tracking-[0.35em] text-aurora/70">Radiacion solar</p>
        <h2 className="text-2xl font-semibold">Fluctuacion de irradiancia</h2>
        <p className="text-sm text-nebula/70">
          Curva animada para visualizar tendencias en tiempo real.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {loading ? (
          <p className="text-sm text-nebula/60">Cargando NASA POWER...</p>
        ) : error ? (
          <p className="text-sm text-flare">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-nebula/60">Sin datos disponibles para la fecha seleccionada.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip contentStyle={{ background: '#111827', border: 'none' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#58f2c7"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SolarData
