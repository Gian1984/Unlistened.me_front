
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  await authStore.initializeAuth()

  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
