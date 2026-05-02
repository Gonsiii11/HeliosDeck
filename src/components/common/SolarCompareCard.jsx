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
import { buildLocationLabel } from '../../data/locations'
import { useFilters } from '../../contexts/FiltersContext'
import InfoTooltip from './InfoTooltip'
import ExportButton from './ExportButton'

const COLORS = ['#8aebff', '#4edea3', '#ffd6a7']

const mergeSeries = (seriesByLocation) => {
  const bucket = new Map()
  seriesByLocation.forEach(({ id, points }) => {
    points.forEach((point) => {
      if (!bucket.has(point.time)) {
        bucket.set(point.time, { time: point.time })
      }
      bucket.get(point.time)[id] = point.value
    })
  })

  return Array.from(bucket.values()).sort((a, b) => a.time.localeCompare(b.time))
}

const SolarCompareCard = () => {
  const { locations } = useFilters()
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        const payloads = await Promise.all(
          locations.map((location) =>
            fetchNasaIrradiance({ latitude: location.latitude, longitude: location.longitude })
          )
        )

        if (isMounted) {
          const mapped = payloads.map((payload, index) => ({
            id: locations[index].id,
            label: buildLocationLabel(locations[index]),
            points: payload.points,
          }))

          setSeries(mapped)
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
  }, [locations])

  const data = useMemo(() => mergeSeries(series), [series])

  return (
    <div className="glass-card flex min-h-[360px] flex-col rounded-xl p-lg">
      <div className="mb-lg flex items-center justify-between">
        <div>
          <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
            NASA POWER
          </p>
          <div className="flex items-center gap-2">
            <h3 className="text-h3 font-h3 text-on-surface">Comparativa de irradiancia</h3>
            <InfoTooltip
              label="Irradiancia"
              description="Energia solar en superficie por hora."
              unit="W/m2"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
          <ExportButton data={series} fileName="solar-irradiance.json" />
          {locations.map((location, index) => (
            <span key={location.id} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS[index] }}></span>
              {buildLocationLabel(location)}
            </span>
          ))}
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
                {series.map((item, index) => (
                  <Line
                    key={item.id}
                    type="monotone"
                    dataKey={item.id}
                    stroke={COLORS[index]}
                    strokeWidth={2.2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default SolarCompareCard
