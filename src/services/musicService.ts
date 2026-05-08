import { api } from './api'

type Id = string | number

export const musicService = {
  // Public — no auth required
  getTrending: (limit: number = 20, genre: string = '', offset: number = 0) =>
    api.get('api/music/trending', { params: { limit, genre, offset } }),
  search: (q: string, genre: string = '', offset: number = 0) =>
    api.get('api/music/search', { params: { q, genre, offset } }),
  getAlbums: (params: Record<string, unknown> = {}) =>
    api.get('api/music/albums', { params }),
  getTrack: (id: Id) => api.get(`api/music/track/${id}`),
  getSimilar: (id: Id) => api.get(`api/music/similar/${id}`),
  getAlbum: (id: Id) => api.get(`api/music/album/${id}`),
  getArtist: (id: Id) => api.get(`api/music/artist/${id}`),
  getRadios: () => api.get('api/music/radios'),

  // Favorites — Sanctum auth required
  getFavorites: () => api.get('api/music/favorites'),
  addFavorite: (track: Record<string, unknown>) => api.post('api/music/favorites', track),
  removeFavorite: (trackId: Id) => api.delete(`api/music/favorites/${trackId}`),
  checkFavorite: (trackId: Id) => api.get(`api/music/favorites/check/${trackId}`),
  reorderFavorites: (tracks: unknown[]) => api.put('api/music/favorites/reorder', { tracks }),

  // Playlists — Sanctum auth required
  getPlaylists: () => api.get('api/music/playlists'),
  createPlaylist: (data: Record<string, unknown>) => api.post('api/music/playlists', data),
  getPlaylist: (id: Id) => api.get(`api/music/playlists/${id}`),
  updatePlaylist: (id: Id, data: Record<string, unknown>) => api.put(`api/music/playlists/${id}`, data),
  deletePlaylist: (id: Id) => api.delete(`api/music/playlists/${id}`),
  addTrackToPlaylist: (id: Id, track: Record<string, unknown>) =>
    api.post(`api/music/playlists/${id}/tracks`, track),
  removeTrackFromPlaylist: (id: Id, trackId: Id) =>
    api.delete(`api/music/playlists/${id}/tracks/${trackId}`),
  reorderPlaylist: (id: Id, tracks: unknown[]) =>
    api.put(`api/music/playlists/${id}/reorder`, { tracks }),
}
