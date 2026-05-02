import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { fetchIssPosition } from '../../services/iss'

const TRACK_WINDOW_MS = 90 * 60 * 1000
const MAP_STYLE = 'https://demotiles.maplibre.org/style.json'

const buildLine = (positions) => ({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: positions.map((pos) => [pos.longitude, pos.latitude]),
  },
})

const buildPoint = (position) => ({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: position ? [position.longitude, position.latitude] : [0, 0],
  },
})

const IssMap = () => {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const positionsRef = useRef([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return undefined

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [0, 0],
      zoom: 2.1,
    })

    mapRef.current = map

    map.on('load', () => {
      map.addSource('iss-track', {
        type: 'geojson',
        data: buildLine([]),
      })

      map.addLayer({
        id: 'iss-track-line',
        type: 'line',
        source: 'iss-track',
        paint: {
          'line-color': '#2fd9f4',
          'line-width': 2,
        },
      })

      map.addSource('iss-point', {
        type: 'geojson',
        data: buildPoint(null),
      })

      map.addLayer({
        id: 'iss-point-circle',
        type: 'circle',
        source: 'iss-point',
        paint: {
          'circle-radius': 5,
          'circle-color': '#ffd6a7',
          'circle-stroke-color': '#0e1416',
          'circle-stroke-width': 1.5,
        },
      })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchIssPosition()
        if (!isMounted || !mapRef.current) return

        const now = Date.now()
        const nextPositions = [...positionsRef.current, { ...data, timestamp: now }]
          .filter((pos) => now - pos.timestamp <= TRACK_WINDOW_MS)
          .slice(-720)

        positionsRef.current = nextPositions

        const lineSource = mapRef.current.getSource('iss-track')
        if (lineSource) {
          lineSource.setData(buildLine(nextPositions))
        }

        const pointSource = mapRef.current.getSource('iss-point')
        if (pointSource) {
          pointSource.setData(buildPoint(data))
        }

        if (Number.isFinite(data.longitude) && Number.isFinite(data.latitude)) {
          mapRef.current.easeTo({ center: [data.longitude, data.latitude], duration: 800 })
        }

        setError(null)
      } catch (err) {
        if (isMounted) {
          setError('No disponible')
        }
      }
    }

    load()
    const interval = setInterval(load, 10000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="h-[360px] w-full overflow-hidden rounded-xl" />
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  )
}

export default IssMap
