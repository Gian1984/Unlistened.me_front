import { registerUnauthorizedHandler } from '@/services/sessionHandler'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const messageStore = useMessageStore()
  const router = useRouter()

  registerUnauthorizedHandler(() => {
    // Only redirect if we are not already on login/signup/forgot-password
    const publicAuthRoutes = ['/login', '/signup', '/forgot_password', '/reset_password']
    const isPublicRoute = publicAuthRoutes.some(path => router.currentRoute.value.path.startsWith(path))

    authStore.clearUser()
    
    if (!isPublicRoute) {
      messageStore.setMessage('Session expired. Please login again.')
      router.push('/login')
    }
  })

  // Start initialization but don't necessarily await it here if we want 
  // the app to render the shell immediately.
  // However, for Nuxt, awaiting here ensures that the first page 
  // loaded (even if public) knows if the user is logged in.
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  if (authStore.isAuthenticated) {
    const historyStore = useHistoryStore()
    historyStore.loadFromAPI()
  }
})
