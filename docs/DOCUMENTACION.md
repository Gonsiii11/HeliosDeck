# Documentación Completa: Geo-Physical Cosmic Aggregator

## 📋 Resumen del Proyecto

**Geo-Physical Cosmic Aggregator** es una aplicación web científica de propósito múltiple que agrega datos de clima espacial, radiación solar, actividad orbital y oceanografía desde múltiples fuentes de datos en tiempo real. 

La aplicación proporciona un dashboard interactivo con autenticación, visualizaciones avanzadas de datos geofísicos y herramientas de análisis comparativo para investigadores, meteorólogos y entusiastas de la ciencia espacial.

### Características Principales
- ✅ Dashboard de clima espacial en tiempo real (Kp index, viento solar, campo magnético)
- ✅ Datos de irradiancia solar por ubicación geográfica
- ✅ Posición y orbital de la Estación Espacial Internacional (ISS)
- ✅ Información lunar (fases, salida/puesta)
- ✅ Datos oceanográficos de oleaje y periodos
- ✅ Comparativas multi-región (hasta 3 ubicaciones)
- ✅ Filtros globales y persistencia de preferencias
- ✅ Exportación de datos en formato JSON
- ✅ Autenticación con sesión persistida
- ✅ Interfaz responsiva con animaciones fluidas

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
src/
├── components/          # Componentes de React reutilizables
│   ├── common/         # Componentes compartidos
│   │   ├── ActivityPanel.jsx           # Panel de actividad
│   │   ├── AirQualityCard.jsx          # Tarjeta de calidad del aire
│   │   ├── AlertPulse.jsx              # Indicador de alertas
│   │   ├── ExploreMap.jsx              # Mapa de exploración
│   │   ├── ExportButton.jsx            # Botón de exportación
│   │   ├── GlobalFiltersBar.jsx        # Barra de filtros globales
│   │   ├── InfoTooltip.jsx             # Tooltips informativos
│   │   ├── IssMap.jsx                  # Mapa orbital de la ISS
│   │   ├── LocationSelector.jsx        # Selector de ubicaciones
│   │   ├── MarineCompareGrid.jsx       # Comparativa marina
│   │   ├── NoaaAlerts*.jsx             # Componentes NOAA
│   │   ├── ParticleField.jsx           # Fondo animado
│   │   ├── ProtectedRoute.jsx          # Rutas protegidas
│   │   ├── SolarCompare*.jsx           # Componentes solares
│   │   ├── SurfaceWeatherCard.jsx      # Tarjeta de clima
│   │   ├── ThresholdAlertCard.jsx      # Alertas por umbral
│   │   └── WidgetCard.jsx              # Contenedor de widgets
│   └── layout/         # Componentes de maquetación
│       ├── AppLayout.jsx               # Layout principal
│       └── Sidebar.jsx                 # Barra lateral
├── contexts/           # Context API de React
│   ├── AuthContext.jsx                 # Contexto de autenticación
│   └── FiltersContext.jsx              # Contexto de filtros
├── data/               # Datos estáticos
│   └── locations.js                    # Lista de ubicaciones predefinidas
├── pages/              # Páginas principales
│   ├── Dashboard.jsx                   # Dashboard principal
│   ├── Explore.jsx                     # Modo exploración con mapas
│   ├── Login.jsx                       # Página de login
│   ├── Marine.jsx                      # Panel de oleaje marino
│   ├── Moon.jsx                        # Panel lunar
│   ├── Observatory.jsx                 # Panel de rastreo ISS
│   └── SolarData.jsx                   # Panel de datos solares
├── routes/             # Configuración de rutas
│   └── AppRoutes.jsx                   # Definición de rutas
├── services/           # Servicios para consumo de APIs
│   ├── airQuality.js                   # Calidad del aire
│   ├── geocoding.js                    # Geocodificación
│   ├── iss.js                          # Posición ISS
│   ├── marine.js                       # Datos marinos
│   ├── moon.js                         # Datos lunares
│   ├── nasaPower.js                    # Irradiancia solar
│   ├── noaa.js                         # Clima espacial
│   └── weather.js                      # Datos meteorológicos
├── styles/             # Estilos CSS
│   └── index.css                       # Estilos globales
├── App.jsx             # Componente raíz
└── main.jsx            # Punto de entrada

```

### Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|----------|
| **Build & Dev** | Vite | ^8.0.10 | Bundler rápido y dev server |
| **Framework UI** | React | ^19.0.0 | Librería de componentes |
| **Router** | React Router | ^6.26.2 | Navegación entre páginas |
| **Estilos** | Tailwind CSS | ^3.4.11 | Utilidades CSS |
| **Animaciones** | Framer Motion | ^11.3.19 | Animaciones fluidas |
| **Gráficas** | Recharts | ^2.12.7 | Visualización de datos |
| **Mapas** | MapLibre GL | ^4.1.2 | Renderizado de mapas |

### Flujo de Datos

```
API External (NOAA, NASA, etc.)
         ↓
   Services Layer (fetch)
         ↓
   React Components
         ↓
   Context API (Auth, Filters)
         ↓
   Session Storage (Persistencia)
         ↓
   UI (Tailwind + Framer Motion)
```

---

## 🔌 APIs Consumidas

### 1. NOAA SWPC (National Oceanic and Atmospheric Administration - Space Weather Prediction Center)

**Propósito:** Proporciona datos de clima espacial en tiempo real, incluidos índices de actividad geomagnética, viento solar y alertas.

**Base URL:** `https://services.swpc.noaa.gov`

| Endpoint | Descripción | Actualización | Parámetros |
|----------|-------------|---------------|-----------|
| `/products/noaa-planetary-k-index.json` | Índice Kp actual (actividad geomagnética) | 60 segundos | Ninguno |
| `/products/noaa-planetary-k-index-forecast.json` | Pronóstico Kp 3-4 días | 5 minutos | Ninguno |
| `/products/solar-wind/plasma-1-day.json` | Densidad y velocidad del viento solar últimas 24h | 5 minutos | Ninguno |
| `/products/solar-wind/mag-1-day.json` | Componentes del campo magnético últimas 24h | 5 minutos | Ninguno |
| `/products/alerts.json` | Alertas activas de clima espacial | En tiempo real | Ninguno |

**Implementación en el proyecto:**
```javascript
// src/services/noaa.js
- fetchNoaaSpaceWeather()      // Kp actual, viento solar, campo magnético
- fetchNoaaKpForecast()        // Pronóstico Kp 3-4 días
- fetchNoaaAlerts()            // Alertas activas
- fetchNoaaTimeSeries()        // Series de tiempo para gráficas
```

**Formato de respuesta:**
```json
{
  "kp": 5,
  "wind_speed": 420,
  "bz_component": -8.5,
  "forecast_kp": [4, 5, 5]
}
```

### 2. NASA POWER (Prediction of Worldwide Energy Resource)

**Propósito:** Proporciona datos de radiación solar incidente (irradiancia) para análisis de energía renovable.

**Base URL:** `https://power.larc.nasa.gov/api/temporal/hourly/point`

| Parámetro | Descripción | Requerido |
|-----------|-------------|----------|
| `longitude` | Longitud geográfica (-180 a 180) | ✅ |
| `latitude` | Latitud geográfica (-90 a 90) | ✅ |
| `start` | Fecha inicio (formato YYYYMMDD) | ✅ |
| `end` | Fecha fin (formato YYYYMMDD) | ✅ |
| `parameters` | `ALLSKY_SFC_SW_DWN` (irradiancia superficial) | ✅ |
| `community` | `RE` (Renewable Energy) | ✅ |
| `format` | `JSON` | ✅ |

**Implementación en el proyecto:**
```javascript
// src/services/nasaPower.js
- fetchNasaIrradiance({ latitude, longitude })  // Series horarias de irradiancia
```

**Características:**
- Cache en sessionStorage por ubicación
- Retroceso automático hasta 5 años si no hay datos recientes
- Filtrado de valores no válidos (< -900)

**Formato de respuesta:**
```json
{
  "properties": {
    "parameter": {
      "ALLSKY_SFC_SW_DWN": {
        "20250105": 150,
        "20250106": 160
      }
    }
  }
}
```

### 3. Where The ISS At

**Propósito:** Proporciona la posición orbital actual de la Estación Espacial Internacional.

**Base URL:** `https://api.wheretheiss.at`

| Endpoint | Descripción | Actualización |
|----------|-------------|---------------|
| `/v1/satellites/25544` | Posición actual de la ISS (NORAD ID 25544) | 1-2 segundos |

**Implementación en el proyecto:**
```javascript
// src/services/iss.js
- fetchIssPosition()  // Obtiene latitud, longitud, altitud, velocidad
```

**Formato de respuesta:**
```json
{
  "latitude": 51.6416,
  "longitude": 75.8431,
  "altitude": 408.79,
  "velocity": 27644.67,
  "visibility": "daylight",
  "timestamp": 1672531200
}
```

### 4. Met.no (Norwegian Meteorological Institute)

**Propósito:** Proporciona información de fases lunares y horarios de salida/puesta.

**Base URL:** `https://api.met.no/weatherapi/sunrise/3.0/moon`

| Parámetro | Descripción | Requerido |
|-----------|-------------|----------|
| `lat` | Latitud (-90 a 90) | ✅ |
| `lon` | Longitud (-180 a 180) | ✅ |
| `date` | Fecha (formato YYYY-MM-DD) | ✅ |
| `offset` | Offset UTC (ej: +00:00) | ✅ |

**Implementación en el proyecto:**
```javascript
// src/services/moon.js
- fetchMoonData({ latitude, longitude })  // Fase, salida, puesta lunar
```

**Formato de respuesta:**
```json
{
  "properties": {
    "moonrise": { "time": "2025-01-05T12:34:00Z" },
    "moonset": { "time": "2025-01-06T00:45:00Z" },
    "moonphase": 0.75,
    "low_moon": { "time": "2025-01-05T18:30:00Z" }
  }
}
```

### 5. Open-Meteo Marine API

**Propósito:** Proporciona datos oceanográficos de altura de ola, periodo y componentes del oleaje.

**Base URL:** `https://marine-api.open-meteo.com/v1/marine`

| Parámetro | Descripción | Requerido |
|-----------|-------------|----------|
| `latitude` | Latitud (-90 a 90) | ✅ |
| `longitude` | Longitud (-180 a 180) | ✅ |
| `hourly` | Variables: `wave_height,wave_period,wind_wave_height,swell_wave_height` | ✅ |
| `timezone` | Zona horaria (ej: "auto") | ✅ |
| `cell_selection` | `nearest` para precisión máxima | Opcional |

**Implementación en el proyecto:**
```javascript
// src/services/marine.js
- fetchMarineWaves({ latitude, longitude })  // Datos de oleaje marino
```

**Características especiales:**
- Intento múltiple con offsets: [0,0], [0.5,0], [-0.5,0], [0,0.5], [0,-0.5], [1,0]
- Fallback a ubicación alternativa si falla
- Validación de datos significativos

**Formato de respuesta:**
```json
{
  "hourly": {
    "time": ["2025-01-05T00:00", "2025-01-05T01:00"],
    "wave_height": [1.5, 1.6],
    "wave_period": [8.5, 8.6],
    "wind_wave_height": [0.5, 0.6],
    "swell_wave_height": [1.0, 1.0]
  }
}
```

### 6. Open-Meteo Geocoding API

**Propósito:** Convertir nombres de ubicaciones en coordenadas geográficas (latitud, longitud).

**Base URL:** `https://geocoding-api.open-meteo.com/v1/search`

| Parámetro | Descripción | Requerido |
|-----------|-------------|----------|
| `name` | Nombre de la ubicación o ciudad | ✅ |
| `count` | Número de resultados (máx 100) | Opcional |
| `language` | Código de idioma (ej: "es", "en") | Opcional |
| `format` | `json` | Opcional |

**Implementación en el proyecto:**
```javascript
// src/services/geocoding.js
- searchLocations(query)  // Busca ubicaciones por nombre
```

**Formato de respuesta:**
```json
{
  "results": [
    {
      "id": 3688689,
      "name": "Madrid",
      "country": "España",
      "latitude": 40.4168,
      "longitude": -3.7038,
      "admin1": "Madrid"
    }
  ]
}
```

### Resumen de Consumo de APIs

| API | Propósito | Frecuencia | Cacheo | Crítica |
|-----|-----------|-----------|--------|---------|
| NOAA SWPC | Clima espacial | 60s - 5m | No | ✅ |
| NASA POWER | Irradiancia solar | Por demanda | Sí (sessionStorage) | ✅ |
| Where The ISS At | Órbita ISS | 2s | No | ✅ |
| Met.no | Datos lunares | Por demanda | No | ⚠️ |
| Open-Meteo Marine | Oleaje | Por demanda | No | ⚠️ |
| Open-Meteo Geocoding | Búsqueda de ubicaciones | Por demanda | No | ⚠️ |

---

## 🔐 Autenticación

### Flujo de Autenticación

```
Login Page
    ↓
Usuario ingresa credenciales
    ↓
AuthContext.login() es llamado
    ↓
Estado guardado en sessionStorage ('gca-auth')
    ↓
ProtectedRoute valida isAuthenticated
    ↓
Redirige a Dashboard si es válido
    ↓
Muestra Login si no hay sesión
```

### Implementación

**AuthContext.jsx:**
```javascript
- STORAGE_KEY: 'gca-auth'
- readInitialState()     // Lee sesión de sessionStorage
- login(payload)         // Persiste autenticación
- logout()              // Limpia sesión
- useAuth()             // Hook para acceder al contexto
```

**Ciclo de vida:**
1. App inicia → `readInitialState()` verifica sessionStorage
2. Usuario login → `login()` persiste estado
3. Usuario cierra navegador → sessionStorage se limpia
4. Próxima sesión requiere re-autenticación

---

## 🎨 Estado Global y Contextos

### AuthContext
**Propósito:** Gestiona autenticación y sesión de usuario
```javascript
{
  isAuthenticated: boolean,
  user: { nombre, email, ... },
  login(payload),
  logout()
}
```

### FiltersContext
**Propósito:** Gestiona filtros globales (rango de tiempo, ubicaciones, fuentes)
```javascript
{
  timeRange: { start, end },
  activeSources: [],
  selectedLocations: [],
  setTimeRange(range),
  addLocation(location),
  removeLocation(id)
}
```

**Persistencia:**
- sessionStorage para datos temporales
- URL parameters para bookmarking
- localStorage opcional para preferencias

---

## 📊 Componentes Principales

### Componentes de Datos

| Componente | Página | Función |
|------------|--------|---------|
| `NoaaStatusCard` | Dashboard | Muestra Kp actual, viento solar, campo magnético |
| `NoaaForecastCard` | Dashboard | Pronóstico Kp 3-4 días |
| `NoaaAlertsCard` | Dashboard | Alertas activas de clima espacial |
| `SolarCompareCard` | Solar | Comparativa de irradiancia solar |
| `SolarTrendCard` | Solar | Tendencias de irradiancia |
| `SatelliteSnapshotCard` | Observatory | Posición actual ISS |
| `IssMap` | Observatory | Mapa orbital con trayectoria |
| `MarineCompareGrid` | Marine | Comparativa de oleaje marino |
| `SurfaceWeatherCard` | Explore | Datos meteorológicos |
| `AirQualityCard` | Explore | Índice de calidad del aire |
| `ActivityPanel` | Dashboard | Panel de actividad reciente |

### Componentes de UI/UX

| Componente | Propósito |
|------------|----------|
| `ParticleField` | Fondo animado con partículas en login |
| `AlertPulse` | Indicador animado de alertas |
| `InfoTooltip` | Tooltips informativos con descripciones |
| `ExportButton` | Exportación de datos en JSON |
| `LocationSelector` | Búsqueda y selección de ubicaciones |
| `GlobalFiltersBar` | Filtros compartidos entre páginas |
| `WidgetCard` | Contenedor reutilizable para widgets |

### Componentes de Maquetación

| Componente | Función |
|------------|---------|
| `AppLayout` | Layout principal con Sidebar + contenido |
| `Sidebar` | Navegación principal y enlaces |
| `ProtectedRoute` | Wrapper para proteger rutas |

---

## 📱 Rutas de la Aplicación

```
/                     → Login (sin autenticación)
├── /dashboard        → Dashboard principal (Kp, viento solar, alertas)
├── /solar            → Panel de datos solares por ubicación
├── /observatory      → Rastreo orbital ISS en vivo
├── /moon             → Información lunar (fase, salida/puesta)
├── /marine           → Datos oceanográficos de oleaje
├── /explore          → Modo exploración con mapas y capas
└── *                 → Redirige a Login (404)
```

**Protección:** Todas las rutas excepto `/` requieren autenticación.

---

## 🔄 Estrategias de Actualización de Datos

### Actualizaciones por Componente

| Componente | Intervalo | Estrategia |
|------------|-----------|-----------|
| NOAA Status | 60s | setInterval + fetch |
| NOAA Forecast | 5m | setInterval + fetch |
| ISS Position | 2s | setInterval + fetch |
| NASA Power | Por demanda | Trigger en cambio de ubicación |
| Moon Data | Por demanda | Trigger en cambio de ubicación |
| Marine Waves | Por demanda | Trigger en cambio de ubicación |

### Manejo de Errores

- **Retry automático** para fallos de conexión
- **Fallback a cache** en sessionStorage
- **UI de loading** mientras se cargan datos
- **Mensajes de error** claros para el usuario

---

## 💾 Persistencia de Datos

| Datos | Ubicación | Duración | Propósito |
|-------|-----------|----------|----------|
| Autenticación | sessionStorage | Sesión activa | Mantener login entre página recarga |
| NASA Power Cache | sessionStorage | Sesión activa | Evitar re-fetch innecesarios |
| Ubicaciones seleccionadas | URL + sessionStorage | Persistente | Recuperar selección después de reload |
| Filtros globales | URL + sessionStorage | Persistente | Guardar estado de filtros |

---

## 🚀 Guía de Instalación y Ejecución

### Requisitos Previos
- Node.js 16+ y npm 7+
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para consumo de APIs)

### Pasos de Instalación

1. **Clonar repositorio**
   ```bash
   git clone <repository-url>
   cd "Helios Deck Proyecto"
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

4. **Compilar para producción**
   ```bash
   npm run build
   ```

5. **Previsualizar compilación**
   ```bash
   npm run preview
   ```

### Variables de Entorno
- Actualmente no se requieren variables de entorno
- Todas las APIs son públicas y no requieren autenticación
- Para producción, considerar usar proxies o backend

---

## 🔍 Detalles Técnicos Avanzados

### Normalización de Datos

Todos los servicios normalizan respuestas para garantizar consistencia:

```javascript
// Ejemplo: NOAA Time Series
normalizePlasmaSeries(rows) → [{
  time: "2025-01-05T12:00Z",
  timestamp: 1672920000000,
  density: 5.2,
  speed: 420
}]

// Ejemplo: NASA Power
buildPoints(series) → [{
  time: "12:00",
  value: 150
}]
```

### Validación de Datos

- Filtrado de valores inválidos (-900 en NASA POWER)
- Validación de rangos geográficos (-90 a 90 latitud, -180 a 180 longitud)
- Verificación de timestamps válidos
- Conversiones numéricas con Number.isFinite()

### Optimizaciones

1. **Cacheo selectivo:** NASA POWER usa sessionStorage
2. **Lazy loading:** Componentes se cargan bajo demanda
3. **Code splitting:** Vite optimiza bundle automáticamente
4. **Debouncing:** Búsqueda de ubicaciones
5. **Request deduplication:** Múltiples llamadas simultáneas se consolidan

---

## 🎯 Flujos de Uso Principales

### Flujo 1: Consultar Clima Espacial
1. Usuario accede a `/dashboard`
2. NOAA SWPC se fetcha automáticamente
3. Datos se muestran en tiempo real
4. Actualización cada 60 segundos
5. Alertas se destacan si Kp >= 5

### Flujo 2: Analizar Irradiancia Solar
1. Usuario accede a `/solar`
2. Selecciona ubicación con LocationSelector
3. NASA POWER fetcha datos para esa ubicación
4. Serie temporal se dibuja con Recharts
5. Comparativa multi-región disponible
6. Exportación JSON disponible

### Flujo 3: Rastrear ISS
1. Usuario accede a `/observatory`
2. Posición actual se fetcha cada 2 segundos
3. Mapa interactivo muestra trayectoria
4. Coordenadas se actualizan en tiempo real
5. Historial de últimos 90 minutos disponible

### Flujo 4: Explorar Datos Oceanográficos
1. Usuario accede a `/marine`
2. Selecciona ubicación costera
3. Datos de oleaje se cargan
4. Gráficas muestran tendencias
5. Alertas si altura de ola supera umbral

---

## 📈 Métricas y KPIs

### Datos Rastreados
- **Kp Index:** 0-9 (actividad geomagnética)
- **Viento Solar:** km/s (velocidad)
- **Irradiancia:** W/m² (potencia solar)
- **Altura de Ola:** metros
- **Fase Lunar:** 0-1 (0=nueva, 0.5=llena)

### Umbrales de Alerta
- Kp >= 5: Tormenta geomagnética moderada
- Oleaje >= 3m: Alerta marina
- Irradiancia baja: Día nublado

---

## 🐛 Resolución de Problemas

### Problema: "API no responde"
- Verificar conexión a internet
- Revisar consola del navegador
- NOAA SWPC a veces tiene latencia
- Intentar en otra ventana/navegador

### Problema: "Datos en cache viejo"
- Limpiar sessionStorage (Devtools > Application)
- Recargar la página (Cmd+Shift+R)
- Cambiar de ubicación para forzar new fetch

### Problema: "Login no funciona"
- Verificar que sessionStorage está habilitado
- Limpiar cookies del sitio
- Intentar en modo incógnito

---

## 🔮 Roadmap Futuro

### Corto Plazo
- [ ] Sincronización en tiempo real con WebSockets
- [ ] Historial completo de eventos
- [ ] Descargas CSV
- [ ] Alertas personalizables

### Mediano Plazo
- [ ] Backend propio para autenticación
- [ ] Base de datos para historial
- [ ] Análisis predictor con ML
- [ ] API propia para datos curados

### Largo Plazo
- [ ] Aplicación móvil nativa
- [ ] Integración con satélites custom
- [ ] Análisis meteorológico avanzado
- [ ] Monetización para instituciones

---

## 📚 Referencias y Documentación Externa

- **NOAA SWPC:** https://www.swpc.noaa.gov/
- **NASA POWER:** https://power.larc.nasa.gov/
- **Where The ISS At:** https://wheretheiss.at/
- **Met.no API:** https://www.met.no/en/free-weather-data/
- **Open-Meteo:** https://open-meteo.com/
- **React Router:** https://reactrouter.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Recharts:** https://recharts.org/

---

## 📝 Notas de Mantenimiento

### Actualizaciones de Dependencias
```bash
npm outdated              # Ver dependencias desactualizadas
npm update                # Actualizar todas
npm install <pkg>@latest  # Actualizar específica
```

### Limpieza de Build
```bash
rm -rf node_modules dist  # Limpia todo
npm install && npm run build
```

### Análisis de Bundle
```bash
npm run build             # Genera reporte en dist/
```

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0
**Mantenedor:** Helios Deck Team
