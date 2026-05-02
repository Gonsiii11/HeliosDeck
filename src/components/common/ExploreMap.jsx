import React, { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { fetchNoaaSpaceWeather } from '../../services/noaa'
import { useFilters } from '../../contexts/FiltersContext'

const MAP_STYLE = 'https://demotiles.maplibre.org/style.json'

const buildWorldPolygon = () => ({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [-180, -85],
      [180, -85],
      [180, 85],
      [-180, 85],
      [-180, -85],
    ]],
  },
})

const buildPointCollection = (items, valueKey) => ({
  type: 'FeatureCollection',
  features: items.map((item) => ({
    type: 'Feature',
    properties: {
      id: item.id,
      label: item.label,
      value: item[valueKey],
    },
    geometry: {
      type: 'Point',
      coordinates: [item.longitude, item.latitude],
    },
  })),
})

const buildCloudTileUrl = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_Cloud_Top_Height/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`
}

const ExploreMap = () => {
  const { locations } = useFilters()
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const [showKp, setShowKp] = useState(true)
  const [showClouds, setShowClouds] = useState(false)
  const [kpValue, setKpValue] = useState(null)

  const labeledLocations = useMemo(
    () =>
      locations.map((location) => ({
        ...location,
        label: `${location.name}, ${location.country}`,
      })),
    [locations]
  )

  useEffect(() => {
    if (!containerRef.current) return undefined

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [0, 20],
      zoom: 1.6,
    })

    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: true })

    mapRef.current = map

    map.on('load', () => {
      map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right')

      map.addSource('kp-world', {
        type: 'geojson',
        data: buildWorldPolygon(),
      })

      map.addLayer({
        id: 'kp-world-layer',
        type: 'fill',
        source: 'kp-world',
        paint: {
          'fill-color': '#2fd9f4',
          'fill-opacity': 0.12,
        },
      })

      map.addSource('location-points', {
        type: 'geojson',
        data: buildPointCollection(labeledLocations, 'value'),
      })

      map.addLayer({
        id: 'location-points-layer',
        type: 'circle',
        source: 'location-points',
        paint: {
          'circle-radius': 5,
          'circle-color': '#ffd6a7',
          'circle-stroke-color': '#0e1416',
          'circle-stroke-width': 1.5,
        },
      })

      map.addSource('clouds-layer', {
        type: 'raster',
        tiles: [buildCloudTileUrl()],
        tileSize: 256,
      })

      map.addLayer({
        id: 'clouds-layer',
        type: 'raster',
        source: 'clouds-layer',
        paint: {
          'raster-opacity': 0.35,
        },
      })

      map.setLayoutProperty('clouds-layer', 'visibility', 'none')

      map.on('mouseenter', 'location-points-layer', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'location-points-layer', () => {
        map.getCanvas().style.cursor = ''
      })

      map.on('click', 'location-points-layer', (event) => {
        const feature = event?.features?.[0]
        if (!feature) return

        const coords = feature.geometry?.coordinates
        const label = feature.properties?.label
        if (!coords || !label) return

        popup
          .setLngLat(coords)
          .setHTML(`<div style="font-size:12px;">${label}</div>`)
          .addTo(map)
      })

    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [labeledLocations])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchNoaaSpaceWeather()
        if (isMounted) {
          setKpValue(data.kpIndex)
        }
      } catch {
        if (isMounted) {
          setKpValue(null)
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

  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current
    const kpOpacity = Number.isFinite(kpValue) ? Math.min(0.4, kpValue / 15) : 0.1

    if (map.getLayer('kp-world-layer')) {
      map.setPaintProperty('kp-world-layer', 'fill-opacity', kpOpacity)
      map.setLayoutProperty('kp-world-layer', 'visibility', showKp ? 'visible' : 'none')
    }

    if (map.getLayer('clouds-layer')) {
      map.setLayoutProperty('clouds-layer', 'visibility', showClouds ? 'visible' : 'none')
    }

    const locationSource = map.getSource('location-points')
    if (locationSource) {
      locationSource.setData(buildPointCollection(labeledLocations, 'value'))
    }
  }, [kpValue, showKp, showClouds, labeledLocations])

  return (
    <div className="glass-card rounded-xl p-lg">
      <div className="mb-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
            Modo exploracion
          </p>
          <h3 className="text-h3 font-h3 text-on-surface">Capas globales</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowKp((prev) => !prev)}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-widest transition ${
              showKp
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-white/10 bg-white/5 text-on-surface-variant'
            }`}
          >
            Kp Global
          </button>
          <button
            type="button"
            onClick={() => setShowClouds((prev) => !prev)}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-widest transition ${
              showClouds
                ? 'border-tertiary bg-tertiary/20 text-tertiary'
                : 'border-white/10 bg-white/5 text-on-surface-variant'
            }`}
          >
            Nubosidad
          </button>
        </div>
      </div>

      <div ref={containerRef} className="h-[520px] w-full overflow-hidden rounded-xl" />
      <p className="mt-sm text-xs text-on-surface-variant">
        Kp usa intensidad global y nubosidad usa NASA GIBS.
      </p>
    </div>
  )
}

export default ExploreMap
