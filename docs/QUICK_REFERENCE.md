# Quick Reference Guide - Geo-Physical Cosmic Aggregator

## 🚀 Instalación Rápida

```bash
npm install && npm run dev
# http://localhost:5173
```

## 📂 Estructura Rápida

```
src/
├── components/common/    → Componentes reutilizables
├── pages/                → Páginas (Dashboard, Solar, etc)
├── services/             → Consumo de APIs (fetch)
├── contexts/             → AuthContext, FiltersContext
└── styles/               → Tailwind CSS
```

## 🔌 APIs en Línea

| API | Base URL | Datos | Frec | Cache |
|-----|----------|-------|------|-------|
| NOAA | `services.swpc.noaa.gov` | Kp, viento solar | 60s | ❌ |
| NASA | `power.larc.nasa.gov` | Irradiancia | Manual | ✅ |
| ISS | `api.wheretheiss.at` | Posición ISS | 2s | ❌ |
| Moon | `api.met.no` | Luna data | Manual | ❌ |
| Geo | `geocoding-api.open-meteo.com` | Ubicaciones | Manual | ❌ |

## 📱 Rutas

```
/          → Login
/dashboard → Panel principal (Kp, alertas)
/solar     → Irradiancia solar
/observatory → ISS tracking
/moon      → Datos lunares
/explore   → Mapas exploración
```

## 🔑 Endpoints API Principales

### NOAA SWPC
```
/products/noaa-planetary-k-index.json           # Kp actual
/products/noaa-planetary-k-index-forecast.json  # Pronóstico
/products/solar-wind/plasma-1-day.json          # Viento solar
/products/solar-wind/mag-1-day.json             # Campo magnético
/products/alerts.json                           # Alertas
```

### NASA POWER
```
https://power.larc.nasa.gov/api/temporal/hourly/point
?latitude=40.7&longitude=-74.0&start=20250101&end=20250105
&parameters=ALLSKY_SFC_SW_DWN&community=RE&format=JSON
```

### Otros
```
https://api.wheretheiss.at/v1/satellites/25544
https://api.met.no/weatherapi/sunrise/3.0/moon?lat=40.7&lon=-74&date=2025-01-05
https://geocoding-api.open-meteo.com/v1/search?name=Madrid&count=8
```

## 🎣 Importar Servicios

```javascript
import { fetchNoaaSpaceWeather } from '../services/noaa'
import { fetchNasaIrradiance } from '../services/nasaPower'
import { fetchIssPosition } from '../services/iss'
import { fetchMoonData } from '../services/moon'
import { searchLocations } from '../services/geocoding'
```

## 💾 SessionStorage Keys

```
gca-auth                              # Token autenticación
gca-nasa-irradiance:lat:lon           # Cache NASA POWER
```

## 🪝 Usar Context

```javascript
// Autenticación
const { isAuthenticated, user, login, logout } = useAuth()

// Filtros
const { timeRange, selectedLocations, setTimeRange } = useFilters()
```

## ⚡ Componentes Principales

| Componente | Página | Props |
|-----------|--------|-------|
| `NoaaStatusCard` | Dashboard | - |
| `SolarCompareCard` | Solar | locations |
| `IssMap` | Observatory | - |
| `LocationSelector` | Any | onSelect |
| `GlobalFiltersBar` | Layout | - |

## 🎨 Tailwind Clases Útiles

```html
<!-- Contenedor -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- Card -->
<div class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">

<!-- Texto -->
<h1 class="text-2xl font-bold text-slate-900 dark:text-white">

<!-- Botón -->
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">

<!-- Grid -->
<div class="grid grid-cols-2 gap-2">
```

## 🎬 Framer Motion Ejemplos

```javascript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## 📊 Recharts Ejemplo

```javascript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

<LineChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="time" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="value" stroke="#3b82f6" />
</LineChart>
```

## 🔒 Auth Flow

```javascript
// Login
const { login } = useAuth()
login({ nombre: 'Juan', email: 'juan@example.com' })

// Proteger ruta
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Verificar en componente
const { isAuthenticated } = useAuth()
if (!isAuthenticated) return <Navigate to="/" />
```

## ⚙️ Interval Pattern

```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchData()
      setData(data)
    } catch (err) {
      console.error('Error:', err)
    }
  }
  
  loadData()  // Ejecutar inmediatamente
  const interval = setInterval(loadData, 60000)  // Cada 60s
  
  return () => clearInterval(interval)  // Cleanup
}, [])
```

## 🔄 Fetch Pattern

```javascript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [])
```

## 🧪 Test Command

```bash
npm run build    # Compilar
npm run preview  # Previsualizar
npm run dev      # Desarrollo
```

## 🐛 Debug Tips

### Console
```javascript
console.log('Data:', data)
console.error('Error:', err)
console.table(arrayData)
```

### DevTools React
```
Components tab → Inspect component
Profiler → See render performance
```

### Network Tab
```
F12 → Network
Filtrar por fetch calls
Ver headers y response
```

## 📦 Dependencias Versiones

```json
{
  "react": "19.0.0",
  "react-router-dom": "6.26.2",
  "tailwindcss": "3.4.11",
  "framer-motion": "11.3.19",
  "recharts": "2.12.7",
  "maplibre-gl": "4.1.2"
}
```

## 🚨 Common Issues & Fixes

| Problema | Solución |
|----------|----------|
| "API no responde" | Verificar internet, revisar console |
| "Login no funciona" | Verificar sessionStorage, limpiar cookies |
| "Datos en caché viejo" | Limpiar sessionStorage (DevTools) |
| "Ruta no carga" | Verificar ProtectedRoute, auth state |
| "Estilos no aplican" | Verificar clases Tailwind, purge config |

## 📖 Documentos Completos

- **DOCUMENTACION.md** → Documentación exhaustiva
- **ARQUITECTURA.md** → Detalles técnicos
- **API_INTEGRATION.md** → Guía de APIs
- **README.md** → Introducción general

## 🔗 Links Útiles

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)
- [Vite Docs](https://vitejs.dev)

## 💡 Pro Tips

1. **Cachear agresivamente:** Usa sessionStorage para APIs costosas
2. **Debounce búsquedas:** Espera 300ms antes de ejecutar query
3. **Parallel fetches:** Usa Promise.all para múltiples requests
4. **Error boundaries:** Siempre captura errores en servicios
5. **Loading states:** Muestra spinners mientras cargan datos
6. **Type safety:** Normaliza datos de APIs siempre
7. **Mobile first:** Desarrolla mobile primero, expande después

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0

**¿Necesitas más ayuda?** Ver documentación completa en los archivos MD
