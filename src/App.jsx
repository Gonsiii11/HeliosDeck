import React from 'react'
import { AnimatePresence } from 'framer-motion'
import AppRoutes from './routes/AppRoutes'

const App = () => (
  <div className="min-h-screen bg-starlight text-nebula">
    <AnimatePresence mode="wait">
      <AppRoutes />
    </AnimatePresence>
  </div>
)

export default App
