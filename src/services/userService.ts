import { api, csrf } from './api'

type Id = string | number

export const userService = {
  async updateAccount(data: Record<string, unknown>) {
    await csrf()
    return api.post('api/update_user', data)
  },

  async updateLanguage(language: string) {
    await csrf()
    return api.post('api/update-language', { preferred_language: language })
  },

  async sendFaq(messageObj: string, messageDesc: string) {
    await csrf()
    return api.post('api/new-faq', { message_obj: messageObj, message_desc: messageDesc })
  },

  async deleteAccount(userId: Id) {
    await csrf()
    return api.delete(`api/delete_users/${userId}`)
  },
}
