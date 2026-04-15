import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const api = axios.create({
    baseURL: config.public.apiBaseUrl || 'https://www.unlistened.me',
    withCredentials: true,
    withXSRFToken: true,
  })

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
        const { handleUnauthorized } = await import('~/src/services/sessionHandler')
        handleUnauthorized(error)
      }
      return Promise.reject(error)
    }
  )

  async function csrf() {
    await api.get('sanctum/csrf-cookie')
  }

  return {
    provide: {
      api,
      csrf,
    }
  }
})