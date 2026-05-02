import React from 'react'

const ActivityPanel = ({ events }) => (
  <div className="glass-card rounded-xl p-lg">
    <div className="mb-md">
      <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
        Actividad reciente
      </p>
      <h3 className="text-h3 font-h3 text-on-surface">Estado de sincronizacion</h3>
    </div>

    <div className="space-y-3 text-body-sm font-body-sm text-on-surface-variant">
      {events.length === 0 ? (
        <p>Sin eventos recientes.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-on-surface">{event.message}</p>
              <p className="text-xs text-on-surface-variant">{event.detail}</p>
            </div>
            <span className="text-xs text-on-surface-variant">{event.time}</span>
          </div>
        ))
      )}
    </div>
  </div>
)

export default ActivityPanel
