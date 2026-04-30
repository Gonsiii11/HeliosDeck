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
- Rutas protegidas: `/dashboard` y `/observatory`.
- Layout: Sidebar con navegacion principal y area de contenido.
- NOAA SWPC: consumo de indice Kp y viento solar en tiempo real.
- NASA POWER: irradiancia solar horaria.
- WHERE THE ISS AT: posicion orbital de la ISS en vivo.

## Flujo de autenticacion
1. Login minimalista con fondo de particulas.
2. Al autenticar, se persiste `gca-auth` en sessionStorage.
3. `ProtectedRoute` redirige a login si no hay sesion.

## Integracion NOAA SWPC
- Servicio: `fetchNoaaSpaceWeather`.
- Datos consumidos:
  - Indice Kp (planetary_k_index_1m).
  - Viento solar (solar-wind).
- Actualizacion cada 60 segundos.

## Componentes clave
- Sidebar con enlaces a Dashboard, Datos Solares y Rastreo ISS.
- `NoaaStatusCard` con indicador animado (Kp >= 5).
- `ParticleField` para el fondo de particulas del login.
- Paginas con transiciones usando `AnimatePresence`.
- Panel solar conectado a NASA POWER.
- Panel orbital con coordenadas ISS en vivo.

## Ejecutar en local
1. Instalar dependencias: `npm install`.
2. Iniciar dev server: `npm run dev`.

## Siguientes pasos sugeridos
- Integrar la API de NASA POWER con seleccion de ubicaciones.
- Agregar mapa orbital para la trayectoria de la ISS.
- Expandir el dashboard con widgets adicionales.
