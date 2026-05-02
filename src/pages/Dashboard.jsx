import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import SolarTrendCard from '../components/common/SolarTrendCard'
import GlobalFiltersBar from '../components/common/GlobalFiltersBar'
import InfoTooltip from '../components/common/InfoTooltip'
import ThresholdAlertCard from '../components/common/ThresholdAlertCard'
import ActivityPanel from '../components/common/ActivityPanel'
import ExportButton from '../components/common/ExportButton'
import SurfaceWeatherCard from '../components/common/SurfaceWeatherCard'
import AirQualityCard from '../components/common/AirQualityCard'
import SatelliteSnapshotCard from '../components/common/SatelliteSnapshotCard'
import { fetchNoaaKpForecast, fetchNoaaSpaceWeather, fetchNoaaTimeSeries } from '../services/noaa'
import { fetchIssPosition } from '../services/iss'
import { fetchNasaIrradiance } from '../services/nasaPower'
import { fetchSurfaceWeather } from '../services/weather'
import { fetchAirQuality } from '../services/airQuality'
import { buildLocationLabel } from '../data/locations'
import { useFilters } from '../contexts/FiltersContext'

const clampPercent = (value, max) => {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0
  return Math.min(1, Math.max(0, value / max))
}

const RANGE_TO_HOURS = {
  '6h': 6,
  '24h': 24,
  '48h': 48,
  '7d': 168,
}

const Dashboard = () => {
  const { timeRange, sources, locations, primaryLocationId } = useFilters()
  const primaryLocation = useMemo(
    () => locations.find((location) => location.id === primaryLocationId) || locations[0],
    [locations, primaryLocationId]
  )

  const [kpStatus, setKpStatus] = useState(null)
  const [kpError, setKpError] = useState(null)
  const [kpLoading, setKpLoading] = useState(true)

  const [forecast, setForecast] = useState([])
  const [forecastError, setForecastError] = useState(null)
  const [forecastLoading, setForecastLoading] = useState(true)

  const [trendSeries, setTrendSeries] = useState([])
  const [trendError, setTrendError] = useState(null)
  const [trendLoading, setTrendLoading] = useState(true)

  const [irradiance, setIrradiance] = useState(null)
  const [irradianceError, setIrradianceError] = useState(null)

  const [surfaceWeather, setSurfaceWeather] = useState(null)
  const [surfaceWeatherError, setSurfaceWeatherError] = useState(null)
  const [surfaceWeatherLoading, setSurfaceWeatherLoading] = useState(true)

  const [airQuality, setAirQuality] = useState(null)
  const [airQualityError, setAirQualityError] = useState(null)
  const [airQualityLoading, setAirQualityLoading] = useState(true)

  const [iss, setIss] = useState(null)
  const [issError, setIssError] = useState(null)
  const [issLoading, setIssLoading] = useState(true)

  const [activity, setActivity] = useState([])

  const pushActivity = useCallback((message, detail) => {
    setActivity((prev) => {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        message,
        detail,
        time: new Date().toLocaleTimeString(),
      }
      return [entry, ...prev].slice(0, 6)
    })
  }, [])

  useEffect(() => {
    let isMounted = true

    if (!sources.noaa) {
      setKpLoading(false)
      return () => {
        isMounted = false
      }
    }

    const load = async () => {
      try {
        const data = await fetchNoaaSpaceWeather()
        if (isMounted) {
          setKpStatus(data)
          setKpError(null)
          pushActivity('NOAA SWPC actualizado', 'Clima espacial sincronizado.')
        }
      } catch (err) {
        if (isMounted) {
          setKpError('No disponible')
          pushActivity('NOAA SWPC con error', 'No se pudo actualizar el estado.')
        }
      } finally {
        if (isMounted) {
          setKpLoading(false)
        }
      }
    }

    load()
    const interval = setInterval(load, 60000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [sources.noaa, pushActivity])

  useEffect(() => {
    let isMounted = true

    if (!sources.noaa) {
      setForecastLoading(false)
      return () => {
        isMounted = false
      }
    }

    const load = async () => {
      try {
        const data = await fetchNoaaKpForecast()
        if (isMounted) {
          setForecast(data)
          setForecastError(null)
          pushActivity('Pronostico NOAA actualizado', 'Kp forecast sincronizado.')
        }
      } catch (err) {
        if (isMounted) {
          setForecastError('No disponible')
          pushActivity('Pronostico NOAA con error', 'No se pudo actualizar el pronostico.')
        }
      } finally {
        if (isMounted) {
          setForecastLoading(false)
        }
      }
    }

    load()
    const interval = setInterval(load, 300000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [sources.noaa, pushActivity])

  useEffect(() => {
    let isMounted = true

    if (!sources.noaa) {
      setTrendLoading(false)
      return () => {
        isMounted = false
      }
    }

    const load = async () => {
      try {
        const hours = RANGE_TO_HOURS[timeRange] || 24
        const data = await fetchNoaaTimeSeries({ hours })
        if (isMounted) {
          setTrendSeries(data)
          setTrendError(null)
          pushActivity('Series NOAA actualizadas', `Rango ${timeRange.toUpperCase()}.`)
        }
      } catch (err) {
        if (isMounted) {
          setTrendError('No disponible')
          pushActivity('Series NOAA con error', 'No se pudo cargar series.')
        }
      } finally {
        if (isMounted) {
          setTrendLoading(false)
        }
      }
    }

    load()
    const interval = setInterval(load, 300000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [timeRange, pushActivity, sources.noaa])

  useEffect(() => {
    let isMounted = true

    if (!sources.nasa) {
      setIrradiance(null)
      setIrradianceError(null)
      return () => {
        isMounted = false
      }
    }

    const load = async () => {
      try {
        const payload = await fetchNasaIrradiance({
          latitude: primaryLocation?.latitude,
          longitude: primaryLocation?.longitude,
        })
        if (isMounted) {
          const lastPoint = payload.points[payload.points.length - 1]
          setIrradiance(lastPoint?.value ?? null)
          setIrradianceError(null)
        }
      } catch (err) {
        if (isMounted) {
          setIrradianceError('No disponible')
        }
      }
    }

    load()
    const interval = setInterval(load, 300000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [primaryLocation, sources.nasa])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchSurfaceWeather({
          latitude: primaryLocation?.latitude,
          longitude: primaryLocation?.longitude,
        })
        if (isMounted) {
          setSurfaceWeather(data)
          setSurfaceWeatherError(null)
        }
      } catch (err) {
        if (isMounted) {
          setSurfaceWeatherError('No disponible')
        }
      } finally {
        if (isMounted) {
          setSurfaceWeatherLoading(false)
        }
      }
    }

    load()
    const interval = setInterval(load, 600000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [primaryLocation])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchAirQuality({
          latitude: primaryLocation?.latitude,
          longitude: primaryLocation?.longitude,
        })
        if (isMounted) {
          setAirQuality(data)
          setAirQualityError(null)
        }
      } catch (err) {
        if (isMounted) {
          setAirQualityError('No disponible')
        }
      } finally {
        if (isMounted) {
          setAirQualityLoading(false)
        }
      }
    }

    load()
    const interval = setInterval(load, 600000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [primaryLocation])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchIssPosition()
        if (isMounted) {
          setIss(data)
          setIssError(null)
          pushActivity('ISS sincronizada', 'Telemetria orbital actualizada.')
        }
      } catch (err) {
        if (isMounted) {
          setIssError('No disponible')
          pushActivity('ISS con error', 'No se pudo obtener telemetria.')
        }
      } finally {
        if (isMounted) {
          setIssLoading(false)
        }
      }
    }

    load()
    const interval = setInterval(load, 10000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [pushActivity])

  const kpValue = kpStatus?.kpIndex
  const kpPercent = clampPercent(kpValue, 9)
  const kpGaugeOffset = useMemo(() => 502 - 502 * kpPercent, [kpPercent])
  const kpStatusLabel = Number.isFinite(kpValue) ? (kpValue >= 5 ? 'STORM' : 'CALM') : '--'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <GlobalFiltersBar />

      <header className="mb-xl flex flex-col gap-sm">
        <h2 className="text-h2 font-h2 text-on-surface">Environmental Metrics</h2>
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Aggregate data for Station: NORTH-ALPHA-7
        </p>
      </header>

      <div className="grid grid-cols-12 gap-bento-gap">
        {sources.nasa ? (
          <div className="col-span-12 lg:col-span-8">
            <SolarTrendCard
              title="Solar Irradiance Trend"
              subtitle="NASA POWER"
              latitude={primaryLocation?.latitude}
              longitude={primaryLocation?.longitude}
              locationLabel={buildLocationLabel(primaryLocation)}
            />
          </div>
        ) : null}

        {sources.noaa ? (
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <div className="glass-card flex flex-col items-center justify-center rounded-xl p-lg text-center">
              <div className="mb-md flex w-full items-center gap-sm text-left">
                <span className="material-symbols-outlined text-tertiary">tsunami</span>
                <InfoTooltip
                  label="Geomagnetic Kp"
                  description="Indice geomagnetico global basado en NOAA SWPC."
                  unit="Kp"
                />
              </div>

              {kpLoading ? (
                <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
              ) : kpError ? (
                <p className="text-body-sm font-body-sm text-error">{kpError}</p>
              ) : (
                <div className="relative flex h-48 w-48 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      className="text-slate-800"
                      cx="96"
                      cy="96"
                      r="80"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                    ></circle>
                    <circle
                      className="text-primary"
                      cx="96"
                      cy="96"
                      r="80"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="502"
                      strokeDashoffset={kpGaugeOffset}
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-h1 font-display text-on-surface">
                      {Number.isFinite(kpValue) ? kpValue : '--'}
                    </span>
                    <span className="text-label font-label text-on-surface-variant">{kpStatusLabel}</span>
                  </div>
                </div>
              )}

              <div className="mt-lg grid w-full grid-cols-2 gap-sm">
                <div className="rounded bg-white/5 p-sm text-left">
                  <div className="text-[10px] uppercase text-on-surface-variant">Wind</div>
                  <div className="text-sm font-mono-data">
                    {Number.isFinite(kpStatus?.windSpeed) ? `${kpStatus.windSpeed} km/s` : '--'}
                  </div>
                </div>
                <div className="rounded bg-white/5 p-sm text-left">
                  <div className="text-[10px] uppercase text-on-surface-variant">Bz (GSM)</div>
                  <div className="text-sm font-mono-data">
                    {Number.isFinite(kpStatus?.bzGsm) ? `${kpStatus.bzGsm} nT` : '--'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <SurfaceWeatherCard
            data={surfaceWeather}
            loading={surfaceWeatherLoading}
            error={surfaceWeatherError}
            locationLabel={buildLocationLabel(primaryLocation)}
          />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <AirQualityCard
            data={airQuality}
            loading={airQualityLoading}
            error={airQualityError}
            locationLabel={buildLocationLabel(primaryLocation)}
          />
        </div>

        {sources.noaa ? (
          <div className="col-span-12 lg:col-span-8">
            <div className="glass-card flex min-h-[360px] flex-col rounded-xl p-lg">
              <div className="mb-lg flex items-center justify-between">
                <div>
                  <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
                    NOAA SWPC
                  </p>
                  <h3 className="text-h3 font-h3 text-on-surface">Tendencias solares</h3>
                </div>
                <div className="flex items-center gap-3">
                  <ExportButton data={trendSeries} fileName="noaa-trends.json" />
                  <span className="text-xs uppercase tracking-tight text-primary">
                    {timeRange.toUpperCase()}
                  </span>
                </div>
              </div>

              {trendLoading ? (
                <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
              ) : trendError ? (
                <p className="text-body-sm font-body-sm text-error">{trendError}</p>
              ) : (
                <div className="flex-grow">
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendSeries}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" />
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                        <YAxis stroke="rgba(255,255,255,0.4)" />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#dde4e5',
                          }}
                        />
                        <Line type="monotone" dataKey="kp" stroke="#8aebff" strokeWidth={2} dot={false} />
                        <Line
                          type="monotone"
                          dataKey="windSpeed"
                          stroke="#4edea3"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="windDensity"
                          stroke="#ffd6a7"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {sources.noaa ? (
          <div className="col-span-12 lg:col-span-8">
            <div className="glass-card overflow-hidden rounded-xl">
              <div className="flex items-center justify-between border-b border-white/10 p-md">
                <span className="text-label font-label uppercase tracking-widest text-on-surface-variant">
                  NOAA Kp Forecast
                </span>
                <div className="flex items-center gap-3">
                  <ExportButton data={forecast} fileName="noaa-forecast.json" />
                  <span className="text-xs uppercase tracking-tight text-primary">Next 24h</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                {forecastLoading ? (
                  <p className="p-md text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
                ) : forecastError ? (
                  <p className="p-md text-body-sm font-body-sm text-error">{forecastError}</p>
                ) : forecast.length === 0 ? (
                  <p className="p-md text-body-sm font-body-sm text-on-surface-variant">
                    Sin datos de pronostico.
                  </p>
                ) : (
                  <table className="w-full text-left text-sm font-mono-data">
                    <thead className="sticky top-0 bg-slate-800/40">
                      <tr>
                        <th className="p-md text-[10px] uppercase tracking-widest text-on-surface-variant">
                          Timestamp
                        </th>
                        <th className="p-md text-[10px] uppercase tracking-widest text-on-surface-variant">
                          Source
                        </th>
                        <th className="p-md text-[10px] uppercase tracking-widest text-on-surface-variant">
                          Metric
                        </th>
                        <th className="p-md text-[10px] uppercase tracking-widest text-on-surface-variant">
                          Kp
                        </th>
                        <th className="p-md text-[10px] uppercase tracking-widest text-on-surface-variant">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {forecast.map((entry, index) => {
                        const status = entry.kp >= 5 ? 'CRITICAL' : 'MONITORING'
                        const badgeClass =
                          entry.kp >= 5
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-surface-container-highest text-on-surface-variant'

                        return (
                          <tr key={entry.time ?? `kp-${index}`} className="transition-colors hover:bg-white/5">
                            <td className="p-md">{entry.time ?? '--'}</td>
                            <td className="p-md">NOAA SWPC</td>
                            <td className="p-md">Geomagnetic Index</td>
                            <td className="p-md text-secondary">{entry.kp ?? '--'}</td>
                            <td className="p-md">
                              <span className={`rounded px-2 py-0.5 text-[10px] ${badgeClass}`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <ThresholdAlertCard
            current={{
              kp: kpValue,
              irradiance: irradianceError ? null : irradiance,
            }}
          />
        </div>

        <div className="col-span-12 lg:col-span-8">
          <SatelliteSnapshotCard />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <ActivityPanel events={activity} />
        </div>

        <div className="col-span-12">
          <div className="glass-card group relative h-64 overflow-hidden rounded-xl p-lg">
            <img
              className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen transition-transform duration-[2000ms] group-hover:scale-105"
              alt="Satellite view of Earth's atmosphere with telemetry overlay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs4V-ag4nYEaf4x3nTYNuIz6rNXenI2fkLrL64Wh1V5X3IJ9m6_AxxiILzk8S60_5YLlR_lFtSn5e32dSePXiok5AxZfXCh5cqHK2rR2GkFYeRJLQ2pidua9XZFYu1pspuTw7vehxuki3HiWrPm9ge1BfL8yIuddDq4xjx9dtQ2kGK47stx7BqBsRMfDxVGdrdi6h33XwWJsaMKQUef80ikgxWLPENObW2Lq0znLav7O3j83qm_K12qH0dhOMimnM6yLf4mBilDSzg"
            />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <h3 className="text-h3 font-h3 text-on-surface">ISS Orbital Telemetry</h3>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  Live orbital coordinates synchronized with ground station data.
                </p>
              </div>
              {issLoading ? (
                <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
              ) : issError ? (
                <p className="text-body-sm font-body-sm text-error">{issError}</p>
              ) : (
                <div className="flex flex-wrap gap-lg">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary text-sm">satellite_alt</span>
                    <span className="text-xs font-mono-data uppercase text-on-surface">
                      Lat {iss?.latitude?.toFixed(2) ?? '--'} • Lon {iss?.longitude?.toFixed(2) ?? '--'}
                    </span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary text-sm">speed</span>
                    <span className="text-xs font-mono-data uppercase text-on-surface">
                      Vel {iss?.velocity ? `${iss.velocity.toFixed(1)} km/h` : '--'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard
