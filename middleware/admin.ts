
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  const messageStore = useMessageStore()

  await authStore.initializeAuth()

  if (!authStore.isAuthenticated) {
    messageStore.setMessage('To access this page you have to be logged in.')
    return navigateTo('/login')
  }

  if (!authStore.isAdmin) {
    messageStore.setMessage('You must be an admin to access this page.')
    return navigateTo('/login')
  }
})
