import React from 'react'
import InfoTooltip from './InfoTooltip'

const formatValue = (value, unit) => (Number.isFinite(value) ? `${value} ${unit}` : '--')

const AirQualityCard = ({ data, loading, error, locationLabel }) => (
  <div className="glass-card rounded-xl p-lg">
    <div className="mb-md flex items-center justify-between">
      <div>
        <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
          Calidad del aire
        </p>
        <h3 className="text-h3 font-h3 text-on-surface">Indice actual</h3>
        {locationLabel ? (
          <p className="text-xs text-on-surface-variant">{locationLabel}</p>
        ) : null}
      </div>
      <InfoTooltip
        label="Open-Meteo"
        description="PM2.5, PM10, NO2 y AQI en tiempo real."
      />
    </div>

    {loading ? (
      <p className="text-body-sm font-body-sm text-on-surface-variant">Cargando...</p>
    ) : error ? (
      <p className="text-body-sm font-body-sm text-error">{error}</p>
    ) : (
      <div className="space-y-3 text-body-sm font-body-sm text-on-surface-variant">
        <div className="flex items-center justify-between">
          <span>PM2.5</span>
          <span className="text-on-surface">{formatValue(data?.pm25, 'µg/m3')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>PM10</span>
          <span className="text-on-surface">{formatValue(data?.pm10, 'µg/m3')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>NO2</span>
          <span className="text-on-surface">{formatValue(data?.no2, 'µg/m3')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>US AQI</span>
          <span className="text-on-surface">{Number.isFinite(data?.aqi) ? data.aqi : '--'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>EU AQI</span>
          <span className="text-on-surface">
            {Number.isFinite(data?.europeanAqi) ? data.europeanAqi : '--'}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant">Actualizado: {data?.time ?? '--'}</p>
      </div>
    )}
  </div>
)

export default AirQualityCard
