import { useAuthStore } from '@/stores/authStore'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  await authStore.initializeAuth()

  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
