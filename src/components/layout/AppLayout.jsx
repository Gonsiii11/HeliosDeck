import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../contexts/AuthContext'

const AppLayout = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="fixed left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-white/10 bg-slate-950/60 px-6 backdrop-blur-[12px] shadow-[0_8px_32px_rgba(6,182,212,0.15)]">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined cursor-pointer text-primary transition active:scale-95">
            language
          </span>
          <h1 className="text-xs font-black uppercase tracking-widest text-primary">
            OPS_CENTER_V1.0
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="pulse-live h-2 w-2 rounded-full bg-primary"></div>
            <span className="text-xs font-semibold uppercase tracking-tight text-primary">
              System Live
            </span>
          </div>
          <div className="hidden items-center gap-2 text-xs text-on-surface-variant md:flex">
            <span>{user?.name || 'Cosmic Analyst'}</span>
            <span className="text-on-surface-variant">•</span>
            <span className="uppercase">Operator</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-on-surface transition hover:border-white/20"
          >
            Logout
          </button>
        </div>
      </header>

      <Sidebar />

      <main className="min-h-screen pl-20 pt-14">
        <div className="mx-auto max-w-[1600px] p-container-margin">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
