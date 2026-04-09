import api from './api.js'

export const musicService = {
  // Public — no auth required
  getTrending: (limit = 20, genre = '')  => api.get('/music/trending', { params: { limit, genre } }),
  search: (q, genre = '', offset = 0)    => api.get('/music/search',   { params: { q, genre, offset } }),
  getTrack: (id)                          => api.get(`/music/track/${id}`),
  getSimilar: (id)                        => api.get(`/music/track/${id}/similar`),
  getAlbum: (id)                          => api.get(`/music/album/${id}`),
  getArtist: (id)                         => api.get(`/music/artist/${id}`),
  getRadios: ()                           => api.get('/music/radios'),

  // Favorites — Sanctum auth required
  getFavorites: ()                        => api.get('/music/favorites'),
  addFavorite: (track)                    => api.post('/music/favorites', track),
  removeFavorite: (trackId)               => api.delete(`/music/favorites/${trackId}`),
  checkFavorite: (trackId)               => api.get(`/music/favorites/${trackId}/check`),

  // Playlists — Sanctum auth required
  getPlaylists: ()                        => api.get('/music/playlists'),
  createPlaylist: (data)                  => api.post('/music/playlists', data),
  getPlaylist: (id)                       => api.get(`/music/playlists/${id}`),
  updatePlaylist: (id, data)              => api.put(`/music/playlists/${id}`, data),
  deletePlaylist: (id)                    => api.delete(`/music/playlists/${id}`),
  addTrackToPlaylist: (id, track)         => api.post(`/music/playlists/${id}/tracks`, track),
  removeTrackFromPlaylist: (id, trackId)  => api.delete(`/music/playlists/${id}/tracks/${trackId}`),
  reorderPlaylist: (id, tracks)           => api.put(`/music/playlists/${id}/reorder`, { tracks }),
}
