import { api, csrf } from './api'

export const authService = {
  async currentUser() {
    try {
      return await api.get('api/user', { skipAuthRedirect: true })
    } catch (error: any) {
      if (error.response?.status !== 404) throw error
    }

    return api.get('user', { skipAuthRedirect: true })
  },

  async login(email: string, password: string) {
    await csrf()
    return api.post('api/login', { email, password })
  },

  async register(name: string, email: string, password: string) {
    await csrf()
    return api.post('api/register', { name, email, password })
  },

  async logout() {
    await csrf()
    return api.post('api/logout')
  },

  async forgotPassword(email: string) {
    await csrf()
    return api.post('api/forgot-password', { email })
  },

  async resetPassword(email: string, password: string, password_confirmation: string, token: string) {
    await csrf()
    return api.post('api/reset-password', { email, password, password_confirmation, token })
  },

  async detectLanguage(language: string) {
    await csrf()
    return api.post('api/detect-language', { language })
  },
}
