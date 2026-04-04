import { api, csrf } from './api'

export const adminService = {
  async getStats() {
    await csrf()
    return api.get('api/get_stats')
  },

  async getFaqs() {
    await csrf()
    return api.get('api/faqs')
  },

  async updateFaqStatus(faqId, wasAnswered) {
    await csrf()
    return api.post('api/update-faq-status', { faq_id: faqId, was_answered: wasAnswered })
  },

  async deleteFaq(id) {
    await csrf()
    return api.delete(`api/delete_faq/${id}`)
  },

  async getUsers() {
    await csrf()
    return api.get('api/users')
  },

  async updateAdminStatus(userId, isAdmin) {
    await csrf()
    return api.post('api/update-status', { user_id: userId, is_admin: isAdmin })
  },

  async deleteUser(id) {
    await csrf()
    return api.delete(`api/delete_users/${id}`)
  },
}
