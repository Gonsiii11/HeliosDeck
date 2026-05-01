import React, { useEffect, useState } from 'react'
import { fetchNoaaAlerts } from '../../services/noaa'

const NoaaAlertsCard = () => {
  const [alert, setAlert] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchNoaaAlerts()
        if (isMounted) {
          setAlert(data)
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
    <div className="panel-sheen rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-nebula/60">Alertas</p>
        <h3 className="mt-2 text-lg font-semibold">SWPC reciente</h3>
      </div>
      {error ? (
        <p className="text-sm text-flare">{error}</p>
      ) : alert?.title ? (
        <div className="space-y-2 text-sm text-nebula/70">
          <p className="text-nebula">{alert.title}</p>
          <p className="text-xs text-nebula/40">Emitido: {alert.issuedAt ?? '--'}</p>
        </div>
      ) : (
        <p className="text-sm text-nebula/60">Sin alertas recientes.</p>
      )}
    </div>
  )
}

export default NoaaAlertsCard
