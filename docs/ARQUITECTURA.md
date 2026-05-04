# Arquitectura Técnica Detallada - Geo-Physical Cosmic Aggregator

## 1. Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR DEL USUARIO                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          APLICACIÓN REACT (Vite + React 19)         │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │         Context API (State Management)        │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │ AuthContext (Autenticación)              │ │ │  │
│  │  │  │ FiltersContext (Filtros Globales)        │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                       ↓↑                            │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │      Services Layer (Consumo de APIs)         │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │ noaa.js          (NOAA SWPC)            │ │ │  │
│  │  │  │ nasaPower.js     (NASA POWER)           │ │ │  │
│  │  │  │ iss.js           (Where The ISS At)     │ │ │  │
│  │  │  │ moon.js          (Met.no)               │ │ │  │
│  │  │  │ marine.js        (Open-Meteo Marine)    │ │ │  │
│  │  │  │ geocoding.js     (Open-Meteo Geocoding) │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                       ↓↑                            │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │        Components Layer (React)               │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │ Pages: Dashboard, Solar, Observatory...  │ │ │  │
│  │  │  │ Componentes: Tarjetas, Gráficos, Mapas  │ │ │  │
│  │  │  │ Layout: AppLayout, Sidebar              │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                       ↓↑                            │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │         UI Layer (Tailwind + Framer)         │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │ Estilos Tailwind CSS                     │ │ │  │
│  │  │  │ Animaciones Framer Motion                │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │    Local Storage (sessionStorage)              │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │ gca-auth (Autenticación)                 │ │ │  │
│  │  │  │ gca-nasa-irradiance:lat:lon (Cache)     │ │ │  │
│  │  │  │ URL Params (Estado persistente)          │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓↑
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNOS (APIs)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  NOAA SWPC       │  │  NASA POWER      │               │
│  │  Climate Data    │  │  Solar Data      │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Where ISS At    │  │  Met.no          │               │
│  │  Órbita ISS      │  │  Datos Lunares   │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Open-Meteo Marine│  │ Open-Meteo GEO   │               │
│  │  Datos Oleaje    │  │ Geocodificación  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 2. Flujo de Datos (Data Flow)

### 2.1 Flujo de Inicio de Sesión

```
Usuario inicia app
      ↓
¿Hay 'gca-auth' en sessionStorage?
      ├─ SÍ → Leer estado inicial
      │         AuthContext.setAuthState(cached)
      │         ↓
      │      ¿Autenticado?
      │         ├─ SÍ → Ir a Dashboard
      │         └─ NO → Mostrar Login
      │
      └─ NO → isAuthenticated = false
               Mostrar Login
                ↓
         Usuario ingresa credenciales
                ↓
         AuthContext.login(userData)
                ↓
         Guardar en sessionStorage
                ↓
         Actualizar estado
                ↓
         Redirigir a Dashboard
```

### 2.2 Flujo de Carga de Datos (Dashboard)

```
ComponentDidMount (Dashboard)
      ↓
setInterval(() => {
      ├─ fetchNoaaSpaceWeather()      [Cada 60s]
      ├─ fetchNoaaKpForecast()        [Cada 5m]
      └─ fetchNoaaAlerts()            [Cada 5m]
}, 60000)
      ↓
response.json()
      ↓
normalizeData() {
      ├─ Extraer valores numéricos
      ├─ Validar rangos
      ├─ Convertir timestamps
      └─ Mapear a estructura interna
}
      ↓
setState(normalizedData)
      ↓
Render componentes con datos
      ↓
useEffect(() => {
      └─ Limpiar intervalos al desmontar
})
```

### 2.3 Flujo de Selección de Ubicación

```
Usuario escribe en LocationSelector
      ↓
Input onChange → Debounce (300ms)
      ↓
searchLocations(query)  [Geocoding API]
      ↓
Response: [{
  id, name, country, latitude, longitude, admin1
}]
      ↓
Renderizar dropdown con resultados
      ↓
Usuario selecciona ubicación
      ↓
FiltersContext.addLocation(location)
      ↓
URL.searchParams.set('locations', serialized)
      ↓
useEffect detecta cambio de ubicación
      ↓
fetchNasaIrradiance({ latitude, longitude })
fetchMarineWaves({ latitude, longitude })
fetchMoonData({ latitude, longitude })
      ↓
Cache en sessionStorage si aplicable
      ↓
Actualizar gráficas
```

## 3. Gestión de Estado (State Management)

### 3.1 AuthContext

```javascript
// Estado
{
  isAuthenticated: boolean,
  user: {
    nombre: string,
    email?: string,
    // Otros campos personalizados
  }
}

// Acciones
login(payload: any)         // Persiste en sessionStorage
logout()                    // Limpia sessionStorage
readInitialState()          // Lee desde sessionStorage

// Hook
useAuth() → {
  ...authState,
  login,
  logout
}
```

### 3.2 FiltersContext

```javascript
// Estado
{
  timeRange: {
    start: Date,
    end: Date
  },
  activeSources: string[],
  selectedLocations: Location[],
  // Location = { id, name, country, latitude, longitude }
}

// Acciones
setTimeRange(range: { start, end })
addLocation(location: Location)
removeLocation(id: string)
clearLocations()
```

### 3.3 Componentes con Estado Local

Cada componente gestiona su propio estado:
```javascript
// Ejemplo: NoaaStatusCard
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
```

## 4. Ciclo de Vida de Componentes

### 4.1 Componente típico de datos

```javascript
function DataPanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { selectedLocations } = useContext(FiltersContext)
  
  useEffect(() => {
    // Setup
    setLoading(true)
    
    // Fetch
    fetchDataFromAPI(selectedLocations[0])
      .then(result => {
        setData(normalizeData(result))
        setError(null)
      })
      .catch(err => {
        setError(err.message)
        // Fallback a cache si disponible
      })
      .finally(() => setLoading(false))
    
    // Cleanup
    return () => {
      // Cancelar requests pendientes
      // Limpiar intervalos
      // Remover event listeners
    }
  }, [selectedLocations])
  
  // Render
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  return <DataVisualization data={data} />
}
```

## 5. Flujos de APIs

### 5.1 NOAA SWPC API

**Secuencia de integración:**

```javascript
// src/services/noaa.js

export const fetchNoaaSpaceWeather = async () => {
  // 1. Paralelizar requests
  const [kpRes, plasmaRes, magRes] = await Promise.all([
    fetch(KP_URL),
    fetch(PLASMA_URL),
    fetch(MAG_URL)
  ])
  
  // 2. Validar respuestas
  if (!kpRes.ok || !plasmaRes.ok || !magRes.ok) {
    throw new Error('NOAA fetch failed')
  }
  
  // 3. Parsear JSON
  const [kpData, plasmaData, magData] = await Promise.all([
    kpRes.json(),
    plasmaRes.json(),
    magRes.json()
  ])
  
  // 4. Extraer valores más recientes
  const latestKp = getLatestKp(kpData)
  const latestPlasma = getLatestNumericRow(plasmaData, 3)
  const latestMag = getLatestNumericRow(magData, 3)
  
  // 5. Normalizar y retornar
  return {
    kp: latestKp?.Kp,
    windSpeed: latestPlasma?.[2],
    density: latestPlasma?.[1],
    bz: latestMag?.[2]
  }
}
```

**Validaciones:**
- Verificar que `rows` es Array y tiene longitud suficiente
- Convertir valores a números
- Validar que valores numéricos sean finitos
- Extraer última fila válida de datos

### 5.2 NASA POWER API

**Secuencia de integración:**

```javascript
// src/services/nasaPower.js

export const fetchNasaIrradiance = async ({ latitude, longitude }) => {
  // 1. Revisar cache
  const cacheKey = getCacheKey({ latitude, longitude })
  const cached = readCache(cacheKey)
  
  // 2. Intentar múltiples rangos de fechas
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { start, end } = getLastCompleteUtcDayRange(1 + attempt * 365)
    
    // 3. Construir URL con parámetros
    const url = buildUrlWithParams({
      parameters: 'ALLSKY_SFC_SW_DWN',
      community: 'RE',
      longitude, latitude,
      start: formatDate(start),
      end: formatDate(end),
      format: 'JSON'
    })
    
    // 4. Fetch
    const response = await fetch(url)
    
    // 5. Si falla, retornar cache si existe
    if (!response.ok) {
      if (cached) return cached
      continue
    }
    
    // 6. Parsear y normalizar
    const payload = await response.json()
    const series = payload?.properties?.parameter?.[PARAM] || {}
    const points = buildPoints(series)  // Convertir a { time, value }
    
    // 7. Si hay datos, cachear y retornar
    if (points.length > 0) {
      const result = { points, latitude, longitude }
      writeCache(cacheKey, result)
      return result
    }
  }
  
  // 8. Fallback final
  if (cached) return cached
  throw new Error('NASA POWER no data')
}
```

**Características avanzadas:**
- Retroceso de 1-5 años automático si no hay datos recientes
- Cacheo selectivo en sessionStorage
- Filtrado de valores erróneos (< -900)
- Conversión de claves timestamp a tiempo amigable

### 5.3 Where The ISS At API

**Secuencia simple:**

```javascript
export const fetchIssPosition = async () => {
  const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
  
  if (!response.ok) throw new Error('ISS fetch failed')
  
  const payload = await response.json()
  
  return {
    latitude: payload?.latitude ?? null,
    longitude: payload?.longitude ?? null,
    altitude: payload?.altitude ?? null,
    velocity: payload?.velocity ?? null,
    visibility: payload?.visibility ?? null,
    timestamp: payload?.timestamp ?? null,
  }
}
```

**Características:**
- Actualización cada 2 segundos
- Sin cacheo (datos en tiempo real)
- Null-coalescing para valores faltantes

## 6. Estructura de Componentes

### 6.1 Componentes de Datos (Smart Components)

Contienen lógica de fetch y state:

```
Dashboard
├── NoaaStatusCard
├── NoaaForecastCard
├── NoaaAlertsCard
├── ActivityPanel
└── [Gráficos compilados]
```

### 6.2 Componentes de Presentación (Dumb Components)

Solo reciben props y renderean:

```
SolarCompareCard
├── WidgetCard (contenedor)
├── Recharts.LineChart
├── Legend
└── Tooltip
```

### 6.3 Componentes de Layout

Estructuran la página:

```
AppLayout
├── Sidebar
│   ├── Logo
│   ├── NavLinks
│   └── UserMenu
├── MainContent
│   ├── GlobalFiltersBar
│   └── PageContent (Outlet)
└── Notifications
```

## 7. Patrones de Diseño Utilizados

### 7.1 Context API (State Management)

```javascript
<AuthProvider>
  <FiltersProvider>
    <App />
  </FiltersProvider>
</AuthProvider>
```

**Ventajas:**
- No requiere librería externa
- Bueno para estado global simple
- Integración nativa con React

### 7.2 Custom Hooks

```javascript
// Ejemplo: useLocationData
function useLocationData(location) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Logic compartida
  }, [location])
  
  return { data, loading }
}
```

### 7.3 Higher Order Components (Wrappers)

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### 7.4 Render Props / Children Patterns

```javascript
<WidgetCard title="Solar Data">
  <div>Contenido dinámico</div>
</WidgetCard>
```

## 8. Manejo de Errores

### 8.1 Niveles de Error

```
Nivel 1: API Error
  ↓ Catch en service
  ↓ Retornar estado de error
  ↓
Nivel 2: Component Error Boundary
  ↓ Captura excepciones de render
  ↓
Nivel 3: User Notification
  ↓ Toast o fallback UI
```

### 8.2 Estrategia de Fallback

```javascript
try {
  return await fetchAPI()
} catch (err) {
  // Nivel 1: Log en consola
  console.error('API Error:', err)
  
  // Nivel 2: Intentar cache
  const cached = getCache()
  if (cached) return cached
  
  // Nivel 3: Datos por defecto
  return DEFAULT_DATA
  
  // Nivel 4: Mostrar error al usuario
  throw new Error('Data unavailable')
}
```

## 9. Optimizaciones de Rendimiento

### 9.1 Code Splitting

Vite automáticamente divide código:
```
dist/
├── index-abc123.js (app)
├── vendor-def456.js (dependencies)
└── pages-xyz789.js (lazy loaded)
```

### 9.2 Lazy Loading

```javascript
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### 9.3 Memoization

```javascript
const NoaaStatusCard = React.memo(({ data }) => {
  return <div>{data}</div>
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data
})
```

### 9.4 useCallback y useMemo

```javascript
const handleLocationChange = useCallback((location) => {
  setLocation(location)
}, [])

const computedValue = useMemo(() => {
  return expensiveComputation(data)
}, [data])
```

## 10. Seguridad

### 10.1 Protección de Rutas

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/" />
}
```

### 10.2 CORS y Seguridad HTTP

- Todas las APIs consumidas permiten CORS
- No hay credentials en requests (APIs públicas)
- HTTPS recomendado en producción

### 10.3 Sanitización de Datos

```javascript
// Validar entrada de usuario
const trimmed = normalizeText(query)  // .trim()
if (!trimmed) return []

// Validar respuestas de API
if (!Array.isArray(results)) return []
if (!Number.isFinite(Number(value))) return null
```

## 11. Testing (Recomendaciones Futuras)

```javascript
// Unit Tests (Jest)
describe('fetchNoaaSpaceWeather', () => {
  it('should return normalized data', async () => {
    const data = await fetchNoaaSpaceWeather()
    expect(data).toHaveProperty('kp')
  })
})

// Integration Tests
describe('Dashboard flow', () => {
  it('should display Kp when loaded', async () => {
    const { getByText } = render(<Dashboard />)
    await waitFor(() => {
      expect(getByText(/Kp/)).toBeInTheDocument()
    })
  })
})
```

## 12. Deployment

### 12.1 Build Process

```bash
npm run build
  ↓
Vite transpila JSX → JS
  ↓
Tailwind procesa CSS
  ↓
Code splitting automático
  ↓
Optimización de assets
  ↓
dist/ generado
```

### 12.2 Recomendaciones de Hosting

- **Estático:** Vercel, Netlify, GitHub Pages
- **Con Backend:** AWS S3 + CloudFront, Azure Static Web Apps
- **Self-hosted:** Nginx, Apache

### 12.3 Variables de Entorno (Futuro)

```env
VITE_API_BASE_URL=https://api.example.com
VITE_NOAA_URL=https://services.swpc.noaa.gov
VITE_NASA_URL=https://power.larc.nasa.gov
```

## 13. Monitoreo y Debugging

### 13.1 React DevTools
```
Inspeccionar estado de componentes
Visualizar Context
Profiler de rendimiento
```

### 13.2 Network Tab (DevTools)
```
Monitorear llamadas a APIs
Inspeccionar respuestas
Revisar headers
```

### 13.3 Console Logging

```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('API Response:', data)
}
```

---

**Última actualización:** Enero 2025
**Versión de Arquitectura:** 2.0
