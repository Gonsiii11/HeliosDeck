import React, { useEffect, useState } from 'react'
import { fetchNoaaKpForecast } from '../../services/noaa'

const NoaaForecastCard = () => {
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchNoaaKpForecast()
        if (isMounted) {
          setForecast(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError('No disponible')
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-nebula/60">Pronostico</p>
        <h3 className="mt-2 text-lg font-semibold">Indice Kp (24h)</h3>
      </div>
      {error ? (
        <p className="text-sm text-flare">{error}</p>
      ) : forecast.length === 0 ? (
        <p className="text-sm text-nebula/60">Sin datos de pronostico.</p>
      ) : (
        <div className="space-y-3 text-sm text-nebula/70">
          {forecast.map((item, index) => (
            <div key={item.time ?? `kp-${index}`} className="flex items-center justify-between">
              <span>{item.time ?? '--'}</span>
              <span className="text-nebula">{item.kp ?? '--'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NoaaForecastCard
