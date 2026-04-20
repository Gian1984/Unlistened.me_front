import { api } from './api'

export const historyService = {
  getHistory: ()         => api.get('api/history'),
  upsert:     (entry)    => api.post('api/history', entry),
  remove:     (id)       => api.delete(`api/history/${id}`),
  clear:      ()         => api.delete('api/history'),
}
