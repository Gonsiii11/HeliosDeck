import React from 'react'
import InfoTooltip from './InfoTooltip'

const formatValue = (value, unit) => (Number.isFinite(value) ? `${value} ${unit}` : '--')

const SurfaceWeatherCard = ({ data, loading, error, locationLabel }) => (
  <div className="glass-card rounded-xl p-lg">
    <div className="mb-md flex items-center justify-between">
      <div>
        <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
          Clima superficial
        </p>
        <h3 className="text-h3 font-h3 text-on-surface">Estado actual</h3>
        {locationLabel ? (
          <p className="text-xs text-on-surface-variant">{locationLabel}</p>
        ) : null}
      </div>
      <InfoTooltip
        label="Open-Meteo"
        description="Temperatura, viento, precipitacion y nubosidad."
      />
    </div>

    {loading ? (
      <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
    ) : error ? (
      <p className="text-body-sm font-body-sm text-error">{error}</p>
    ) : (
      <div className="space-y-3 text-body-sm font-body-sm text-on-surface-variant">
        <div className="flex items-center justify-between">
          <span>Temperatura</span>
          <span className="text-on-surface">{formatValue(data?.temperature, '°C')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Viento</span>
          <span className="text-on-surface">{formatValue(data?.windSpeed, 'km/h')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Precipitacion</span>
          <span className="text-on-surface">{formatValue(data?.precipitation, 'mm')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Nubosidad</span>
          <span className="text-on-surface">{formatValue(data?.cloudCover, '%')}</span>
        </div>
        <p className="text-xs text-on-surface-variant">Actualizado: {data?.time ?? '--'}</p>
      </div>
    )}
  </div>
)

export default SurfaceWeatherCard
