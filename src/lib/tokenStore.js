// Access tokens live in memory only — never localStorage/sessionStorage.
// This is what keeps them safe from XSS (unlike the refresh token, which is
// an httpOnly cookie the JS layer can't touch at all). Cost: a hard page
// reload loses the access token, which is why AuthContext calls
// POST /api/auth/refresh on mount to mint a new one from the cookie.

let accessToken = null;
let onAuthFailure = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

// Registered by AuthContext so the axios response interceptor (which lives
// outside React) can drop the app back to a logged-out state when a refresh
// attempt fails mid-session (e.g. refresh token expired or was revoked).
export function setOnAuthFailure(callback) {
  onAuthFailure = callback;
}

export function notifyAuthFailure() {
  if (onAuthFailure) onAuthFailure();
}
