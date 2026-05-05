// src/services/tokenStorage.js
// Single point of truth for token persistence.
// In production, the refreshToken belongs in an httpOnly cookie set by your backend.
// We use localStorage here because we're using a public API without backend control.
// Centralising storage here means switching to cookies later is a one-file change.

const REFRESH_KEY = 'gca.refreshToken'

export const tokenStorage = {
  getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY)
  },
  setRefreshToken(token) {
    localStorage.setItem(REFRESH_KEY, token)
  },
  clear() {
    localStorage.removeItem(REFRESH_KEY)
  },
}
