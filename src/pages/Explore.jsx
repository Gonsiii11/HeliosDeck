import React from 'react'
import { motion } from 'framer-motion'
import GlobalFiltersBar from '../components/common/GlobalFiltersBar'
import ExploreMap from '../components/common/ExploreMap'

const Explore = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.4 }}
    className="space-y-6"
  >
    <GlobalFiltersBar />

    <header className="space-y-2">
      <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
        Exploracion global
      </p>
      <h2 className="text-h2 font-h2 text-on-surface">Mapa ambiental</h2>
      <p className="text-body-sm font-body-sm text-on-surface-variant">
        Capas interactivas con Kp global, oleaje y nubosidad.
      </p>
    </header>

    <ExploreMap />
  </motion.div>
)

export default Explore
