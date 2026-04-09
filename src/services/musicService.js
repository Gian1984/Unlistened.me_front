import { api } from './api'

export const musicService = {
  // Public — no auth required
  getTrending: (limit = 20, genre = '')   => api.get('api/music/trending', { params: { limit, genre } }),
  search: (q, genre = '', offset = 0)     => api.get('api/music/search',   { params: { q, genre, offset } }),
  getTrack: (id)                          => api.get(`api/music/track/${id}`),
  getSimilar: (id)                        => api.get(`api/music/similar/${id}`),
  getAlbum: (id)                          => api.get(`api/music/album/${id}`),
  getArtist: (id)                         => api.get(`api/music/artist/${id}`),
  getRadios: ()                           => api.get('api/music/radios'),

  // Favorites — Sanctum auth required
  getFavorites: ()                        => api.get('api/music/favorites'),
  addFavorite: (track)                    => api.post('api/music/favorites', track),
  removeFavorite: (trackId)               => api.delete(`api/music/favorites/${trackId}`),
  checkFavorite: (trackId)                => api.get(`api/music/favorites/check/${trackId}`),

  // Playlists — Sanctum auth required
  getPlaylists: ()                        => api.get('api/music/playlists'),
  createPlaylist: (data)                  => api.post('api/music/playlists', data),
  getPlaylist: (id)                       => api.get(`api/music/playlists/${id}`),
  updatePlaylist: (id, data)              => api.put(`api/music/playlists/${id}`, data),
  deletePlaylist: (id)                    => api.delete(`api/music/playlists/${id}`),
  addTrackToPlaylist: (id, track)         => api.post(`api/music/playlists/${id}/tracks`, track),
  removeTrackFromPlaylist: (id, trackId)  => api.delete(`api/music/playlists/${id}/tracks/${trackId}`),
  reorderPlaylist: (id, tracks)           => api.put(`api/music/playlists/${id}/reorder`, { tracks }),
}
