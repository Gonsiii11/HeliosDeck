const BASE_URL = 'https://power.larc.nasa.gov/api/temporal/hourly/point'
const PARAM = 'ALLSKY_SFC_SW_DWN'

const formatDate = (date) => date.toISOString().slice(0, 10).replace(/-/g, '')

const getLastCompleteUtcDayRange = (daysBack = 1) => {
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  end.setUTCDate(end.getUTCDate() - daysBack)

  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 1)

  return { start, end }
}

const buildPoints = (series) =>
  Object.entries(series)
    .map(([key, value]) => ({
      key,
      time: `${key.slice(8, 10)}:00`,
      value: Number(value),
    }))
    .filter((entry) => Number.isFinite(entry.value) && entry.value > -900)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(({ time, value }) => ({ time, value }))

export const fetchNasaIrradiance = async ({ latitude = 0, longitude = 0 } = {}) => {
  const maxAttempts = 5

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { start, end } = getLastCompleteUtcDayRange(1 + attempt * 365)

    const url = new URL(BASE_URL)
    url.searchParams.set('parameters', PARAM)
    url.searchParams.set('community', 'RE')
    url.searchParams.set('longitude', longitude)
    url.searchParams.set('latitude', latitude)
    url.searchParams.set('start', formatDate(start))
    url.searchParams.set('end', formatDate(end))
    url.searchParams.set('format', 'JSON')

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error('NASA POWER data fetch failed')
    }

    const payload = await response.json()
    const series = payload?.properties?.parameter?.[PARAM] || {}
    const points = buildPoints(series)

    if (points.length > 0) {
      return { points, latitude, longitude }
    }
  }

  return { points: [], latitude, longitude }
}
