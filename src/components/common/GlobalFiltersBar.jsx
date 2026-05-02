import React from 'react'
import { useFilters } from '../../contexts/FiltersContext'
import LocationSelector from './LocationSelector'

const TIME_RANGES = [
  { value: '6h', label: '6H' },
  { value: '24h', label: '24H' },
  { value: '48h', label: '48H' },
  { value: '7d', label: '7D' },
]

const GlobalFiltersBar = () => {
  const { timeRange, setTimeRange, sources, toggleSource } = useFilters()

  return (
    <div className="grid gap-bento-gap lg:grid-cols-[1fr_1fr]">
      <div className="glass-card relative overflow-hidden rounded-xl p-sm">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div
            className="h-full w-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20360%20200%22%3E%3Crect%20width%3D%22360%22%20height%3D%22200%22%20fill%3D%22%230e1416%22/%3E%3Ccircle%20cx%3D%22260%22%20cy%3D%22100%22%20r%3D%2268%22%20fill%3D%22none%22%20stroke%3D%22%232fd9f4%22%20stroke-width%3D%220.8%22%20opacity%3D%220.7%22/%3E%3Cpath%20d%3D%22M192%20100h136%22%20stroke%3D%22%234edea3%22%20stroke-width%3D%220.6%22%20opacity%3D%220.5%22/%3E%3Cpath%20d%3D%22M202%2070h116%22%20stroke%3D%22%232fd9f4%22%20stroke-width%3D%220.6%22%20opacity%3D%220.4%22/%3E%3Cpath%20d%3D%22M202%20130h116%22%20stroke%3D%22%232fd9f4%22%20stroke-width%3D%220.6%22%20opacity%3D%220.4%22/%3E%3Cellipse%20cx%3D%22260%22%20cy%3D%22100%22%20rx%3D%2228%22%20ry%3D%2268%22%20fill%3D%22none%22%20stroke%3D%22%23ffd6a7%22%20stroke-width%3D%220.6%22%20opacity%3D%220.5%22/%3E%3C/svg%3E')]
            bg-cover bg-center"
          />
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-sm">
          <div>
            <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
              Filtros globales
            </p>
            <p className="text-xs text-on-surface-variant">
              Persistidos en URL y sessionStorage
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TIME_RANGES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTimeRange(item.value)}
                className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-widest transition ${
                  timeRange === item.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-white/10 bg-white/5 text-on-surface-variant hover:border-white/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-sm flex flex-wrap gap-2">
          {[
            { key: 'noaa', label: 'NOAA' },
            { key: 'nasa', label: 'NASA' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleSource(item.key)}
              className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-widest transition ${
                sources[item.key]
                  ? 'border-secondary bg-secondary/10 text-secondary'
                  : 'border-white/10 bg-white/5 text-on-surface-variant hover:border-white/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <LocationSelector />
    </div>
  )
}

export default GlobalFiltersBar
