# Copilot Instructions - Geo-Physical Cosmic Aggregator

## Checklist de Desarrollo

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions
- [x] Compile the Project
- [x] Create and Run Task
- [x] Launch the Project
- [x] Ensure Documentation is Complete

## Proyecto

**Nombre:** Geo-Physical Cosmic Aggregator

**Descripción:** Dashboard científico que agrega datos de clima espacial, radiación solar, órbita ISS, datos lunares y oceanografía desde múltiples APIs públicas.

**Stack:** React 19 + Vite + Tailwind CSS + Framer Motion + Recharts

## APIs Consumidas

1. **NOAA SWPC** - Clima espacial (Kp, viento solar, campo magnético, alertas)
2. **NASA POWER** - Irradiancia solar por coordenadas
3. **Where The ISS At** - Posición orbital ISS en tiempo real
4. **Met.no** - Datos lunares (fases, salida/puesta)
5. **Open-Meteo Marine** - Oleaje marino (altura, periodo)
6. **Open-Meteo Geocoding** - Búsqueda de ubicaciones

## Rutas Principales

```
/          → Login
/dashboard → Panel con clima espacial en vivo
/solar     → Datos de irradiancia solar
/observatory → Rastreo ISS
/moon      → Información lunar
/marine    → Datos oceanográficos
/explore   → Modo exploración con mapas
```

## Estructura de Carpetas

```
src/
├── components/common/   → Componentes reutilizables
├── components/layout/   → Layout principal
├── contexts/            → AuthContext, FiltersContext
├── pages/               → Páginas principales
├── services/            → Consumo de APIs
├── routes/              → Configuración de rutas
├── styles/              → Estilos Tailwind
└── data/                → Datos estáticos
```

## Documentación Disponible

1. **DOCUMENTACION.md** - Documentación exhaustiva del proyecto
   - Resumen y características
   - Arquitectura completa
   - Todas las APIs con parámetros
   - Componentes y contextos
   - Estrategias de actualización
   - Guía de instalación

2. **README.md** - Introducción y quick start
   - Features principales
   - Stack tecnológico
   - Instalación rápida
   - Rutas y autenticación

3. **ARQUITECTURA.md** - Detalles técnicos profundos
   - Diagrama de arquitectura
   - Flujo de datos
   - Gestión de estado
   - Patrones de diseño
   - Seguridad y performance

4. **API_INTEGRATION.md** - Guía completa de APIs
   - Endpoints con ejemplos
   - Construcción de requests
   - Parseo de respuestas
   - Patrones comunes
   - Troubleshooting

5. **QUICK_REFERENCE.md** - Referencia rápida
   - Comandos útiles
   - Rutas y endpoints
   - Snippets de código
   - Tips y soluciones rápidas

## Instrucciones para Copilot

### Cuando trabajes en el proyecto:

1. **Consulta la documentación primero**
   - Busca en DOCUMENTACION.md para entender el proyecto
   - Usa ARQUITECTURA.md para flujos complejos
   - Usa API_INTEGRATION.md para integración de APIs

2. **Sigue las convenciones del proyecto**
   - Usa Context API para estado global
   - Normaliza datos de APIs antes de usar
   - Cachea en sessionStorage cuando sea apropiado
   - Maneja errores con try/catch + fallback

3. **Desarrollo de características**
   - Crea componentes en `src/components/common/`
   - Crea servicios en `src/services/`
   - Usa hooks personalizados para lógica reutilizable
   - Siempre valida datos de APIs

4. **Testing y debugging**
   - Prueba localmente con `npm run dev`
   - Verifica console.log por errores
   - Usa DevTools React para inspeccionar state
   - Monitorea Network tab para API calls

5. **Commits y documentación**
   - Actualiza documentación si cambias arquitectura
   - Documenta nuevas APIs si las integras
   - Mantén README.md actualizado

## Guía de Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview de build
npm run preview
```

## Patrones Importantes

### Fetch con Error Handling
```javascript
try {
  const data = await fetchAPI()
  setData(data)
} catch (err) {
  console.error('Error:', err)
  setError(err.message)
}
```

### Interval para Actualización
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetchData()
  }, 60000)
  
  return () => clearInterval(interval)
}, [])
```

### Usar Context
```javascript
const { isAuthenticated, user } = useAuth()
const { timeRange, selectedLocations } = useFilters()
```

## Dependencias Clave

- **react@19** - Framework UI
- **react-router-dom@6** - Routing
- **tailwindcss@3** - Estilos
- **framer-motion@11** - Animaciones
- **recharts@2** - Gráficos
- **maplibre-gl@4** - Mapas

## Desarrollo Best Practices

1. ✅ Siempre normaliza datos de APIs
2. ✅ Cachea datos cuando sea posible
3. ✅ Valida rangos geográficos (-90:90, -180:180)
4. ✅ Maneja null/undefined explícitamente
5. ✅ Usa loading states mientras cargas
6. ✅ Implementa error boundaries
7. ✅ Debounce búsquedas y inputs
8. ✅ Documenta cambios importantes

## Troubleshooting Común

| Problema | Solución |
|----------|----------|
| Login no persiste | Verificar sessionStorage está habilitado |
| API no responde | Revisar console.log, reintentar, revisar CORS |
| Datos en caché viejo | Limpiar sessionStorage, recargar página |
| Componente no renderea | Verificar ProtectedRoute, auth state |
| Estilos no aplican | Verificar clases Tailwind, reconstruir |

## Next Steps

- Sincronización en tiempo real con WebSockets
- Backend para autenticación robusta
- Base de datos para historial
- Análisis predictivo con ML
- App móvil nativa

---

**Última actualización:** Enero 2025
**Versión del Proyecto:** 1.0.0
