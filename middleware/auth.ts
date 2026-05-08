
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  const messageStore = useMessageStore()

  // Only call if not initialized to avoid double calls with the plugin
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  if (!authStore.isAuthenticated) {
    messageStore.setMessage('To access this page you have to be logged in.')
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
