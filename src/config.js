const devFallbackApiBaseUrl = 'http://localhost:8010'
const dockerFallbackApiBaseUrl = '/api'

// In local Vite dev we call the backend directly; in Docker/nginx the browser
// calls the frontend's own domain and nginx proxies /api to the backend.
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? devFallbackApiBaseUrl : dockerFallbackApiBaseUrl))
    .replace(/\/$/, '')
