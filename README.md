# Geo-Physical Cosmic Aggregator 🌍🛰️

Dashboard científico interactivo que agrega datos de clima espacial, radiación solar, órbita de la ISS y datos lunares desde múltiples APIs públicas.

## ✨ Características Principales

- 📡 **Clima Espacial en Vivo** - Kp index, viento solar, campo magnético (NOAA SWPC)
- ☀️ **Irradiancia Solar** - Datos horarios por ubicación geográfica (NASA POWER)
- 🛸 **Rastreo ISS** - Posición orbital en tiempo real con mapa interactivo
- 🌙 **Datos Lunares** - Fases, salida y puesta (Met.no)
- 🔐 **Autenticación** - Con sesión persistida en sessionStorage
- 📊 **Visualizaciones** - Gráficos interactivos con Recharts
- 🗺️ **Mapas** - Renderizado con MapLibre GL
- 📤 **Exportación** - Datos en formato JSON por panel
- 🎨 **UI/UX Moderna** - Tailwind CSS + Framer Motion

## 🚀 Quick Start

### Requisitos
- Node.js 16+ y npm 7+
- Navegador moderno

### Instalación
```bash
# Clonar repositorio
git clone <repository-url>
cd "Helios Deck Proyecto"

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

La aplicación estará en `http://localhost:5173`

## 📦 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Build | Vite 8 |
| Framework | React 19 |
| Router | React Router 6 |
| Estilos | Tailwind CSS 3 |
| Animaciones | Framer Motion 11 |
| Gráficos | Recharts 2 |
| Mapas | MapLibre GL 4 |

## 📂 Estructura del Proyecto

```
src/
├── components/     # Componentes React reutilizables
├── contexts/       # Context API (Auth, Filters)
├── pages/          # Páginas principales (Dashboard, Solar, etc)
├── services/       # Servicios para consumo de APIs
├── routes/         # Configuración de rutas
├── styles/         # Estilos globales
└── data/           # Datos estáticos
```

## 🔌 APIs Consumidas

| API | Propósito | Frecuencia |
|-----|----------|-----------|
| **NOAA SWPC** | Clima espacial | 60s |
| **NASA POWER** | Irradiancia solar | Por demanda |
| **Where The ISS At** | Órbita ISS | 2s |
| **Met.no** | Datos lunares | Por demanda |
| **Open-Meteo Geocoding** | Búsqueda de ubicaciones | Por demanda |

### Endpoints Principales

**NOAA SWPC**
```
https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json
https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json
https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json
https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json
https://services.swpc.noaa.gov/products/alerts.json
```

**NASA POWER**
```
https://power.larc.nasa.gov/api/temporal/hourly/point
Parámetros: latitude, longitude, start, end, parameters, community, format
```

**Where The ISS At**
```
https://api.wheretheiss.at/v1/satellites/25544
```

**Met.no Sunrise**
```
https://api.met.no/weatherapi/sunrise/3.0/moon
Parámetros: lat, lon, date, offset
```

**Open-Meteo Geocoding**
```
https://geocoding-api.open-meteo.com/v1/search
Parámetros: name, count, language, format
```

## 📱 Rutas y Páginas

| Ruta | Página | Descripción |
|------|--------|------------|
| `/` | Login | Autenticación con fondo de partículas |
| `/dashboard` | Dashboard | Panel principal con clima espacial |
| `/solar` | Solar Data | Irradiancia solar por ubicación |
| `/observatory` | Observatory | Rastreo y órbita ISS |
| `/moon` | Moon | Información lunar |
| `/explore` | Explore | Modo exploración con mapas |

**Nota:** Todas las rutas excepto `/` requieren autenticación.

## 🔐 Autenticación

- **Método:** Sesión basada en sessionStorage
- **Clave:** `gca-auth`
- **Duración:** Sesión activa del navegador
- **Protección:** ProtectedRoute valida isAuthenticated

## 🎨 Componentes Principales

### Componentes de Datos
- `NoaaStatusCard` - Estado actual de clima espacial
- `NoaaForecastCard` - Pronóstico Kp 3-4 días
- `NoaaAlertsCard` - Alertas activas
- `SolarCompareCard` - Comparativa de irradiancia
- `SolarTrendCard` - Tendencias solares
- `IssMap` - Mapa orbital con trayectoria

### Componentes de UI
- `ParticleField` - Fondo animado
- `AlertPulse` - Indicador de alertas
- `LocationSelector` - Búsqueda de ubicaciones
- `GlobalFiltersBar` - Filtros compartidos
- `ExportButton` - Exportación de datos

## 📊 Intervalos de Actualización

| Fuente | Intervalo | Método |
|--------|-----------|--------|
| NOAA Status | 60 segundos | setInterval |
| NOAA Forecast | 5 minutos | setInterval |
| ISS Position | 2 segundos | setInterval |
| NASA Power | Por demanda | onClick |
| Moon Data | Por demanda | onClick |

## 💾 Persistencia

| Datos | Ubicación | Duración |
|-------|-----------|----------|
| Autenticación | sessionStorage | Sesión |
| Cache NASA | sessionStorage | Sesión |
| Ubicaciones | URL + sessionStorage | Persistente |
| Filtros | URL + sessionStorage | Persistente |

## 📦 Build y Deploy

### Compilar para producción
```bash
npm run build
```

### Previsualizar compilación
```bash
npm run preview
```

### Limpiar build
```bash
rm -rf node_modules dist
npm install && npm run build
```

## 🔍 Características Técnicas

- ✅ Normalización automática de datos de APIs
- ✅ Validación de rangos geográficos
- ✅ Manejo de errores con fallback a cache
- ✅ Code splitting automático con Vite
- ✅ Lazy loading de componentes
- ✅ Debouncing en búsquedas
- ✅ Deduplicación de requests

## 🐛 Resolución de Problemas

### "API no responde"
- Verificar conexión a internet
- NOAA SWPC puede tener latencia
- Revisar consola (F12)

### "Datos en cache viejo"
- Limpiar sessionStorage (DevTools > Application)
- Recargar página (Cmd+Shift+R en Mac)
- Cambiar de ubicación

### "Login no funciona"
- Verificar que sessionStorage está habilitado
- Limpiar cookies del sitio
- Intentar en modo incógnito

## 📚 Documentación Completa

Para documentación exhaustiva sobre arquitectura, APIs, flujos de datos y roadmap, ver:
- [DOCUMENTACION.md](./DOCUMENTACION.md)

## 🔮 Roadmap

**Corto Plazo**
- [ ] Sincronización WebSocket
- [ ] Historial completo de eventos
- [ ] Descargas CSV

**Mediano Plazo**
- [ ] Backend de autenticación
- [ ] Base de datos para historial
- [ ] Predicción con ML

**Largo Plazo**
- [ ] Aplicación móvil
- [ ] Integración satélites
- [ ] Análisis meteorológico avanzado

## 🔗 Referencias

- [NOAA SWPC](https://www.swpc.noaa.gov/)
- [NASA POWER](https://power.larc.nasa.gov/)
- [Where The ISS At](https://wheretheiss.at/)
- [Met.no API](https://www.met.no/en/free-weather-data/)
- [Open-Meteo](https://open-meteo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📝 Scripts Disponibles

```bash
npm run dev       # Inicia servidor de desarrollo
npm run build     # Compila para producción
npm run preview   # Previsualiza compilación
```

## 📄 Licencia

MIT

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2025  
**Mantenedor:** Helios Deck Team
