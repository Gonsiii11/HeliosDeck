import React, { useEffect, useState } from 'react'
import AlertPulse from './AlertPulse'
import { fetchNoaaSpaceWeather } from '../../services/noaa'

const NoaaStatusCard = () => {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchNoaaSpaceWeather()
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
    const interval = setInterval(load, 60000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const kpIndex = status?.kpIndex
  const isStorm = typeof kpIndex === 'number' && kpIndex >= 5
  const windTime = status?.windTime ?? status?.kpTime
  const magTime = status?.magTime

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-nebula/60">NOAA SWPC</p>
          <h3 className="mt-2 text-lg font-semibold">Clima espacial actual</h3>
        </div>
        <AlertPulse active={isStorm} />
      </div>

      {error ? (
        <p className="mt-4 text-sm text-flare">{error}</p>
      ) : (
        <div className="mt-4 grid gap-3 text-sm text-nebula/70">
          <div className="flex items-center justify-between">
            <span>Indice Kp</span>
            <span className="text-nebula">{kpIndex ?? '--'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Viento solar</span>
            <span className="text-nebula">
              {typeof status?.windSpeed === 'number' ? `${status.windSpeed} km/s` : '--'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Densidad</span>
            <span className="text-nebula">
              {typeof status?.windDensity === 'number' ? `${status.windDensity} p/cm3` : '--'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Temperatura</span>
            <span className="text-nebula">
              {typeof status?.windTemperature === 'number'
                ? `${status.windTemperature} K`
                : '--'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Bz (GSM)</span>
            <span className="text-nebula">
              {typeof status?.bzGsm === 'number' ? `${status.bzGsm} nT` : '--'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Bt</span>
            <span className="text-nebula">
              {typeof status?.bt === 'number' ? `${status.bt} nT` : '--'}
            </span>
          </div>
          <p className="text-xs text-nebula/40">Actualizado: {windTime ?? magTime ?? '--'}</p>
        </div>
      )}
    </div>
  )
}

export default NoaaStatusCard
