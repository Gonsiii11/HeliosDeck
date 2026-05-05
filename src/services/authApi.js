// src/services/authApi.js
// All auth-related network calls live here. Components and the AuthContext
// import these functions — never call fetch() directly from a component.
//
// Returns parsed JSON or throws an Error with the server's message when present.
//
// dummyjson.com/auth endpoints:
//   POST /auth/login      → { accessToken, refreshToken, user data... }
//   GET  /auth/me         → { full user profile including role }
//   POST /auth/refresh    → { accessToken, refreshToken }

const BASE = 'https://dummyjson.com/auth'

async function parseOrThrow(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    // dummyjson returns { message: '...' } on errors
    throw new Error(data.message || `HTTP ${res.status}`)
  }
  return data
}

export async function login({ username, password }) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
  })
  return parseOrThrow(res)
  // → { id, username, email, firstName, lastName, image, accessToken, refreshToken }
  // NOTE: `role` is NOT in this response — call getMe() for the full profile.
}

export async function getMe(accessToken) {
  const res = await fetch(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return parseOrThrow(res) // → user object (no tokens)
}

export async function refresh(refreshToken) {
  const res = await fetch(`${BASE}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
  })
  return parseOrThrow(res) // → { accessToken, refreshToken }
}
