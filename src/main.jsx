import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { FiltersProvider } from './contexts/FiltersContext'
import 'maplibre-gl/dist/maplibre-gl.css'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
