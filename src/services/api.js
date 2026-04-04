import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useMessageStore } from '@/stores/messageStore'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.clearUser()
      const messageStore = useMessageStore()
      messageStore.updateMessage('Session expired. Please login again.')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

async function csrf() {
  await api.get('sanctum/csrf-cookie')
}

export { api, csrf }
