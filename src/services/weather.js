const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

const toNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

export const fetchSurfaceWeather = async ({ latitude = 0, longitude = 0 } = {}) => {
  const url = new URL(BASE_URL)
  url.searchParams.set('latitude', latitude)
  url.searchParams.set('longitude', longitude)
  url.searchParams.set('current', 'temperature_2m,wind_speed_10m,precipitation,cloud_cover')
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Surface weather fetch failed')
  }

  const payload = await response.json()
  const current = payload?.current ?? {}

  return {
    time: current.time ?? null,
    temperature: toNumber(current.temperature_2m),
    windSpeed: toNumber(current.wind_speed_10m),
    precipitation: toNumber(current.precipitation),
    cloudCover: toNumber(current.cloud_cover),
    latitude,
    longitude,
  }
}
