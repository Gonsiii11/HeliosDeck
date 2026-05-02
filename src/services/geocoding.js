const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search'

const normalizeText = (value) => value?.trim() || ''

export const searchLocations = async (query) => {
  const trimmed = normalizeText(query)
  if (!trimmed) return []

  const url = new URL(GEO_BASE_URL)
  url.searchParams.set('name', trimmed)
  url.searchParams.set('count', '8')
  url.searchParams.set('language', 'es')
  url.searchParams.set('format', 'json')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Geocoding fetch failed')
  }

  const payload = await response.json()
  const results = payload?.results ?? []

  return results.map((item) => ({
    id: `geo-${item.id}`,
    name: item.name,
    country: item.country,
    latitude: item.latitude,
    longitude: item.longitude,
    admin1: item.admin1,
  }))
}
