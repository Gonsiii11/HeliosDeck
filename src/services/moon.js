const BASE_URL = 'https://api.met.no/weatherapi/sunrise/3.0/moon'

const formatDate = (date) => date.toISOString().slice(0, 10)

const formatOffset = (date) => {
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  const hours = String(Math.floor(abs / 60)).padStart(2, '0')
  const minutes = String(abs % 60).padStart(2, '0')

  return `${sign}${hours}:${minutes}`
}

export const fetchMoonData = async ({ latitude = 19.43, longitude = -99.13 } = {}) => {
  const today = new Date()

  const url = new URL(BASE_URL)
  url.searchParams.set('lat', latitude)
  url.searchParams.set('lon', longitude)
  url.searchParams.set('date', formatDate(today))
  url.searchParams.set('offset', formatOffset(today))

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Moon data fetch failed')
  }

  const payload = await response.json()
  const props = payload?.properties ?? {}

  return {
    moonrise: props?.moonrise?.time ?? null,
    moonset: props?.moonset?.time ?? null,
    moonphase: props?.moonphase ?? null,
    lowMoon: props?.low_moon?.time ?? null,
    latitude,
    longitude,
  }
}
