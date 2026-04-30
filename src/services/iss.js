const ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544'

export const fetchIssPosition = async () => {
  const response = await fetch(ISS_URL)
  if (!response.ok) {
    throw new Error('ISS data fetch failed')
  }

  const payload = await response.json()

  return {
    latitude: payload?.latitude ?? null,
    longitude: payload?.longitude ?? null,
    altitude: payload?.altitude ?? null,
    velocity: payload?.velocity ?? null,
    visibility: payload?.visibility ?? null,
    timestamp: payload?.timestamp ?? null,
  }
}
