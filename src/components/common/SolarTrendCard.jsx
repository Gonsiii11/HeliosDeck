import React, { useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchNasaIrradiance } from '../../services/nasaPower'

const SolarTrendCard = ({
  latitude = 19.43,
  longitude = -99.13,
  title = 'Solar Irradiance Trend',
  subtitle = 'NASA POWER',
}) => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const payload = await fetchNasaIrradiance({ latitude, longitude })
        if (isMounted) {
          setData(payload.points)
          setError(null)
          setUpdatedAt(new Date())
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
  }, [latitude, longitude])

  const subtitleLabel = useMemo(
    () => subtitle.toUpperCase(),
    [subtitle]
  )

  return (
    <div className="glass-card flex min-h-[400px] flex-col rounded-xl p-lg">
      <div className="mb-lg flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">show_chart</span>
          <span className="text-label font-label uppercase tracking-widest text-on-surface-variant">
            {subtitleLabel}
          </span>
        </div>
        <div className="flex items-center gap-sm">
          <span className="h-3 w-3 rounded-full bg-primary"></span>
          <span className="h-3 w-3 rounded-full bg-secondary"></span>
        </div>
      </div>

      {loading ? (
        <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando NASA POWER...</p>
      ) : error ? (
        <p className="text-body-sm font-body-sm text-error">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Sin datos disponibles para la fecha seleccionada.
        </p>
      ) : (
        <div className="flex-grow">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#dde4e5',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8aebff"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-lg border-t border-white/5 pt-md text-body-sm font-body-sm text-on-surface-variant">
        {title}
        {updatedAt ? ` • Updated ${updatedAt.toLocaleTimeString()}` : ''}
      </div>
    </div>
  )
}

export default SolarTrendCard
