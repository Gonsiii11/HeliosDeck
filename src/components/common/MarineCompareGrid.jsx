import React, { useEffect, useMemo, useState } from 'react'
import { fetchMarineWaves } from '../../services/marine'
import { buildLocationLabel, favoriteLocations } from '../../data/locations'
import { useFilters } from '../../contexts/FiltersContext'
import ExportButton from './ExportButton'

const formatValue = (value, unit) => (Number.isFinite(value) ? `${value} ${unit}` : '--')

const MarineCompareGrid = () => {
  const { locations, addLocation } = useFilters()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const coastalSuggestions = useMemo(
    () =>
      ['barcelona-es', 'sydney-au', 'los-angeles-us']
        .map((id) => favoriteLocations.find((location) => location.id === id))
        .filter(Boolean),
    []
  )

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        const payloads = await Promise.all(
          locations.map((location) =>
            fetchMarineWaves({ latitude: location.latitude, longitude: location.longitude })
          )
        )

        if (isMounted) {
          const mapped = payloads.map((payload, index) => ({
            location: locations[index],
            data: payload,
          }))
          setEntries(mapped)
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
  }, [locations])

  if (loading) {
    return <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
  }

  if (error) {
    return <p className="text-body-sm font-body-sm text-error">{error}</p>
  }

  const hasAnyData = entries.some(({ data }) =>
    [data?.waveHeight, data?.wavePeriod, data?.windWaveHeight, data?.swellWaveHeight].some((value) =>
      Number.isFinite(value)
    )
  )

  return (
    <div className="space-y-md">
      {!hasAnyData ? (
        <div className="glass-card rounded-xl p-md text-body-sm font-body-sm text-on-surface-variant">
          <p className="text-on-surface">
            No hay datos marinos para las ubicaciones actuales (zonas continentales).
          </p>
          <div className="mt-sm flex flex-wrap gap-2">
            {coastalSuggestions.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => addLocation(location)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-on-surface transition hover:border-white/30"
              >
                Agregar {buildLocationLabel(location)}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex justify-end">
        <ExportButton data={entries} fileName="marine-waves.json" />
      </div>
      <div className="grid gap-bento-gap md:grid-cols-2 xl:grid-cols-3">
        {entries.map(({ location, data }) => (
          <div key={location.id} className="glass-card rounded-xl p-lg">
            <div className="mb-md">
              <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
                Open-Meteo Marine
              </p>
              <h3 className="text-h3 font-h3 text-on-surface">{buildLocationLabel(location)}</h3>
            </div>

            <div className="space-y-3 text-body-sm font-body-sm text-on-surface-variant">
              <div className="flex items-center justify-between">
                <span>Altura ola</span>
                <span className="text-on-surface">{formatValue(data?.waveHeight, 'm')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Periodo</span>
                <span className="text-on-surface">{formatValue(data?.wavePeriod, 's')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ola viento</span>
                <span className="text-on-surface">{formatValue(data?.windWaveHeight, 'm')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ola swell</span>
                <span className="text-on-surface">{formatValue(data?.swellWaveHeight, 'm')}</span>
              </div>
              <p className="text-xs text-on-surface-variant">Actualizado: {data?.time ?? '--'}</p>
              {!Number.isFinite(data?.waveHeight) ? (
                <p className="text-xs text-on-surface-variant">
                  Sin datos marinos para esta ubicacion.
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarineCompareGrid
