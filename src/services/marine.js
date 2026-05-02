const BASE_URL = 'https://marine-api.open-meteo.com/v1/marine'

const toNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

const getLatestIndex = (values) => {
  if (!Array.isArray(values)) return -1

  for (let i = values.length - 1; i >= 0; i -= 1) {
    if (toNumber(values[i]) !== null) return i
  }

  return -1
}

const hasMeaningfulData = (data) => {
  if (!data) return false
  const metrics = [data.waveHeight, data.wavePeriod, data.windWaveHeight, data.swellWaveHeight]
  if (metrics.some((value) => Number.isFinite(value) && value > 0)) return true
  return metrics.some((value) => Number.isFinite(value)) && Boolean(data.time)
}

const fetchMarineWavesOnce = async ({ latitude, longitude }) => {
  const url = new URL(BASE_URL)
  url.searchParams.set('latitude', latitude)
  url.searchParams.set('longitude', longitude)
  url.searchParams.set('hourly', 'wave_height,wave_period,wind_wave_height,swell_wave_height')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('cell_selection', 'nearest')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Marine data fetch failed')
  }

  const payload = await response.json()
  const hourly = payload?.hourly ?? {}
  const index = getLatestIndex(hourly.wave_height)

  return {
    time: index >= 0 ? hourly.time?.[index] ?? null : null,
    waveHeight: index >= 0 ? toNumber(hourly.wave_height?.[index]) : null,
    wavePeriod: index >= 0 ? toNumber(hourly.wave_period?.[index]) : null,
    windWaveHeight: index >= 0 ? toNumber(hourly.wind_wave_height?.[index]) : null,
    swellWaveHeight: index >= 0 ? toNumber(hourly.swell_wave_height?.[index]) : null,
    latitude,
    longitude,
  }
}

export const fetchMarineWaves = async ({ latitude = 19.17, longitude = -96.1 } = {}) => {
  const offsets = [
    [0, 0],
    [0.5, 0],
    [-0.5, 0],
    [0, 0.5],
    [0, -0.5],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]

  let fallback = null

  for (const [dLat, dLon] of offsets) {
    const data = await fetchMarineWavesOnce({
      latitude: latitude + dLat,
      longitude: longitude + dLon,
    })

    if (!fallback) fallback = data
    if (hasMeaningfulData(data)) return data
  }

  return fallback
}
