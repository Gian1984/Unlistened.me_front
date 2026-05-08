import { api } from '@/services/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const url = config.public.apiBaseUrl
  if (url) {
    api.defaults.baseURL = String(url).replace(/\/+$/, '')
  }
})
