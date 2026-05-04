import React from 'react'
import InfoTooltip from './InfoTooltip'

const formatValue = (value, unit) => (Number.isFinite(value) ? `${value.toFixed(1)} ${unit}` : '--')

const getWeatherIcon = (isDay, weather) => {
  if (!weather) return 'partly_cloudy'
  const desc = weather.toLowerCase()
  if (desc.includes('despejado')) return isDay ? 'wb_sunny' : 'nights_stay'
  if (desc.includes('nublado')) return 'wb_cloudy'
  if (desc.includes('lluvia') || desc.includes('llovizna')) return 'grain'
  if (desc.includes('nieve')) return 'ac_unit'
  if (desc.includes('tormenta')) return 'thunderstorm'
  if (desc.includes('niebla') || desc.includes('neblina')) return 'foggy'
  return 'partly_cloudy'
}

const MetricBox = ({ label, value, unit, icon }) => (
  <div className="rounded-lg bg-white/5 p-md text-center hover:bg-white/8 transition-colors">
    {icon && <span className="material-symbols-outlined text-2xl text-primary mb-1 block">{icon}</span>}
    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
    <p className="text-base font-mono-data text-on-surface">{value}</p>
    {unit && <p className="text-[9px] text-on-surface-variant">{unit}</p>}
  </div>
)

const SurfaceWeatherCard = ({ data, loading, error, locationLabel }) => (
  <div className="glass-card rounded-xl p-lg">
    <div className="mb-md">
      <div className="flex items-start justify-between mb-md">
        <div>
          <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
            Clima superficial
          </p>
          <h3 className="text-h3 font-h3 text-on-surface">Condiciones actuales</h3>
          {locationLabel ? (
            <p className="text-xs text-on-surface-variant">{locationLabel}</p>
          ) : null}
        </div>
        <InfoTooltip
          label="Open-Meteo"
          description="Datos completos de clima: temperatura, humedad, viento, presión, UV y más."
        />
      </div>
    </div>

    {loading ? (
      <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
    ) : error ? (
      <p className="text-body-sm font-body-sm text-error">{error}</p>
    ) : (
      <div className="space-y-3">
        {/* Estado climático principal */}
        <div className="rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 p-md border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant">Condición</p>
              <p className="text-lg font-semibold text-on-surface">{data?.weather || '--'}</p>
            </div>
            <span className="material-symbols-outlined text-5xl text-secondary">
              {getWeatherIcon(data?.isDay, data?.weather)}
            </span>
          </div>
        </div>

        {/* Grid 2x2: Temperatura, Sensación, Humedad, Presión */}
        <div className="grid grid-cols-2 gap-2">
          <MetricBox 
            label="Temperatura" 
            value={formatValue(data?.temperature, '°C')}
            icon="thermometer"
          />
          <MetricBox 
            label="Sensación" 
            value={formatValue(data?.feelsLike, '°C')}
            icon="sentiment_satisfied"
          />
          <MetricBox 
            label="Humedad" 
            value={formatValue(data?.humidity, '%')}
            icon="water_drop"
          />
          <MetricBox 
            label="Presión" 
            value={formatValue(data?.pressure, 'hPa')}
            icon="compress"
          />
        </div>

        {/* Grid 3x2: Viento, Rachas, Precipitación, Nubosidad, Visibilidad, UV */}
        <div className="grid grid-cols-3 gap-2">
          <MetricBox 
            label="Viento" 
            value={formatValue(data?.windSpeed, 'km/h')}
            icon="air"
          />
          <MetricBox 
            label="Rachas" 
            value={formatValue(data?.windGusts, 'km/h')}
            icon="air"
          />
          <MetricBox 
            label="Dirección" 
            value={data?.windDirection ? `${data.windDirection}°` : '--'}
            icon="explore"
          />
          <MetricBox 
            label="Precipitación" 
            value={formatValue(data?.precipitation, 'mm')}
            icon="grain"
          />
          <MetricBox 
            label="Nubosidad" 
            value={formatValue(data?.cloudCover, '%')}
            icon="wb_cloudy"
          />
          <MetricBox 
            label="Índice UV" 
            value={formatValue(data?.uvIndex, '')}
            icon="wb_sunny"
          />
        </div>

        {/* Grid 2x1: Visibilidad */}
        <div className="grid grid-cols-2 gap-2">
          <MetricBox 
            label="Visibilidad" 
            value={data?.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : '--'}
            icon="visibility"
          />
          <div className="rounded-lg bg-white/5 p-md text-center text-[9px] text-on-surface-variant flex items-center justify-center">
            Actualizado: {data?.time ? new Date(data.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--'}
          </div>
        </div>
      </div>
    )}
  </div>
)

export default SurfaceWeatherCard
