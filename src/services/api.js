import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
})

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const { useAuthStore } = await import('@/stores/authStore')
      const { useMessageStore } = await import('@/stores/messageStore')
      const authStore = useAuthStore()
      authStore.clearUser()
      const messageStore = useMessageStore()
      messageStore.setMessage('Session expired. Please login again.')
      const { default: router } = await import('@/router')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

async function csrf() {
  await api.get('sanctum/csrf-cookie')
}

export { api, csrf }
