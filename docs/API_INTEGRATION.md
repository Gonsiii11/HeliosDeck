# Guía de Integración de APIs - Geo-Physical Cosmic Aggregator

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [NOAA SWPC](#noaa-swpc)
3. [NASA POWER](#nasa-power)
4. [Where The ISS At](#where-the-iss-at)
5. [Met.no](#metno)
6. [Open-Meteo Marine](#open-meteo-marine)
7. [Open-Meteo Geocoding](#open-meteo-geocoding)
8. [Patrones Comunes](#patrones-comunes)
9. [Troubleshooting](#troubleshooting)

---

## Visión General

### Consumo de APIs en el Proyecto

| API | Tipo | Autenticación | Límites | CORS |
|-----|------|---------------|---------|------|
| NOAA SWPC | REST JSON | Ninguna | 10req/s | ✅ |
| NASA POWER | REST JSON | Ninguna | 10req/s | ✅ |
| Where ISS At | REST JSON | Ninguna | No definido | ✅ |
| Met.no | REST JSON | Ninguna | 20req/s | ✅ |
| Open-Meteo | REST JSON | Ninguna | 10000req/día | ✅ |

### Diagrama de Flujo General

```
Usuario interactúa
    ↓
Componente triggerea fetch
    ↓
Service construye URL + parámetros
    ↓
fetch() realiza request HTTP
    ↓
Validar response.ok
    ↓
JSON parsing
    ↓
Normalizar datos
    ↓
Cachear si es aplicable
    ↓
setState() actualiza UI
    ↓
Componentes re-renderean
```

---

## NOAA SWPC

### Descripción

National Oceanic and Atmospheric Administration - Space Weather Prediction Center proporciona datos de clima espacial en tiempo real, incluyendo:
- Índice Kp (actividad geomagnética)
- Viento solar (velocidad y densidad)
- Campo magnético (componentes Bx, By, Bz)
- Alertas activas
- Pronósticos 3-4 días

### URLs Base

```
https://services.swpc.noaa.gov/products/
```

### Endpoints

#### 1. Kp Index Observado

**Endpoint:** `/noaa-planetary-k-index.json`

**Descripción:** Índice Kp observado más reciente

**Respuesta:**
```json
[
  ["2025-01-05T00:00Z", 3, 2],
  ["2025-01-05T03:00Z", 4, 3],
  ["2025-01-05T06:00Z", 5, 4],
  ...
]
// Formato: [timestamp, Kp_índice, Kp_estimado]
```

**Implementación:**
```javascript
const KP_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'

export const fetchNoaaKp = async () => {
  const response = await fetch(KP_URL)
  if (!response.ok) throw new Error('Kp fetch failed')
  
  const data = await response.json()
  const latest = getLatestKp(data)  // Buscar entrada más reciente
  
  return {
    kp: latest?.Kp,
    timestamp: latest?.time_tag
  }
}
```

#### 2. Kp Forecast

**Endpoint:** `/noaa-planetary-k-index-forecast.json`

**Descripción:** Pronóstico Kp para próximos 3-4 días

**Respuesta:**
```json
{
  "0": {
    "kp": "4",
    "timewin": "0330-0430"
  },
  "1": {
    "kp": "5",
    "timewin": "0430-0530"
  }
}
```

**Implementación:**
```javascript
const KP_FORECAST_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json'

export const fetchNoaaKpForecast = async () => {
  const response = await fetch(KP_FORECAST_URL)
  if (!response.ok) throw new Error('Forecast fetch failed')
  
  const data = await response.json()
  
  return Object.values(data).map(item => ({
    kp: Number(item.kp),
    timeWindow: item.timewin
  }))
}
```

#### 3. Plasma Solar (Viento Solar)

**Endpoint:** `/solar-wind/plasma-1-day.json`

**Descripción:** Velocidad y densidad del viento solar últimas 24 horas

**Respuesta:**
```json
[
  ["Time_Tag", "Density", "Speed", "Temperature"],
  ["2025-01-04T23:00Z", 5.2, 420, 25000],
  ["2025-01-05T00:00Z", 5.1, 418, 24800],
  ...
]
```

**Implementación:**
```javascript
const PLASMA_URL = 'https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json'

export const fetchNoaaPlasma = async () => {
  const response = await fetch(PLASMA_URL)
  if (!response.ok) throw new Error('Plasma fetch failed')
  
  const rows = await response.json()
  const latest = getLatestNumericRow(rows, 3)  // Row con 3+ columnas numéricas
  
  return {
    density: Number(latest?.[1]),
    speed: Number(latest?.[2]),
    temperature: Number(latest?.[3])
  }
}
```

#### 4. Campo Magnético

**Endpoint:** `/solar-wind/mag-1-day.json`

**Descripción:** Componentes del campo magnético Bx, By, Bz últimas 24 horas

**Respuesta:**
```json
[
  ["Time_Tag", "Bt", "Bx", "By", "Bz"],
  ["2025-01-04T23:00Z", 5.2, 2.1, -1.5, -4.2],
  ...
]
```

**Implementación:**
```javascript
const MAG_URL = 'https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json'

export const fetchNoaaMag = async () => {
  const response = await fetch(MAG_URL)
  if (!response.ok) throw new Error('Mag fetch failed')
  
  const rows = await response.json()
  const latest = getLatestNumericRow(rows, 4)
  
  return {
    bt: Number(latest?.[1]),
    bx: Number(latest?.[2]),
    by: Number(latest?.[3]),
    bz: Number(latest?.[4])
  }
}
```

#### 5. Alertas

**Endpoint:** `/alerts.json`

**Descripción:** Alertas activas de clima espacial

**Respuesta:**
```json
[
  {
    "issue": "2025-01-05T10:30Z",
    "phenomenon": "SPACE WEATHER MESSAGE",
    "significance": "WARNING",
    "message": "ALERT: Geomagnetic K-index...",
    "expires": "2025-01-05T16:00Z"
  }
]
```

**Implementación:**
```javascript
const ALERTS_URL = 'https://services.swpc.noaa.gov/products/alerts.json'

export const fetchNoaaAlerts = async () => {
  const response = await fetch(ALERTS_URL)
  if (!response.ok) throw new Error('Alerts fetch failed')
  
  const alerts = await response.json()
  
  return alerts.map(alert => ({
    title: extractAlertTitle(alert.message),
    significance: alert.significance,
    issued: alert.issue,
    expires: alert.expires,
    fullMessage: alert.message
  }))
}
```

### Uso en Componentes

```javascript
import { fetchNoaaSpaceWeather, fetchNoaaAlerts } from '../services/noaa'

function NoaaStatusCard() {
  const [data, setData] = useState(null)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Cargar datos inicialmente
    loadData()
    
    // Actualizar cada 60 segundos
    const interval = setInterval(loadData, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [spaceData, alertData] = await Promise.all([
        fetchNoaaSpaceWeather(),
        fetchNoaaAlerts()
      ])
      setData(spaceData)
      setAlerts(alertData)
    } catch (err) {
      console.error('NOAA fetch failed:', err)
    }
  }

  return (
    <WidgetCard title="Space Weather Status">
      {data && (
        <div className="grid grid-cols-2 gap-4">
          <Metric label="Kp Index" value={data.kp} />
          <Metric label="Wind Speed" value={data.windSpeed} unit="km/s" />
          <Metric label="Density" value={data.density} unit="p/cc" />
          <Metric label="Bz Component" value={data.bz} unit="nT" />
        </div>
      )}
      {alerts.length > 0 && (
        <AlertsList alerts={alerts} />
      )}
    </WidgetCard>
  )
}
```

---

## NASA POWER

### Descripción

Prediction of Worldwide Energy Resource (POWER) proporciona datos de radiación solar para cualquier coordenada del planeta.

**API URL:** `https://power.larc.nasa.gov/api/temporal/hourly/point`

### Parámetros

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|----------|------------|---------|
| `longitude` | number | ✅ | Longitud geográfica | -74.0060 (Nueva York) |
| `latitude` | number | ✅ | Latitud geográfica | 40.7128 |
| `start` | string | ✅ | Fecha inicio (YYYYMMDD) | 20250101 |
| `end` | string | ✅ | Fecha fin (YYYYMMDD) | 20250105 |
| `parameters` | string | ✅ | Métrica deseada | ALLSKY_SFC_SW_DWN |
| `community` | string | ✅ | Comunidad | RE (Renewable Energy) |
| `format` | string | ✅ | Formato | JSON |

### Métrica Disponible

**ALLSKY_SFC_SW_DWN:** Irradiancia solar incidente (W/m²)
- Mejor para: Análisis de energía solar
- Rango típico: 0-1000 W/m²
- Unidades: Watts por metro cuadrado

### Construcción de Request

```javascript
const buildNasaPowerUrl = ({ latitude, longitude, start, end }) => {
  const url = new URL('https://power.larc.nasa.gov/api/temporal/hourly/point')
  
  url.searchParams.set('parameters', 'ALLSKY_SFC_SW_DWN')
  url.searchParams.set('community', 'RE')
  url.searchParams.set('longitude', longitude)
  url.searchParams.set('latitude', latitude)
  url.searchParams.set('start', formatDate(start))     // 20250105
  url.searchParams.set('end', formatDate(end))         // 20250105
  url.searchParams.set('format', 'JSON')
  
  return url.toString()
}
```

### Respuesta

```json
{
  "geometry": {
    "type": "Point",
    "coordinates": [-74.0060, 40.7128]
  },
  "properties": {
    "parameter": {
      "ALLSKY_SFC_SW_DWN": {
        "20250105": 150,
        "20250106": 160,
        "20250107": -999
      }
    }
  }
}
```

### Parseo de Respuesta

```javascript
const parseNasaPowerResponse = (payload) => {
  const series = payload?.properties?.parameter?.ALLSKY_SFC_SW_DWN || {}
  
  return Object.entries(series)
    .map(([key, value]) => {
      const numeric = Number(value)
      
      // Filtrar valores erróneos
      if (!Number.isFinite(numeric) || numeric < -900) {
        return null
      }
      
      return {
        date: key,           // "20250105"
        time: `${key.slice(8, 10)}:00`,  // "05:00"
        value: numeric
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date))
}
```

### Cacheo Inteligente

```javascript
const CACHE_TTL = 24 * 60 * 60 * 1000  // 24 horas

const getCacheKey = ({ latitude, longitude }) =>
  `gca-nasa-irradiance:${latitude.toFixed(2)}:${longitude.toFixed(2)}`

const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    
    const { data, timestamp } = JSON.parse(raw)
    
    // Validar que no sea demasiado antiguo
    if (Date.now() - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(key)
      return null
    }
    
    return data
  } catch {
    return null
  }
}

const writeCache = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch {
    // Ignorar fallos de cache (storage lleno, etc)
  }
}
```

### Implementación Completa

```javascript
export const fetchNasaIrradiance = async ({ latitude, longitude }) => {
  const cacheKey = getCacheKey({ latitude, longitude })
  const cached = readCache(cacheKey)
  
  if (cached) return cached  // Retornar cache si está disponible
  
  const maxAttempts = 5
  
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const { start, end } = getLastCompleteUtcDayRange(
        1 + attempt * 365  // Retroceder 1 año en cada intento
      )
      
      const url = buildNasaPowerUrl({ latitude, longitude, start, end })
      const response = await fetch(url)
      
      if (!response.ok) {
        if (cached) return cached
        continue
      }
      
      const payload = await response.json()
      const points = parseNasaPowerResponse(payload)
      
      if (points.length > 0) {
        const result = { points, latitude, longitude }
        writeCache(cacheKey, result)
        return result
      }
    } catch (err) {
      console.error(`NASA POWER attempt ${attempt} failed:`, err)
    }
  }
  
  // Si llegamos aquí y hay cache, retornarlo
  if (cached) return cached
  
  throw new Error('NASA POWER: No data available')
}
```

### Uso en Componentes

```javascript
function SolarDataPanel() {
  const [location, setLocation] = useState({ latitude: 40.7128, longitude: -74.0060 })
  const [irradiance, setIrradiance] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadSolarData = useCallback(async () => {
    if (!location) return
    
    setLoading(true)
    try {
      const data = await fetchNasaIrradiance(location)
      setIrradiance(data.points)
    } catch (err) {
      console.error('Failed to fetch solar data:', err)
    } finally {
      setLoading(false)
    }
  }, [location])

  useEffect(() => {
    loadSolarData()
  }, [location, loadSolarData])

  return (
    <WidgetCard title="Solar Irradiance">
      {loading && <LoadingSpinner />}
      {irradiance && (
        <LineChart data={irradiance}>
          <CartesianGrid />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#fbbf24" />
        </LineChart>
      )}
    </WidgetCard>
  )
}
```

---

## Where The ISS At

### Descripción

Proporciona la posición actual de la Estación Espacial Internacional.

**API URL:** `https://api.wheretheiss.at/v1/satellites/25544`
(25544 es el NORAD ID de la ISS)

### Respuesta

```json
{
  "name": "ISS (ZARYA)",
  "id": 25544,
  "latitude": 51.6416,
  "longitude": 75.8431,
  "altitude": 408.79,
  "velocity": 27644.67,
  "visibility": "daylight",
  "footprint": 2388.56,
  "timestamp": 1672531200,
  "solar_lat": 19.43,
  "solar_lon": -99.13,
  "units": {
    "altitude": "km",
    "velocity": "km/h"
  }
}
```

### Implementación

```javascript
const ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544'

export const fetchIssPosition = async () => {
  const response = await fetch(ISS_URL)
  if (!response.ok) throw new Error('ISS fetch failed')
  
  const payload = await response.json()
  
  return {
    name: payload?.name ?? 'ISS',
    latitude: payload?.latitude ?? null,
    longitude: payload?.longitude ?? null,
    altitude: payload?.altitude ?? null,        // km
    velocity: payload?.velocity ?? null,        // km/h
    visibility: payload?.visibility ?? null,    // daylight, eclipsed, etc
    timestamp: payload?.timestamp ?? null       // Unix timestamp
  }
}
```

### Actualización en Tiempo Real

```javascript
function IssTracker() {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    // Actualizar cada 2 segundos
    const interval = setInterval(async () => {
      try {
        const data = await fetchIssPosition()
        setPosition(data)
      } catch (err) {
        console.error('Failed to fetch ISS position:', err)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <p>Lat: {position?.latitude?.toFixed(4)}</p>
      <p>Lon: {position?.longitude?.toFixed(4)}</p>
      <p>Alt: {position?.altitude?.toFixed(2)} km</p>
      <p>Vel: {position?.velocity?.toFixed(2)} km/h</p>
    </div>
  )
}
```

---

## Met.no

### Descripción

Norwegian Meteorological Institute API para datos astronómicos.

**Endpoint:** `https://api.met.no/weatherapi/sunrise/3.0/moon`

### Parámetros

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|----------|------------|---------|
| `lat` | number | ✅ | Latitud | 40.7128 |
| `lon` | number | ✅ | Longitud | -74.0060 |
| `date` | string | ✅ | Fecha (YYYY-MM-DD) | 2025-01-05 |
| `offset` | string | ✅ | Offset UTC | +00:00, -05:00 |

### Respuesta

```json
{
  "copyright": "...",
  "licenseURL": "...",
  "geometry": {
    "type": "Point",
    "coordinates": [-74.0060, 40.7128]
  },
  "properties": {
    "body": "Moon",
    "moonrise": {
      "time": "2025-01-05T12:34:00Z"
    },
    "moonset": {
      "time": "2025-01-06T00:45:00Z"
    },
    "moonphase": 0.75,
    "low_moon": {
      "time": "2025-01-05T18:30:00Z"
    },
    "high_moon": {
      "time": "2025-01-06T06:15:00Z"
    }
  }
}
```

### Implementación

```javascript
const BASE_URL = 'https://api.met.no/weatherapi/sunrise/3.0/moon'

const formatOffset = (date) => {
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  const hours = String(Math.floor(abs / 60)).padStart(2, '0')
  const minutes = String(abs % 60).padStart(2, '0')
  
  return `${sign}${hours}:${minutes}`
}

export const fetchMoonData = async ({ latitude, longitude }) => {
  const today = new Date()
  
  const url = new URL(BASE_URL)
  url.searchParams.set('lat', latitude)
  url.searchParams.set('lon', longitude)
  url.searchParams.set('date', today.toISOString().slice(0, 10))
  url.searchParams.set('offset', formatOffset(today))
  
  const response = await fetch(url)
  if (!response.ok) throw new Error('Moon fetch failed')
  
  const payload = await response.json()
  const props = payload?.properties ?? {}
  
  return {
    moonrise: props?.moonrise?.time ?? null,
    moonset: props?.moonset?.time ?? null,
    moonphase: props?.moonphase ?? null,      // 0-1, 0=nueva, 0.5=llena
    lowMoon: props?.low_moon?.time ?? null,
    highMoon: props?.high_moon?.time ?? null,
    latitude,
    longitude
  }
}
```

### Interpretación de Moonphase

```javascript
const getMoonPhaseName = (phase) => {
  if (phase < 0.125) return 'Nueva'
  if (phase < 0.25) return 'Creciente'
  if (phase < 0.375) return 'Cuarto Creciente'
  if (phase < 0.5) return 'Gibosa Creciente'
  if (phase < 0.625) return 'Llena'
  if (phase < 0.75) return 'Gibosa Menguante'
  if (phase < 0.875) return 'Cuarto Menguante'
  return 'Creciente'
}
```

---

## Open-Meteo Marine

### Descripción

Proporciona datos oceanográficos de oleaje marino.

**URL:** `https://marine-api.open-meteo.com/v1/marine`

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|------------|
| `latitude` | number | ✅ | Latitud (-90 a 90) |
| `longitude` | number | ✅ | Longitud (-180 a 180) |
| `hourly` | string | ✅ | Variables: wave_height,wave_period,wind_wave_height,swell_wave_height |
| `timezone` | string | ✅ | Zona horaria (ej: "auto", "UTC") |
| `cell_selection` | string | Opcional | "nearest" para precisión |

### Variables Disponibles

| Variable | Descripción | Unidad |
|----------|------------|--------|
| `wave_height` | Altura total de ola | metros |
| `wave_period` | Periodo del oleaje | segundos |
| `wind_wave_height` | Altura de ola por viento | metros |
| `swell_wave_height` | Altura de la marejada | metros |

### Respuesta

```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "generationtime_ms": 15.23,
  "utc_offset_seconds": -18000,
  "timezone": "America/New_York",
  "hourly": {
    "time": [
      "2025-01-05T00:00",
      "2025-01-05T01:00",
      "2025-01-05T02:00"
    ],
    "wave_height": [1.5, 1.6, 1.7],
    "wave_period": [8.5, 8.6, 8.7],
    "wind_wave_height": [0.5, 0.6, 0.7],
    "swell_wave_height": [1.0, 1.0, 1.0]
  }
}
```

### Implementación con Reintentos

```javascript
const BASE_URL = 'https://marine-api.open-meteo.com/v1/marine'

export const fetchMarineWaves = async ({ latitude, longitude }) => {
  // Array de offsets para reintentos
  const offsets = [
    [0, 0],        // Ubicación exacta
    [0.5, 0],      // +0.5° latitud
    [-0.5, 0],     // -0.5° latitud
    [0, 0.5],      // +0.5° longitud
    [0, -0.5],     // -0.5° longitud
    [1, 0]         // +1° latitud
  ]
  
  for (const [latOffset, lonOffset] of offsets) {
    try {
      const url = new URL(BASE_URL)
      url.searchParams.set('latitude', latitude + latOffset)
      url.searchParams.set('longitude', longitude + lonOffset)
      url.searchParams.set(
        'hourly',
        'wave_height,wave_period,wind_wave_height,swell_wave_height'
      )
      url.searchParams.set('timezone', 'auto')
      url.searchParams.set('cell_selection', 'nearest')
      
      const response = await fetch(url)
      if (!response.ok) continue
      
      const payload = await response.json()
      const data = parseMarineData(payload)
      
      if (data && hasValidData(data)) {
        return data
      }
    } catch (err) {
      console.error('Marine fetch attempt failed:', err)
    }
  }
  
  throw new Error('Marine data unavailable')
}

const parseMarineData = (payload) => {
  const hourly = payload?.hourly ?? {}
  const index = getLatestIndex(hourly.wave_height)
  
  if (index < 0) return null
  
  return {
    time: hourly.time?.[index] ?? null,
    waveHeight: Number(hourly.wave_height?.[index]),
    wavePeriod: Number(hourly.wave_period?.[index]),
    windWaveHeight: Number(hourly.wind_wave_height?.[index]),
    swellWaveHeight: Number(hourly.swell_wave_height?.[index]),
    latitude: payload?.latitude,
    longitude: payload?.longitude
  }
}
```

---

## Open-Meteo Geocoding

### Descripción

Convierte nombres de ubicaciones a coordenadas geográficas.

**URL:** `https://geocoding-api.open-meteo.com/v1/search`

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|------------|
| `name` | string | ✅ | Nombre de ubicación |
| `count` | number | Opcional | Cantidad de resultados (máx 100) |
| `language` | string | Opcional | Código de idioma (ej: "es", "en") |
| `format` | string | Opcional | "json" |

### Respuesta

```json
{
  "results": [
    {
      "id": 5128581,
      "name": "New York",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "elevation": 10,
      "feature_code": "PPL",
      "country_code": "US",
      "country": "United States",
      "admin1": "New York",
      "admin2": "New York County",
      "admin3": "New York"
    }
  ]
}
```

### Implementación

```javascript
const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export const searchLocations = async (query) => {
  const trimmed = query?.trim()
  if (!trimmed) return []
  
  const url = new URL(GEO_BASE_URL)
  url.searchParams.set('name', trimmed)
  url.searchParams.set('count', '8')
  url.searchParams.set('language', 'es')
  url.searchParams.set('format', 'json')
  
  const response = await fetch(url)
  if (!response.ok) throw new Error('Geocoding fetch failed')
  
  const payload = await response.json()
  const results = payload?.results ?? []
  
  return results.map(item => ({
    id: `geo-${item.id}`,
    name: item.name,
    country: item.country,
    latitude: item.latitude,
    longitude: item.longitude,
    admin1: item.admin1,
    fullName: `${item.name}, ${item.admin1 ?? ''}, ${item.country}`.replace(/ ,/g, '')
  }))
}
```

### Con Debouncing

```javascript
import { useCallback, useState } from 'react'

function LocationSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [timeoutId, setTimeoutId] = useState(null)
  
  const handleSearch = useCallback((value) => {
    setQuery(value)
    
    // Limpiar timeout anterior
    if (timeoutId) clearTimeout(timeoutId)
    
    // Establecer nuevo timeout para 300ms después
    const newTimeoutId = setTimeout(async () => {
      if (!value.trim()) {
        setResults([])
        return
      }
      
      try {
        const data = await searchLocations(value)
        setResults(data)
      } catch (err) {
        console.error('Search failed:', err)
        setResults([])
      }
    }, 300)
    
    setTimeoutId(newTimeoutId)
  }, [timeoutId])
  
  return (
    <input
      type="text"
      placeholder="Buscar ubicación..."
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
```

---

## Patrones Comunes

### Patrón 1: Fetch con Manejo de Errores

```javascript
const safeFetch = async (url, errorMessage) => {
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`${errorMessage} (${response.status})`)
    }
    
    return await response.json()
  } catch (err) {
    console.error(errorMessage, err)
    throw err
  }
}
```

### Patrón 2: Normalización de Datos

```javascript
const normalizeApiResponse = (response, schema) => {
  return {
    ...schema,
    ...Object.entries(response).reduce((acc, [key, value]) => {
      if (key in schema) {
        acc[key] = value ?? schema[key]
      }
      return acc
    }, {})
  }
}
```

### Patrón 3: Cacheo con TTL

```javascript
const createCachedFetch = (ttl = 5 * 60 * 1000) => {
  const cache = new Map()
  
  return async (url, fetcher) => {
    const now = Date.now()
    
    if (cache.has(url)) {
      const { data, timestamp } = cache.get(url)
      if (now - timestamp < ttl) {
        return data
      }
    }
    
    const data = await fetcher()
    cache.set(url, { data, timestamp: now })
    
    return data
  }
}
```

### Patrón 4: Reintentos con Backoff

```javascript
const fetchWithRetry = async (
  url,
  maxRetries = 3,
  baseDelay = 1000
) => {
  let lastError
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url)
      if (response.ok) return await response.json()
    } catch (err) {
      lastError = err
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)  // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}
```

---

## Troubleshooting

### Problema: CORS Error

**Error:** `Access to XMLHttpRequest at 'https://...' has been blocked by CORS policy`

**Causa:** La API no permite requests desde el navegador

**Solución:**
1. Verificar que la API tenga CORS habilitado
2. Usar proxy si es necesario
3. Implementar backend proxy

```javascript
// Opción: Usar proxy
const PROXY = 'https://cors-anywhere.herokuapp.com/'
const response = await fetch(PROXY + API_URL)
```

### Problema: 429 Too Many Requests

**Error:** `HTTP 429 Too Many Requests`

**Causa:** Se superaron los límites de rate limit

**Solución:**
1. Implementar backoff exponencial
2. Cachear resultados
3. Reducir frecuencia de requests

```javascript
const fetchWithBackoff = async (url, maxAttempts = 5) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const delay = Math.pow(2, attempt) * 1000  // 1s, 2s, 4s, 8s, 16s
    
    try {
      const response = await fetch(url)
      if (response.status === 429) {
        await new Promise(r => setTimeout(r, delay))
        continue
      }
      return response
    } catch (err) {
      if (attempt === maxAttempts - 1) throw err
    }
  }
}
```

### Problema: Datos Inconsistentes

**Causa:** APIs retornan valores inválidos (-999, null, undefined)

**Solución:** Validar y normalizar siempre

```javascript
const normalizeValue = (value, min = -Infinity, max = Infinity) => {
  const num = Number(value)
  
  if (!Number.isFinite(num)) return null
  if (num < min || num > max) return null
  
  return num
}
```

### Problema: Timeouts Lentos

**Causa:** API lenta o saturada

**Solución:** Implementar timeouts

```javascript
const fetchWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ])
}
```

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0
