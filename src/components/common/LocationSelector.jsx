import React, { useEffect, useMemo, useState } from 'react'
import { favoriteLocations, buildLocationLabel } from '../../data/locations'
import { searchLocations } from '../../services/geocoding'
import { useFilters } from '../../contexts/FiltersContext'

const LocationSelector = () => {
  const { locations, addLocation, removeLocation, setPrimaryLocation, primaryLocationId } = useFilters()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setError(null)
      return undefined
    }

    let isActive = true
    const handler = setTimeout(async () => {
      try {
        setLoading(true)
        const data = await searchLocations(query)
        if (isActive) {
          setResults(data)
          setError(null)
        }
      } catch (err) {
        if (isActive) {
          setError('Busqueda no disponible')
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      isActive = false
      clearTimeout(handler)
    }
  }, [query])

  const selectedIds = useMemo(() => new Set(locations.map((item) => item.id)), [locations])

  return (
    <div className="glass-card rounded-xl p-md">
      <div className="mb-sm flex items-center justify-between">
        <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
          Ubicaciones activas
        </p>
        <span className="text-xs text-on-surface-variant">Hasta 3</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {locations.map((location) => (
          <div
            key={location.id}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
              location.id === primaryLocationId
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-white/10 bg-white/5 text-on-surface'
            }`}
          >
            <button
              type="button"
              onClick={() => setPrimaryLocation(location.id)}
              className="uppercase tracking-wide"
            >
              {buildLocationLabel(location)}
            </button>
            <button
              type="button"
              onClick={() => removeLocation(location.id)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="mt-md">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar ciudad o pais"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-body-sm font-body-sm text-on-surface outline-none focus:border-primary/60"
        />
        <div className="mt-sm text-xs text-on-surface-variant">
          {loading ? 'Buscando...' : error || 'Sugerencias basadas en Open-Meteo'}
        </div>
      </div>

      <div className="mt-md grid gap-2">
        {results.map((location) => (
          <button
            key={location.id}
            type="button"
            onClick={() => addLocation(location)}
            disabled={selectedIds.has(location.id) || locations.length >= 3}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-on-surface transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>
              {location.name}
              {location.admin1 ? `, ${location.admin1}` : ''} ({location.country})
            </span>
            <span className="text-on-surface-variant">+ Agregar</span>
          </button>
        ))}
      </div>

      <div className="mt-md">
        <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
          Favoritos
        </p>
        <div className="mt-sm flex flex-wrap gap-2">
          {favoriteLocations.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => addLocation(location)}
              disabled={selectedIds.has(location.id) || locations.length >= 3}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-on-surface transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buildLocationLabel(location)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LocationSelector
