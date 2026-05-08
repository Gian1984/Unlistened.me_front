import { api } from './api'

type Id = string | number

export const historyService = {
  getHistory: () => api.get('api/history'),
  upsert: (entry: Record<string, unknown>) => api.post('api/history', entry),
  remove: (id: Id) => api.delete(`api/history/${id}`),
  clear: () => api.delete('api/history'),
}
