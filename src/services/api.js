import axios from 'axios'
import { handleUnauthorized } from '~/src/services/sessionHandler'

// baseURL is set at runtime by plugins/00.api-config.ts from runtimeConfig.public.apiBaseUrl
// (driven by the NUXT_PUBLIC_API_BASE_URL env var). The literal here is a last-resort
// fallback in case the plugin hasn't run (e.g. unit tests).
const api = axios.create({
  baseURL: 'https://api.unlistened.me',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      handleUnauthorized(error)
    }
    return Promise.reject(error)
  }
)

async function csrf() {
  await api.get('sanctum/csrf-cookie')
}

export { api, csrf }