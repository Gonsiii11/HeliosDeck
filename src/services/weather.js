const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

const toNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

export const fetchSurfaceWeather = async ({ latitude = 0, longitude = 0 } = {}) => {
  const url = new URL(BASE_URL)
  url.searchParams.set('latitude', latitude)
  url.searchParams.set('longitude', longitude)
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,visibility,uv_index,cloud_cover,is_day')
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Surface weather fetch failed')
  }

  const payload = await response.json()
  const current = payload?.current ?? {}

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Neblina',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna densa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia fuerte',
      71: 'Nieve ligera',
      73: 'Nieve moderada',
      75: 'Nieve fuerte',
      77: 'Granos de nieve',
      80: 'Lluvias dispersas ligeras',
      81: 'Lluvias dispersas moderadas',
      82: 'Lluvias dispersas violentas',
      85: 'Nieve dispersa ligera',
      86: 'Nieve dispersa fuerte',
      95: 'Tormenta',
      96: 'Tormenta con granizo ligero',
      99: 'Tormenta con granizo fuerte'
    }
    return weatherCodes[code] || 'Desconocido'
  }

  return {
    time: current.time ?? null,
    temperature: toNumber(current.temperature_2m),
    feelsLike: toNumber(current.apparent_temperature),
    humidity: toNumber(current.relative_humidity_2m),
    windSpeed: toNumber(current.wind_speed_10m),
    windDirection: toNumber(current.wind_direction_10m),
    windGusts: toNumber(current.wind_gusts_10m),
    precipitation: toNumber(current.precipitation),
    cloudCover: toNumber(current.cloud_cover),
    pressure: toNumber(current.pressure_msl),
    visibility: toNumber(current.visibility),
    uvIndex: toNumber(current.uv_index),
    weatherCode: current.weather_code,
    weather: getWeatherDescription(current.weather_code),
    isDay: current.is_day === 1,
    latitude,
    longitude,
  }
}
