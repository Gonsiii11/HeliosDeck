# 🔐 Cambios en Autenticación: De Mock a Real con dummyjson

**Fecha:** Mayo 2026  
**Referencia:** [Web Atelier - React Authentication](https://ruvebal.github.io/web-atelier-udit/lessons/en/react/react-authentication/)

---

## 📋 Resumen de Cambios

Se ha reemplazado la autenticación simulada (mock) con **autenticación real contra la API dummyjson**, usando **JWT (JSON Web Token)** con tokens de acceso y refresco.

### Características Implementadas:
✅ Login con credenciales reales contra dummyjson  
✅ Persistencia de sesión (reload mantiene login)  
✅ Refresh token automático en mount  
✅ Manejo de errores y loading states  
✅ Token storage centralizado (swappable a cookies)  
✅ Logout limpio con eliminación de datos  

---

## 📁 Nuevos Archivos Creados

### 1. `src/services/tokenStorage.js`
**Propósito:** Punto único de verdad para el almacenamiento de tokens.

```javascript
// Almacena solo el refreshToken en localStorage
// El accessToken vive en memory (React state) — más seguro
const REFRESH_KEY = 'gca.refreshToken'

export const tokenStorage = {
  getRefreshToken()      // Obtener token guardado
  setRefreshToken(token) // Guardar token
  clear()               // Limpiar al logout
}
```

**Por qué es importante:**
- **Seguridad:** Centralizar aquí permite cambiar a cookies httpOnly sin tocar el resto del código
- **Un solo lugar:** Todos los componentes usan esta interfaz, no localStorage directo
- **Mantenibilidad:** Si cambias de estrategia (localStorage → cookies → sessionStorage), solo cambias este archivo

---

### 2. `src/services/authApi.js`
**Propósito:** Todos los calls a la API de autenticación viven aquí.

```javascript
// Usa dummyjson.com/auth endpoints:
export async function login({ username, password })    // POST /auth/login
export async function getMe(accessToken)               // GET /auth/me
export async function refresh(refreshToken)            // POST /auth/refresh
```

**Endpoints de dummyjson:**
| Endpoint | Método | Entrada | Salida |
|----------|--------|---------|--------|
| `/auth/login` | POST | `{username, password}` | `{accessToken, refreshToken, user...}` |
| `/auth/me` | GET | `Authorization: Bearer {token}` | `{full user data including role}` |
| `/auth/refresh` | POST | `{refreshToken}` | `{accessToken, refreshToken}` |

**Credenciales de prueba:**
```
emilys / emilyspass  (rol: admin)
michaelw / michaelwpass  (rol: user)
```
[Ver más usuarios](https://dummyjson.com/users)

---

### 3. `src/components/common/StatusMessage.jsx`
**Propósito:** Componentes reutilizables para UX de carga y errores.

```javascript
<Loading text="Verificando sesión…" />  // Estado de carga
<ErrorMsg message="Login failed" />      // Mostrar errores
```

---

### 4. `src/components/common/LoginForm.jsx`
**Propósito:** Formulario controlado reutilizable.

- ✅ Pre-llena credenciales de demo
- ✅ Validación básica
- ✅ Estados disabled durante carga
- ✅ Muestra errores del servidor
- ✅ Completamente presentacional (sin useAuth)

```javascript
<LoginForm 
  onSubmit={(username, password) => login(username, password)}
  isPending={isLoading}
  error={error}
/>
```

---

### 5. `src/components/common/AuthBadge.jsx`
**Propósito:** Indicador visual de sesión en la navbar.

- Muestra nombre del usuario + rol
- Botón de logout
- Se actualiza automáticamente cuando login/logout ocurre
- Ideal para poner en el header/navbar

```javascript
// En AppLayout o Sidebar:
import AuthBadge from '../components/common/AuthBadge'

// Render:
<AuthBadge />  // Muestra el usuario o "anonymous"
```

---

## 🔄 Archivos Modificados

### 1. `src/contexts/AuthContext.jsx`
**Cambio:** De mock → autenticación real

**Antes:**
```javascript
// Solo simulaba login, guardaba en sessionStorage
login(payload) → sessionStorage
```

**Ahora:**
```javascript
// Flujo real:
1. En mount: 
   - Busca refreshToken en localStorage
   - Si existe → POST /auth/refresh para obtener accessToken
   - GET /auth/me para obtener datos completos del usuario
   - Si falla → logout limpio

2. En login(username, password):
   - POST /auth/login con credenciales
   - Guarda accessToken en memory (estado React)
   - Guarda refreshToken en localStorage
   - GET /auth/me para obtener user completo (incluyendo role)

3. En logout():
   - Limpia todo (user, tokens, errors)
   - Elimina refreshToken de localStorage
```

**Nueva API del contexto:**
```javascript
const { 
  user,           // null | {id, firstName, lastName, email, role, image...}
  accessToken,    // null | JWT string
  isLoading,      // true si está verificando sesión/login
  error,          // null | "mensaje de error"
  login,          // async (username, password) → Promise<user>
  logout,         // () → void
  updateTokens    // (para refresh futuro)
} = useAuth()
```

---

### 2. `src/components/common/ProtectedRoute.jsx`
**Cambio:** Agregar rama `isLoading`

**Antes:**
```javascript
if (!isAuthenticated) return <Navigate ... />
return children
```

**Ahora:**
```javascript
if (isLoading) return <Loading text="Checking session…" />  // ← NUEVO
if (!user) return <Navigate ... />
return children
```

**Por qué:** Evita mostrar la página protegida mientras verifica si hay sesión válida (boot-time refresh).

---

### 3. `src/pages/Login.jsx`
**Cambio:** Reemplazar login mock con formulario real

**Antes:**
```javascript
// Input simple + login mock
login({ name: ... })  // simulado
```

**Ahora:**
```javascript
// Usa LoginForm + error handling real
await login(username, password)  // Real API call
if (user) → auto-redirect a /dashboard
```

---

## 🔐 Flujo de Autenticación

### 1️⃣ Abrirse la App (Primer Render)

```
App monta
  ↓
AuthProvider monta
  ↓
useEffect en AuthProvider:
  - Lee localStorage por refreshToken
  - Si NO existe → setIsLoading(false), fin
  - Si existe:
    - POST /auth/refresh {refreshToken}
    - GET /auth/me {accessToken}
    - Guarda en state (user + accessToken)
    - Limpia localStorage si falla
  ↓
ProtectedRoute:
  - Si isLoading=true → <Loading/>
  - Si isLoading=false + user=null → <Navigate to="/"/>
  - Si user → renderiza children
```

### 2️⃣ Usuario Hace Login

```
User escribe username/password
  ↓
Hace click en "Sign in"
  ↓
LoginForm llama onSubmit(username, password)
  ↓
Login.jsx llama useAuth().login(username, password)
  ↓
AuthContext:
  - POST /auth/login {username, password}
  - Guarda accessToken en state
  - Guarda refreshToken en localStorage
  - GET /auth/me {accessToken}
  - Guarda user en state
  ↓
useEffect en Login ve user ≠ null
  ↓
useNavigate → /dashboard
```

### 3️⃣ User Recarga la Página

```
Page reload
  ↓
React re-monta componentes
  ↓
AuthProvider useEffect:
  - Lee localStorage
  - refreshToken existe → POST /auth/refresh
  - Obtiene nuevo accessToken
  - GET /auth/me para datos frescos
  ↓
ProtectedRoute ve user ≠ null
  ↓
Renderiza Dashboard sin redirigir a login
  ↓
✅ Sesión persistida
```

### 4️⃣ Token Expira (Futuro - Example 7)

```
Hace request con accessToken viejo
  ↓
API retorna 401 Unauthorized
  ↓
fetchWithAuth detecta 401:
  - POST /auth/refresh {refreshToken}
  - Obtiene nuevo accessToken
  - Reintenta request original
  - Si refreshToken también expiró → logout
```

---

## 🛠️ Cómo Usar en Tu Código

### En una Página:
```javascript
import { useAuth } from '../contexts/AuthContext'

export default function MyPage() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) return <Loading />
  if (!user) return null  // ProtectedRoute lo maneja

  return (
    <div>
      <p>Bienvenido, {user.firstName}</p>
      <p>Tu rol: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### En AppLayout/Navbar:
```javascript
import AuthBadge from '../components/common/AuthBadge'

export default function AppLayout() {
  return (
    <nav>
      {/* otras cosas */}
      <AuthBadge />  {/* Muestra usuario + logout */}
    </nav>
  )
}
```

---

## 🔒 Seguridad Explicada

### ¿Dónde viven los tokens?

| Token | Ubicación | Por qué | Riesgo |
|-------|-----------|--------|--------|
| **accessToken** | React state (memory) | Baja latencia + expira al cerrar tab | XSS = token perdido (es OK, expira pronto) |
| **refreshToken** | localStorage | Persiste reload | XSS = token robado (attack más serio) |

### En Producción:
- ✅ Ambos tokens en **httpOnly cookies** (seteadas por tu backend)
- ✅ Browser no puede leerlos (protección XSS)
- ✅ Se envían automáticamente en cada request
- ⚠️ Requiere backend que controles (no aplica a dummyjson público)

### Defensa contra XSS:
1. **CSP** (Content Security Policy) headers
2. **Sanitize** todo input de usuario
3. **httpOnly cookies** en producción
4. **nunca** hacer `eval()` o `innerHTML` con input del usuario

---

## 🚀 Próximos Pasos (Opcionales)

### Example 6: Server-Verified Identity
```javascript
// Verificar sesión es real haciendo GET /auth/me
const response = await getMe(accessToken)
```

### Example 7: Refresh-on-401
```javascript
// Crear apiClient.js con fetchWithAuth
export async function fetchWithAuth(url, init) {
  let res = await fetch(url, ...)
  if (res.status === 401) {
    // POST /auth/refresh → nuevo token
    // Reintentar request original
  }
  return res
}
```

### Cambiar a Backend Real
Reemplazar solo `src/services/authApi.js`:

**Option A - Laravel Sanctum (cookies, same-origin):**
```javascript
export async function login({ email, password }) {
  // GET /sanctum/csrf-cookie (para CSRF)
  // POST /login
}
```

**Option B - Firebase:**
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth'
export const login = ({email, password}) => 
  signInWithEmailAndPassword(auth, email, password)
```

El resto del código (AuthContext, ProtectedRoute, etc.) **no cambia**.

---

## 📝 Testing

### Probar Login:
```bash
1. En browser: http://localhost:5173
2. Username: emilys
3. Password: emilyspass
4. Click "Sign in"
5. Debería redirigir a /dashboard
```

### Probar Persistencia:
```bash
1. Loguea
2. Abre DevTools → Application → Local Storage
3. Verás: gca.refreshToken = "..."
4. Refresca página (Cmd+R)
5. Debería mantener sesión (sin redirigir a /login)
```

### Probar Logout:
```bash
1. En navbar: click en "logout" (en AuthBadge)
2. Debería redirigir a /
3. DevTools → Local Storage: gca.refreshToken desapareció
```

### Probar Credenciales Inválidas:
```bash
1. Username: emilys
2. Password: WRONG
3. Debería mostrar: "❌ Invalid credentials"
```

---

## 📚 Documentación Vinculada

- [JWT Security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [dummyjson Auth Docs](https://dummyjson.com/docs/auth)
- [React Router Navigate](https://reactrouter.com/api/components/Navigate)
- [localStorage Security](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Última actualización:** Mayo 2026  
**Versión:** 1.0.0 (Auth Real)
