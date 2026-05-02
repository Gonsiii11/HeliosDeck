import React from 'react'
import { motion } from 'framer-motion'
import GlobalFiltersBar from '../components/common/GlobalFiltersBar'
import MarineCompareGrid from '../components/common/MarineCompareGrid'
import { useFilters } from '../contexts/FiltersContext'

const Marine = () => {
  const { sources } = useFilters()

  return (
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
          Oceano
        </p>
        <h2 className="text-h2 font-h2 text-on-surface">Olas y energia marina</h2>
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Lecturas horarias para altura y periodo de oleaje.
        </p>
      </header>

      {sources.marine ? (
        <MarineCompareGrid />
      ) : (
        <div className="glass-card rounded-xl p-lg text-body-sm font-body-sm text-on-surface-variant">
          La fuente Marine esta desactivada en los filtros globales.
        </div>
      )}
    </motion.div>
  )
}

export default Marine

