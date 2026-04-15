import axios from 'axios'
import { handleUnauthorized } from '~/src/services/sessionHandler'

const api = axios.create({
  baseURL: 'https://api.unlistened.me',
  withCredentials: true,
  withXSRFToken: true,
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      handleUnauthorized(error)
    }
    return Promise.reject(error)
  }
)

async function csrf() {
  await api.get('sanctum/csrf-cookie')
}

export { api, csrf }