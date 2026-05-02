import React, { useMemo, useState } from 'react'

const buildDate = (offsetDays = 0) => {
  const date = new Date()
  date.setDate(date.getDate() - offsetDays)
  return date.toISOString().slice(0, 10)
}

const buildGibsUrl = (date) => {
  const params = new URLSearchParams({
    service: 'WMS',
    request: 'GetMap',
    layers: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    styles: '',
    format: 'image/jpeg',
    transparent: 'false',
    version: '1.1.1',
    height: '512',
    width: '1024',
    srs: 'EPSG:4326',
    bbox: '-180,-90,180,90',
    time: date,
  })

  return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${params.toString()}`
}

const SatelliteSnapshotCard = () => {
  const [offset, setOffset] = useState(0)
  const [failed, setFailed] = useState(false)
  const date = useMemo(() => buildDate(offset), [offset])
  const src = useMemo(() => buildGibsUrl(date), [date])

  const handleError = () => {
    if (offset < 2) {
      setOffset(offset + 1)
      return
    }
    setFailed(true)
  }

  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="p-md">
        <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
          Fotos satelitales
        </p>
        <h3 className="text-h3 font-h3 text-on-surface">Vista global (NASA GIBS)</h3>
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Capa True Color diaria. Fecha: {date}
        </p>
      </div>
      <div className="relative h-56">
        <img
          className="h-full w-full object-cover"
          alt="NASA GIBS True Color"
          src={src}
          onError={handleError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-on-surface-variant">
            Imagen no disponible por ahora.
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SatelliteSnapshotCard
