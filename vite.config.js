import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'recharts': ['recharts'],
          'maplibre': ['maplibre-gl'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
