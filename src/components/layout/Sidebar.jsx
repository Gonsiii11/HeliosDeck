import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Datos Solares', to: '/solar' },
  { label: 'Rastreo ISS', to: '/observatory' },
  { label: 'Luna', to: '/moon' },
  { label: 'Olas del Mar', to: '/marine' },
]

const Sidebar = () => {
  const { user, logout } = useAuth()

  return (
    <aside className="glass-panel flex h-full w-full flex-col gap-6 rounded-3xl p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-aurora/70">Geo-Physical</p>
        <h1 className="text-2xl font-semibold text-nebula">Cosmic Aggregator</h1>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? 'bg-flare/15 text-flare shadow-glow'
                  : 'text-nebula/70 hover:bg-aurora/10'
              }`
            }
          >
            <span>{item.label}</span>
            <span className="text-xs text-nebula/40">/</span>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-nebula/50">Operador</p>
          <p className="mt-2 text-sm text-nebula">{user?.name || 'Cosmic Analyst'}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-nebula transition active:scale-95"
        >
          Cerrar Sesion
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
