import React from 'react'
import { AnimatePresence } from 'framer-motion'
import AppRoutes from './routes/AppRoutes'

const App = () => (
  <div className="min-h-screen bg-background text-on-surface">
    <AnimatePresence mode="wait">
      <AppRoutes />
    </AnimatePresence>
  </div>
)

export default App
