import { api } from './api'

type Id = string | number

// History sync is a best-effort enhancement for authenticated users; if the
// session has expired mid-listen, surfacing the 401 to the global redirect
// handler would yank the listener out of the app while audio is playing.
// All history endpoints opt out of the redirect; the caller already guards
// with authStore.isAuthenticated before invoking them.
const cfg = { skipAuthRedirect: true }

export const historyService = {
  getHistory: () => api.get('api/history', cfg),
  upsert: (entry: Record<string, unknown>) => api.post('api/history', entry, cfg),
  remove: (id: Id) => api.delete(`api/history/${id}`, cfg),
  clear: () => api.delete('api/history', cfg),
}
