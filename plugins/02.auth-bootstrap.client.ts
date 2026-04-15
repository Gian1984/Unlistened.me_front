import { registerUnauthorizedHandler } from '@/services/sessionHandler'
import { useAuthStore } from '@/stores/authStore'
import { useMessageStore } from '@/stores/messageStore'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const messageStore = useMessageStore()
  const router = useRouter()

  registerUnauthorizedHandler(() => {
    authStore.clearUser()
    messageStore.setMessage('Session expired. Please login again.')

    if (router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  })

  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }
})
