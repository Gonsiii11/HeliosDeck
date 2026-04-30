const KP_URL = 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'
const WIND_URL = 'https://services.swpc.noaa.gov/json/solar-wind.json'

export const fetchNoaaSpaceWeather = async () => {
  const [kpResponse, windResponse] = await Promise.all([
    fetch(KP_URL),
    fetch(WIND_URL),
  ])

  if (!kpResponse.ok || !windResponse.ok) {
    throw new Error('NOAA data fetch failed')
  }

  const kpData = await kpResponse.json()
  const windData = await windResponse.json()

  const latestKp = kpData?.[kpData.length - 1]
  const latestWind = windData?.[windData.length - 1]

  return {
    kpIndex: latestKp?.kp_index ?? null,
    kpTime: latestKp?.time_tag ?? null,
    windSpeed: latestWind?.speed ?? null,
    windDensity: latestWind?.density ?? null,
    windTime: latestWind?.time_tag ?? null,
  }
}
