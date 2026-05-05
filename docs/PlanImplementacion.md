# Plan de Implementación: "Geo-Physical Cosmic Aggregator"

> Este plan se divide en 4 fases para construir una aplicación robusta sin persistencia de datos (usando memoria volátil/State).

---

## Fase 1: Arquitectura y Enrutamiento

### Configuración
- Inicializar proyecto con **Vite + React**

### Routing
Configurar `react-router-dom` con las siguientes rutas:

| Ruta | Descripción |
|------|-------------|
| `/login` | Pantalla de acceso (Simulada) |
| `/dashboard` | Vista principal con resumen de datos |
| `/solar` | Datos de irradiancia solar |
| `/observatory` | Rastreo ISS en tiempo real |
| `/moon` | Información lunar |
| `/marine` | Datos oceanográficos |
| `/explore` | Modo exploración con mapas |

### Seguridad
- Implementar `ProtectedRoute` que verifique un token en `sessionStorage`
- Validar autenticación en rutas protegidas

---

## Fase 2: Integración de Datos y Visualización

### Consumo de APIs
- **NOAA SWPC**: Clima espacial (Kp, viento solar, campo magnético, alertas)
- **NASA POWER**: Irradiancia solar por coordenadas
- **Where The ISS At**: Posición orbital ISS en tiempo real
- **Met.no**: Datos lunares (fases, salida/puesta)
- **Open-Meteo Marine**: Oleaje marino (altura, periodo)
- **Open-Meteo Geocoding**: Búsqueda de ubicaciones

### Visualizaciones (Recharts)
- Proximidad de objetos cercanos a la Tierra
- Frecuencia de llamaradas solares
- Índice Kp histórico
- Altura de olas por ubicación
- Fases lunares y horarios

### Gestión de Estado
- Usar **Context API** para manejar datos de APIs de forma global
- No requiere base de datos (memoria volátil/State)
- Normalizar datos antes de almacenar

---

## Fase 3: Micro-interacciones y UI

### Animaciones (Framer Motion)
- Transiciones suaves entre rutas
- Efectos de "hover" en tarjetas de datos
- Carga animada de gráficos (Staggered animations)
- Pulsos y animaciones de alerta

### Feedback Visual
- Implementar **Skeletons** mientras se cargan datos
- Loading states en todas las peticiones API
- Error boundaries para manejo de fallos
- Toast notifications para feedback del usuario

### Diseño
- **Tailwind CSS** para estilos responsivos
- Paleta de colores cósmica
- Layout responsive para mobile/tablet/desktop

---

## Fase 4: Lógica de Autenticación (Sin DB)

### Mock Authentication
- Crear servicio de autenticación simulada
- Validar usuario/password estático
- Guardar sesión en `sessionStorage`
- Implementar logout con limpieza de datos

### Sesión
- Token temporal mientras el usuario está en la app
- Expiración al cerrar navegador
- Persistencia opcional con `localStorage` (usuario recuerda sesión)
