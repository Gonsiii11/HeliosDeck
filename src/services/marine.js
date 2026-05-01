const BASE_URL = 'https://marine-api.open-meteo.com/v1/marine'

const getLatestIndex = (values) => {
  if (!Array.isArray(values)) return -1

  for (let i = values.length - 1; i >= 0; i -= 1) {
    if (Number.isFinite(values[i])) return i
  }

  return -1
}

export const fetchMarineWaves = async ({ latitude = 19.17, longitude = -96.1 } = {}) => {
  const url = new URL(BASE_URL)
  url.searchParams.set('latitude', latitude)
  url.searchParams.set('longitude', longitude)
  url.searchParams.set('hourly', 'wave_height,wave_period,wind_wave_height,swell_wave_height')
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Marine data fetch failed')
  }

  const payload = await response.json()
  const hourly = payload?.hourly ?? {}
  const index = getLatestIndex(hourly.wave_height)

  return {
    time: index >= 0 ? hourly.time?.[index] ?? null : null,
    waveHeight: index >= 0 ? hourly.wave_height?.[index] ?? null : null,
    wavePeriod: index >= 0 ? hourly.wave_period?.[index] ?? null : null,
    windWaveHeight: index >= 0 ? hourly.wind_wave_height?.[index] ?? null : null,
    swellWaveHeight: index >= 0 ? hourly.swell_wave_height?.[index] ?? null : null,
    latitude,
    longitude,
  }
}
