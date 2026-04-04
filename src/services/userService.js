import { api, csrf } from './api'

export const userService = {
  async updateAccount(data) {
    await csrf()
    return api.post('api/update_user', data)
  },

  async updateLanguage(language) {
    await csrf()
    return api.post('api/update-language', { preferred_language: language })
  },

  async sendFaq(messageObj, messageDesc) {
    await csrf()
    return api.post('api/new-faq', { message_obj: messageObj, message_desc: messageDesc })
  },

  async deleteAccount(userId) {
    await csrf()
    return api.delete(`api/delete_users/${userId}`)
  },
}
