import React from 'react'
import { useFilters } from '../../contexts/FiltersContext'

const ThresholdAlertCard = ({ current }) => {
  const { thresholds, updateThreshold } = useFilters()

  const isKpAlert = Number.isFinite(current?.kp) && current.kp >= thresholds.kp
  const isIrradianceAlert =
    Number.isFinite(current?.irradiance) && current.irradiance >= thresholds.irradiance

  return (
    <div className="glass-card rounded-xl p-lg">
      <div className="mb-md">
        <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
          Alertas configurables
        </p>
        <h3 className="text-h3 font-h3 text-on-surface">Umbrales operativos</h3>
      </div>

      <div className="grid gap-md text-body-sm font-body-sm text-on-surface-variant">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-on-surface">Kp Index</p>
            <p className="text-xs text-on-surface-variant">Alerta si Kp supera el umbral.</p>
          </div>
          <input
            type="number"
            value={thresholds.kp}
            min="0"
            max="9"
            step="0.1"
            onChange={(event) => updateThreshold('kp', Number(event.target.value))}
            className="w-20 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-right text-xs text-on-surface"
          />
          <span className={`text-xs font-semibold ${isKpAlert ? 'text-error' : 'text-secondary'}`}>
            {isKpAlert ? 'ALERTA' : 'OK'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-on-surface">Irradiancia</p>
            <p className="text-xs text-on-surface-variant">Alerta si supera el umbral.</p>
          </div>
          <input
            type="number"
            value={thresholds.irradiance}
            min="0"
            max="1500"
            step="10"
            onChange={(event) => updateThreshold('irradiance', Number(event.target.value))}
            className="w-24 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-right text-xs text-on-surface"
          />
          <span className={`text-xs font-semibold ${isIrradianceAlert ? 'text-error' : 'text-secondary'}`}>
            {isIrradianceAlert ? 'ALERTA' : 'OK'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ThresholdAlertCard
