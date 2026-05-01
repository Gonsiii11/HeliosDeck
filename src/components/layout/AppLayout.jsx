import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const AppLayout = () => (
  <div className="aurora-backdrop min-h-screen px-6 py-8">
    <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="glass-panel grid-glow min-h-[70vh] rounded-3xl p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  </div>
)

export default AppLayout
