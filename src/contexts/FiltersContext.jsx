import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { defaultLocations } from '../data/locations'

const STORAGE_KEY = 'gca-filters'

const FiltersContext = createContext(null)

const DEFAULT_SOURCES = {
  noaa: true,
  nasa: true,
}

const DEFAULT_THRESHOLDS = {
  kp: 5,
  irradiance: 700,
}

const encodeLocation = (location) => {
  if (!location) return ''
  const parts = [location.name, location.country, location.latitude, location.longitude]
  return encodeURIComponent(parts.join('::'))
}

const decodeLocation = (encoded) => {
  if (!encoded) return null
  const decoded = decodeURIComponent(encoded)
  const [name, country, latitude, longitude] = decoded.split('::')
  if (!name || !latitude || !longitude) return null

  return {
    id: `loc-${name.toLowerCase().replace(/\s+/g, '-')}-${latitude}`,
    name,
    country,
    latitude: Number(latitude),
    longitude: Number(longitude),
  }
}

const getStoredState = () => {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const buildInitialState = (searchParams) => {
  const stored = getStoredState()
  const timeRange = searchParams.get('tr') || stored?.timeRange || '24h'
  const sources = stored?.sources || DEFAULT_SOURCES
  const sourceParam = searchParams.get('src')

  const activeSources = sourceParam
    ? sourceParam.split(',').reduce((acc, value) => {
        const key = value.trim()
        if (key && Object.prototype.hasOwnProperty.call(DEFAULT_SOURCES, key)) {
          acc[key] = true
        }
        return acc
      }, {})
    : sources

  const locationsParam = searchParams.get('locs')
  const parsedLocations = locationsParam
    ? locationsParam.split('|').map(decodeLocation).filter(Boolean)
    : stored?.locations || defaultLocations

  const locations = parsedLocations.length > 0 ? parsedLocations.slice(0, 3) : defaultLocations
  const primaryLocationId = stored?.primaryLocationId || locations[0]?.id
  const thresholds = stored?.thresholds || DEFAULT_THRESHOLDS

  return { timeRange, sources: { ...DEFAULT_SOURCES, ...activeSources }, locations, primaryLocationId, thresholds }
}

export const FiltersProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useState(() => buildInitialState(searchParams))

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.set('tr', state.timeRange)

    const activeSources = Object.entries(state.sources)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(',')

    params.set('src', activeSources)

    const encodedLocations = state.locations.map(encodeLocation).join('|')
    params.set('locs', encodedLocations)

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true })
    }
  }, [searchParams, setSearchParams, state])

  const setTimeRange = useCallback((value) => {
    setState((prev) => ({ ...prev, timeRange: value }))
  }, [])

  const toggleSource = useCallback((key) => {
    setState((prev) => ({ ...prev, sources: { ...prev.sources, [key]: !prev.sources[key] } }))
  }, [])

  const addLocation = useCallback((location) => {
    if (!location) return

    setState((prev) => {
      const exists = prev.locations.some((item) => item.id === location.id)
      if (exists) return prev

      const nextLocations = [...prev.locations, location].slice(0, 3)
      return {
        ...prev,
        locations: nextLocations,
        primaryLocationId: prev.primaryLocationId || location.id,
      }
    })
  }, [])

  const removeLocation = useCallback((locationId) => {
    setState((prev) => {
      const nextLocations = prev.locations.filter((item) => item.id !== locationId)
      if (nextLocations.length === 0) {
        return { ...prev, locations: defaultLocations, primaryLocationId: defaultLocations[0].id }
      }

      const nextPrimary = nextLocations.some((item) => item.id === prev.primaryLocationId)
        ? prev.primaryLocationId
        : nextLocations[0]?.id

      return { ...prev, locations: nextLocations, primaryLocationId: nextPrimary }
    })
  }, [])

  const setPrimaryLocation = useCallback((locationId) => {
    setState((prev) => ({ ...prev, primaryLocationId: locationId }))
  }, [])

  const updateThreshold = useCallback((key, value) => {
    setState((prev) => ({
      ...prev,
      thresholds: { ...prev.thresholds, [key]: value },
    }))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      setTimeRange,
      toggleSource,
      addLocation,
      removeLocation,
      setPrimaryLocation,
      updateThreshold,
    }),
    [state, setTimeRange, toggleSource, addLocation, removeLocation, setPrimaryLocation, updateThreshold]
  )

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}

export const useFilters = () => {
  const context = useContext(FiltersContext)
  if (!context) throw new Error('useFilters must be used within FiltersProvider')
  return context
}
