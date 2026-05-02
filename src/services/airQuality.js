const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const CACHE_PREFIX = 'gca-air-quality'

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

const getCacheKey = ({ latitude, longitude }) =>
  `${CACHE_PREFIX}:${Number(latitude).toFixed(2)}:${Number(longitude).toFixed(2)}`

const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const writeCache = (key, payload) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // ignore cache write failures
  }
}

const buildResult = ({ current, hourly, latitude, longitude }) => {
  const currentValues = current || {}
  const currentTime = currentValues.time ?? null
  const currentPm25 = toNumber(currentValues.pm2_5)
  const currentPm10 = toNumber(currentValues.pm10)
  const currentNo2 = toNumber(currentValues.no2)
  const currentAqi = toNumber(currentValues.us_aqi)
  const currentEuropeanAqi = toNumber(currentValues.european_aqi)

  const hasCurrent =
    currentTime &&
    [currentPm25, currentPm10, currentNo2, currentAqi, currentEuropeanAqi].some(
      (value) => Number.isFinite(value)
    )

  if (hasCurrent) {
    return {
      time: currentTime,
      pm10: currentPm10,
      pm25: currentPm25,
      no2: currentNo2,
      aqi: currentAqi,
      europeanAqi: currentEuropeanAqi,
      latitude,
      longitude,
    }
  }

  const index = getLatestIndex(hourly.pm2_5 || hourly.pm10 || hourly.us_aqi || hourly.european_aqi)

  return {
    time: index >= 0 ? hourly.time?.[index] ?? null : null,
    pm10: index >= 0 ? toNumber(hourly.pm10?.[index]) : null,
    pm25: index >= 0 ? toNumber(hourly.pm2_5?.[index]) : null,
    no2: index >= 0 ? toNumber(hourly.no2?.[index]) : null,
    aqi: index >= 0 ? toNumber(hourly.us_aqi?.[index]) : null,
    europeanAqi: index >= 0 ? toNumber(hourly.european_aqi?.[index]) : null,
    latitude,
    longitude,
  }
}

const requestAirQuality = async ({ latitude, longitude, hourly, current, models }) => {
  const url = new URL(BASE_URL)
  url.searchParams.set('latitude', latitude)
  url.searchParams.set('longitude', longitude)
  if (models) {
    url.searchParams.set('models', models)
  }
  if (current) {
    url.searchParams.set('current', current)
  }
  url.searchParams.set('hourly', hourly)
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Air quality fetch failed')
  }

  const payload = await response.json()
  return {
    hourly: payload?.hourly ?? {},
    current: payload?.current ?? null,
  }
}

export const fetchAirQuality = async ({ latitude = 0, longitude = 0 } = {}) => {
  const cacheKey = getCacheKey({ latitude, longitude })
  const cached = readCache(cacheKey)

  const baseHourly = 'pm10,pm2_5,no2,us_aqi,european_aqi'
  const baseCurrent = 'pm10,pm2_5,no2,us_aqi,european_aqi'

  try {
    const payload = await requestAirQuality({
      latitude,
      longitude,
      hourly: baseHourly,
      current: baseCurrent,
      models: 'cams_europe',
    })

    const result = buildResult({ ...payload, latitude, longitude })
    if (result.time) {
      writeCache(cacheKey, result)
      return result
    }
  } catch {
    // fall through to retry
  }

  try {
    const payload = await requestAirQuality({
      latitude,
      longitude,
      hourly: baseHourly,
      current: baseCurrent,
      models: 'cams_global',
    })

    const result = buildResult({ ...payload, latitude, longitude })
    if (result.time) {
      writeCache(cacheKey, result)
      return result
    }
  } catch {
    // fall through to cache
  }

  if (cached) return cached
  throw new Error('Air quality fetch failed')
}
