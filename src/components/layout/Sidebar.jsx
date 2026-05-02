import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/dashboard', icon: 'dashboard' },
  { label: 'Solar', to: '/solar', icon: 'flare' },
  { label: 'ISS', to: '/observatory', icon: 'satellite_alt' },
  { label: 'Moon', to: '/moon', icon: 'dark_mode' },
  { label: 'Marine', to: '/marine', icon: 'water_drop' },
]

const Sidebar = () => (
  <nav className="fixed left-0 top-0 z-40 flex h-full w-20 flex-col items-center gap-8 border-r border-white/10 bg-slate-900/60 py-20 backdrop-blur-[20px]">
    <div className="flex flex-col items-center gap-10">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex w-full flex-col items-center gap-1 py-2 text-[10px] uppercase tracking-widest transition-all duration-300 ${
              isActive
                ? 'border-r-2 border-primary bg-primary/10 text-primary'
                : 'text-slate-500 hover:text-slate-200'
            }`
          }
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
)

export default Sidebar
