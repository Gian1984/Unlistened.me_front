import { api, csrf } from './api'

export const authService = {
  async login(email, password) {
    await csrf()
    return api.post('api/login', { email, password })
  },

  async register(name, email, password) {
    await csrf()
    return api.post('api/register', { name, email, password })
  },

  async logout() {
    await csrf()
    return api.post('api/logout')
  },

  async forgotPassword(email) {
    await csrf()
    return api.post('api/forgot-password', { email })
  },

  async resetPassword(email, password, password_confirmation, token) {
    await csrf()
    return api.post('api/reset-password', { email, password, password_confirmation, token })
  },

  async detectLanguage(language) {
    await csrf()
    return api.post('api/detect-language', { language })
  },
}
