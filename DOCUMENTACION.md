# Geo-Physical Cosmic Aggregator

## Resumen
Aplicacion de dashboard cientifico construida con React y Tailwind. Incluye rutas protegidas, contexto de autenticacion con sessionStorage y un panel inicial con estado del clima espacial via NOAA SWPC.

## Stack
- React + Vite
- Tailwind CSS
- React Router v6
- Framer Motion
- Recharts

## Estructura principal
- Autenticacion: `AuthContext` con estado en sessionStorage.
- Rutas protegidas: `/dashboard`, `/observatory`, `/solar`, `/moon`, `/marine`.
- Layout: Sidebar con navegacion principal y area de contenido.
- NOAA SWPC: Kp, viento solar, campo magnetico, pronostico y alertas.
- NASA POWER: irradiancia solar horaria.
- WHERE THE ISS AT: posicion orbital de la ISS en vivo.
- Met.no: fase y horarios lunares.
- Open-Meteo Marine: oleaje y periodos.

## Flujo de autenticacion
1. Login minimalista con fondo de particulas.
2. Al autenticar, se persiste `gca-auth` en sessionStorage.
3. `ProtectedRoute` redirige a login si no hay sesion.

## Integracion NOAA SWPC
- Servicios: `fetchNoaaSpaceWeather`, `fetchNoaaKpForecast`, `fetchNoaaAlerts`.
- Endpoints actuales:
  - Kp observado: `products/noaa-planetary-k-index.json`.
  - Pronostico Kp: `products/noaa-planetary-k-index-forecast.json`.
  - Plasma solar: `products/solar-wind/plasma-1-day.json`.
  - Campo magnetico: `products/solar-wind/mag-1-day.json`.
  - Alertas: `products/alerts.json`.
- Actualizacion cada 60 segundos (panel principal) y cada 5 minutos (pronostico/alertas).

## Integracion lunar
- Servicio: `fetchMoonData`.
- Endpoint: `https://api.met.no/weatherapi/sunrise/3.0/moon`.
- Datos: fase, salida y puesta.

## Integracion marina
- Servicio: `fetchMarineWaves`.
- Endpoint: `https://marine-api.open-meteo.com/v1/marine`.
- Datos: altura de ola, periodo, wind wave, swell.

## Componentes clave
- Sidebar con enlaces a Dashboard, Datos Solares, Rastreo ISS, Luna y Olas del Mar.
- Filtros globales con rango de tiempo, fuentes activas y ubicaciones persistidas en URL/sessionStorage.
- Selector de ubicaciones con favoritos y busqueda via Open-Meteo Geocoding.
- `NoaaStatusCard` con indicador animado (Kp >= 5) y metricas extendidas.
- `NoaaForecastCard` y `NoaaAlertsCard` para pronostico y alertas.
- `ParticleField` para el fondo de particulas del login.
- Paginas con transiciones usando `AnimatePresence`.
- Panel solar conectado a NASA POWER.
- Panel lunar con fase y horarios.
- Panel marino con oleaje.
- Panel orbital con coordenadas ISS en vivo.
- Comparativas multi-region para irradiancia y oleaje (hasta 3 ubicaciones).
- Exportacion JSON por panel para series y comparativas.

## Ejecutar en local
1. Instalar dependencias: `npm install`.
2. Iniciar dev server: `npm run dev`.

## Siguientes pasos sugeridos
- [x] Integrar seleccion de ubicaciones para datos solares y marinos (paises, ciudades, coordenadas guardadas).
- [x] Agregar mapa orbital para la trayectoria de la ISS con historial de los ultimos 90 minutos.
- [x] Incluir graficas temporales en el dashboard para Kp, viento solar y densidad.
- [x] Crear filtros globales por rango de tiempo, fuente y region (persistidos en URL y sessionStorage).
- [x] Habilitar comparativas multi-region (hasta 3 ubicaciones) en solar y marino.
- [x] Agregar selector rapido de estaciones o paises con favoritos.
- [x] Incluir tarjetas de alertas configurables por umbral (Kp, altura de ola, irradiancia).
- [x] Crear modo de exploracion con mapas y capas (Kp global, oleaje, nubosidad).
- [x] Agregar tooltips ricos con descripcion de cada metrica y unidades.
- [x] Incorporar panel de actividad con eventos recientes y estado de sincronizacion.
- [x] Añadir exportacion de datos (CSV/JSON) por panel.
