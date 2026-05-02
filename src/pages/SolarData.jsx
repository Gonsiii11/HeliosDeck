import React from 'react'
import { motion } from 'framer-motion'
import SolarTrendCard from '../components/common/SolarTrendCard'

const SolarData = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.4 }}
    className="space-y-6"
  >
    <header className="space-y-2">
      <p className="text-label font-label uppercase tracking-widest text-on-surface-variant">
        Radiacion solar
      </p>
      <h2 className="text-h2 font-h2 text-on-surface">Fluctuacion de irradiancia</h2>
      <p className="text-body-sm font-body-sm text-on-surface-variant">
        Curva animada para visualizar tendencias en tiempo real.
      </p>
    </header>

    <SolarTrendCard title="Solar Irradiance Trend" subtitle="NASA POWER" />
  </motion.div>
)

export default SolarData
