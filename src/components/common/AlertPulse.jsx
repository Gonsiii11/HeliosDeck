import React from 'react'
import { motion } from 'framer-motion'

const AlertPulse = ({ active }) => (
  <motion.div
    className={`pulse-ring h-3 w-3 rounded-full ${active ? 'bg-flare' : 'bg-aurora'}`}
    animate={
      active
        ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }
        : { scale: 1, opacity: 0.7 }
    }
    transition={
      active
        ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
        : { duration: 0.4 }
    }
  />
)

export default AlertPulse
