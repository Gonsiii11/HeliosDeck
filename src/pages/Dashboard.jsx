import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SolarTrendCard from '../components/common/SolarTrendCard'
import { fetchNoaaKpForecast, fetchNoaaSpaceWeather } from '../services/noaa'
import { fetchMarineWaves } from '../services/marine'
import { fetchIssPosition } from '../services/iss'

const clampPercent = (value, max) => {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0
  return Math.min(1, Math.max(0, value / max))
}

const Dashboard = () => {
  const [kpStatus, setKpStatus] = useState(null)
  const [kpError, setKpError] = useState(null)
  const [kpLoading, setKpLoading] = useState(true)

  const [forecast, setForecast] = useState([])
  const [forecastError, setForecastError] = useState(null)
  const [forecastLoading, setForecastLoading] = useState(true)

  const [marine, setMarine] = useState(null)
  const [marineError, setMarineError] = useState(null)
  const [marineLoading, setMarineLoading] = useState(true)

  const [iss, setIss] = useState(null)
  const [issError, setIssError] = useState(null)
  const [issLoading, setIssLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchNoaaSpaceWeather()
        if (isMounted) {
          setKpStatus(data)
          setKpError(null)
        }
      } catch (err) {
        if (isMounted) {
          setKpError('No disponible')
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
  }, [])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchNoaaKpForecast()
        if (isMounted) {
          setForecast(data)
          setForecastError(null)
        }
      } catch (err) {
        if (isMounted) {
          setForecastError('No disponible')
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
  }, [])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchMarineWaves()
        if (isMounted) {
          setMarine(data)
          setMarineError(null)
        }
      } catch (err) {
        if (isMounted) {
          setMarineError('No disponible')
        }
      } finally {
        if (isMounted) {
          setMarineLoading(false)
        }
      }
    }

    load()
    const interval = setInterval(load, 900000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchIssPosition()
        if (isMounted) {
          setIss(data)
          setIssError(null)
        }
      } catch (err) {
        if (isMounted) {
          setIssError('No disponible')
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
  }, [])

  const kpValue = kpStatus?.kpIndex
  const kpPercent = clampPercent(kpValue, 9)
  const kpGaugeOffset = useMemo(() => 502 - 502 * kpPercent, [kpPercent])
  const kpStatusLabel = Number.isFinite(kpValue) ? (kpValue >= 5 ? 'STORM' : 'CALM') : '--'

  const waveHeight = marine?.waveHeight
  const wavePercent = clampPercent(waveHeight, 6)
  const waveGaugeOffset = useMemo(() => 502 - 502 * wavePercent, [wavePercent])
  const waveStatusLabel = Number.isFinite(waveHeight)
    ? waveHeight >= 2.5
      ? 'ROUGH'
      : 'STABLE'
    : '--'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <header className="mb-xl flex flex-col gap-sm">
        <h2 className="text-h2 font-h2 text-on-surface">Environmental Metrics</h2>
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Aggregate data for Station: NORTH-ALPHA-7
        </p>
      </header>

      <div className="grid grid-cols-12 gap-bento-gap">
        <div className="col-span-12 lg:col-span-8">
          <SolarTrendCard title="Solar Irradiance Trend" subtitle="NASA POWER" />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="glass-card flex flex-col items-center justify-center rounded-xl p-lg text-center">
            <div className="mb-md flex w-full items-center gap-sm text-left">
              <span className="material-symbols-outlined text-tertiary">tsunami</span>
              <span className="text-label font-label uppercase tracking-widest text-on-surface-variant">
                Geomagnetic Kp
              </span>
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

        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="glass-card flex flex-col items-center justify-center rounded-xl p-lg text-center">
            <div className="mb-md flex w-full items-center gap-sm text-left">
              <span className="material-symbols-outlined text-secondary">water_drop</span>
              <span className="text-label font-label uppercase tracking-widest text-on-surface-variant">
                Wave Height
              </span>
            </div>

            {marineLoading ? (
              <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
            ) : marineError ? (
              <p className="text-body-sm font-body-sm text-error">{marineError}</p>
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
                    className="text-secondary"
                    cx="96"
                    cy="96"
                    r="80"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="502"
                    strokeDashoffset={waveGaugeOffset}
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-h1 font-display text-on-surface">
                    {Number.isFinite(waveHeight) ? waveHeight.toFixed(1) : '--'}
                  </span>
                  <span className="text-label font-label text-on-surface-variant">{waveStatusLabel}</span>
                </div>
              </div>
            )}

            <div className="mt-lg grid w-full grid-cols-2 gap-sm">
              <div className="rounded bg-white/5 p-sm text-left">
                <div className="text-[10px] uppercase text-on-surface-variant">Period</div>
                <div className="text-sm font-mono-data">
                  {Number.isFinite(marine?.wavePeriod) ? `${marine.wavePeriod} s` : '--'}
                </div>
              </div>
              <div className="rounded bg-white/5 p-sm text-left">
                <div className="text-[10px] uppercase text-on-surface-variant">Swell</div>
                <div className="text-sm font-mono-data">
                  {Number.isFinite(marine?.swellWaveHeight)
                    ? `${marine.swellWaveHeight} m`
                    : '--'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="glass-card overflow-hidden rounded-xl">
            <div className="flex items-center justify-between border-b border-white/10 p-md">
              <span className="text-label font-label uppercase tracking-widest text-on-surface-variant">
                NOAA Kp Forecast
              </span>
              <span className="text-xs uppercase tracking-tight text-primary">Next 24h</span>
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
