const KP_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
const KP_FORECAST_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json'
const PLASMA_URL = 'https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json'
const MAG_URL = 'https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json'
const ALERTS_URL = 'https://services.swpc.noaa.gov/products/alerts.json'

const getLatestNumericRow = (rows, minColumns) => {
  if (!Array.isArray(rows) || rows.length < 2) return null

  for (let i = rows.length - 1; i >= 1; i -= 1) {
    const row = rows[i]
    if (!Array.isArray(row) || row.length < minColumns) continue
    const numeric = row.slice(1).every((value) => Number.isFinite(Number(value)))
    if (numeric) return row
  }

  return null
}

const getLatestKp = (kpData) =>
  Array.isArray(kpData)
    ? [...kpData].reverse().find((entry) => Number.isFinite(Number(entry?.Kp)))
    : null

const getLatestAlert = (alerts) =>
  Array.isArray(alerts) && alerts.length > 0 ? alerts[0] : null

const extractAlertTitle = (message = '') => {
  const lines = message.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const alertLine = lines.find((line) => line.startsWith('ALERT:'))
  if (alertLine) return alertLine.replace('ALERT:', '').trim()
  return lines[0] ?? ''
}

const parseTime = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const filterByHours = (rows, hours) => {
  if (!Number.isFinite(hours) || hours <= 0) return rows
  const cutoff = Date.now() - hours * 60 * 60 * 1000
  return rows.filter((item) => item?.timestamp && item.timestamp >= cutoff)
}

const normalizeKpSeries = (kpData) => {
  if (!Array.isArray(kpData)) return []
  return kpData
    .filter((entry) => entry?.time_tag)
    .map((entry) => {
      const date = parseTime(entry.time_tag)
      return {
        time: entry.time_tag,
        timestamp: date ? date.getTime() : null,
        kp: Number(entry.Kp),
      }
    })
    .filter((entry) => Number.isFinite(entry.kp) && entry.timestamp)
}

const normalizePlasmaSeries = (rows) => {
  if (!Array.isArray(rows) || rows.length < 2) return []

  return rows
    .slice(1)
    .map((row) => {
      if (!Array.isArray(row) || row.length < 4) return null
      const date = parseTime(row[0])
      return {
        time: row[0],
        timestamp: date ? date.getTime() : null,
        density: Number(row[1]),
        speed: Number(row[2]),
      }
    })
    .filter((entry) => entry && entry.timestamp && Number.isFinite(entry.speed))
}

export const fetchNoaaTimeSeries = async ({ hours = 24 } = {}) => {
  const [kpResponse, plasmaResponse] = await Promise.all([
    fetch(KP_URL),
    fetch(PLASMA_URL),
  ])

  if (!kpResponse.ok || !plasmaResponse.ok) {
    throw new Error('NOAA series fetch failed')
  }

  const kpData = await kpResponse.json()
  const plasmaData = await plasmaResponse.json()

  const kpSeries = filterByHours(normalizeKpSeries(kpData), hours)
  const plasmaSeries = filterByHours(normalizePlasmaSeries(plasmaData), hours)

  const merged = new Map()
  kpSeries.forEach((entry) => {
    merged.set(entry.time, { time: entry.time, timestamp: entry.timestamp, kp: entry.kp })
  })

  plasmaSeries.forEach((entry) => {
    if (!merged.has(entry.time)) {
      merged.set(entry.time, { time: entry.time, timestamp: entry.timestamp })
    }
    const item = merged.get(entry.time)
    item.windSpeed = entry.speed
    item.windDensity = entry.density
  })

  return Array.from(merged.values()).sort((a, b) => a.timestamp - b.timestamp)
}

export const fetchNoaaSpaceWeather = async () => {
  const [kpResponse, plasmaResponse, magResponse] = await Promise.all([
    fetch(KP_URL),
    fetch(PLASMA_URL),
    fetch(MAG_URL),
  ])

  if (!kpResponse.ok || !plasmaResponse.ok || !magResponse.ok) {
    throw new Error('NOAA data fetch failed')
  }

  const kpData = await kpResponse.json()
  const plasmaData = await plasmaResponse.json()
  const magData = await magResponse.json()

  const latestKp = getLatestKp(kpData)
  const latestPlasma = getLatestNumericRow(plasmaData, 4)
  const latestMag = getLatestNumericRow(magData, 7)

  return {
    kpIndex: latestKp?.Kp ?? null,
    kpTime: latestKp?.time_tag ?? null,
    windDensity: latestPlasma ? Number(latestPlasma[1]) : null,
    windSpeed: latestPlasma ? Number(latestPlasma[2]) : null,
    windTemperature: latestPlasma ? Number(latestPlasma[3]) : null,
    windTime: latestPlasma ? latestPlasma[0] : null,
    bzGsm: latestMag ? Number(latestMag[3]) : null,
    bt: latestMag ? Number(latestMag[6]) : null,
    magTime: latestMag ? latestMag[0] : null,
  }
}

export const fetchNoaaKpForecast = async () => {
  const response = await fetch(KP_FORECAST_URL)
  if (!response.ok) {
    throw new Error('NOAA forecast fetch failed')
  }

  const forecastData = await response.json()
  const predicted = Array.isArray(forecastData)
    ? forecastData.filter((entry) => entry?.observed === 'predicted')
    : []

  const upcoming = predicted.slice(0, 4).map((entry) => ({
    time: entry?.time_tag ?? null,
    kp: entry?.kp ?? null,
  }))

  return upcoming
}

export const fetchNoaaAlerts = async () => {
  const response = await fetch(ALERTS_URL)
  if (!response.ok) {
    throw new Error('NOAA alerts fetch failed')
  }

  const alerts = await response.json()
  const latest = getLatestAlert(alerts)

  return {
    title: latest ? extractAlertTitle(latest.message) : null,
    issuedAt: latest?.issue_datetime ?? null,
    message: latest?.message ?? null,
  }
}
