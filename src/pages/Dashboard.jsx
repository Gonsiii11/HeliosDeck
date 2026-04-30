import React from 'react'
import { motion } from 'framer-motion'
import NoaaStatusCard from '../components/common/NoaaStatusCard'
import WidgetCard from '../components/common/WidgetCard'

const Dashboard = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.4 }}
    className="space-y-8"
  >
    <header className="space-y-2">
      <p className="text-xs uppercase tracking-[0.35em] text-aurora/70">Mission Control</p>
      <h2 className="text-2xl font-semibold">Panel de control geo-fisico</h2>
      <p className="text-sm text-nebula/70">
        Estado sincronizado con NOAA SWPC. Mantiene actividad geomagnetica en tiempo real.
      </p>
    </header>

    <div className="grid gap-5 lg:grid-cols-3">
      <NoaaStatusCard />

      <WidgetCard title="Telemetria integradora" subtitle="Sistema">
        <div className="space-y-3 text-sm text-nebula/70">
          <div className="flex items-center justify-between">
            <span>Flujo ionico</span>
            <span className="text-nebula">Estable</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Vectores magneticos</span>
            <span className="text-nebula">Alerta baja</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Ultima sincronizacion</span>
            <span className="text-nebula">Hace 2 min</span>
          </div>
        </div>
      </WidgetCard>

      <WidgetCard title="Alerta geomagnetica" subtitle="Indicador">
        <p className="text-sm text-nebula/70">
          Las pulsaciones se activan cuando el indice Kp supera 5. Mantenga vigilancia en
          tormentas solares.
        </p>
      </WidgetCard>
    </div>
  </motion.div>
)

export default Dashboard
