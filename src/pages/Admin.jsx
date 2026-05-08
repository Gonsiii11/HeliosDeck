import React, { useEffect, useState } from 'react'
import { fetchNasaIrradiance } from '../services/nasaPower'
import { favoriteLocations } from '../data/locations'

const LOG_KEY = 'adminLogs'
const NASA_PREFIX = 'gca-nasa-irradiance'

const readLogs = () => {
  try {
    const raw = sessionStorage.getItem(LOG_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeLog = (entry) => {
  try {
    const logs = readLogs()
    logs.unshift(entry)
    sessionStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 200)))
  } catch {}
}

const clearNasaCache = () => {
  try {
    const keys = Object.keys(sessionStorage)
    keys.forEach((k) => {
      if (k && k.startsWith(NASA_PREFIX)) sessionStorage.removeItem(k)
    })
  } catch {}
}

export default function Admin() {
  const [logs, setLogs] = useState(() => readLogs())
  const [running, setRunning] = useState(false)

  useEffect(() => {
    setLogs(readLogs())
  }, [])

  const appendLog = (msg) => {
    const entry = { time: new Date().toISOString(), message: msg }
    writeLog(entry)
    setLogs((s) => [entry, ...s])
  }

  const handleForceRefetch = async () => {
    setRunning(true)
    appendLog('Iniciando forzado de re-fetch: limpiando cache NASA')
    clearNasaCache()

    for (const loc of favoriteLocations.slice(0, 8)) {
      try {
        appendLog(`Solicitando irradiancia para ${loc.name}`)
        const res = await fetchNasaIrradiance({ latitude: loc.latitude, longitude: loc.longitude })
        appendLog(`OK ${loc.name}: ${res.points?.length ?? 0} puntos`) 
      } catch (e) {
        appendLog(`Error ${loc.name}: ${e.message || e}`)
      }
    }

    appendLog('Forzado de re-fetch completado')
    setRunning(false)
  }

  const handleClearLogs = () => {
    try {
      sessionStorage.removeItem(LOG_KEY)
      setLogs([])
    } catch {}
  }

  return (
    <div className="p-lg">
      <div className="mb-md">
        <p className="text-label uppercase tracking-widest text-on-surface-variant">Administración</p>
        <h3 className="text-h3">Panel Admin (solo para administradores)</h3>
        <p className="text-body-sm text-on-surface-variant">Acciones: forzar re-fetch de datos y revisar logs.</p>
      </div>

      <div className="mb-md flex items-center gap-4">
        <button
          onClick={handleForceRefetch}
          disabled={running}
          className="rounded bg-primary px-4 py-2 text-white disabled:opacity-60"
        >
          {running ? 'Ejecutando…' : 'Forzar re-fetch'}
        </button>
        <button onClick={handleClearLogs} className="rounded border px-3 py-2">
          Limpiar logs
        </button>
      </div>

      <div className="glass-card rounded-xl p-md">
        <p className="mb-sm text-label text-on-surface-variant">Logs recientes</p>
        <div className="max-h-72 overflow-auto text-xs text-on-surface-variant">
          {logs.length === 0 ? (
            <p>Sin registros.</p>
          ) : (
            <ul className="space-y-2">
              {logs.map((l, idx) => (
                <li key={idx} className="text-sm">
                  <span className="text-on-surface-variant mr-2">[{new Date(l.time).toLocaleString()}]</span>
                  <span>{l.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
