import { useAuthStore } from '@/stores/authStore'
import { useMessageStore } from '@/stores/messageStore'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  const messageStore = useMessageStore()

  await authStore.initializeAuth()

  if (!authStore.isAuthenticated) {
    messageStore.setMessage('To access this page you have to be logged in.')
    return navigateTo('/login')
  }
})
