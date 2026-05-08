import { api, csrf } from './api'

type Id = string | number

export const podcastService = {
  getCategories() {
    return api.get('api/feed-cat')
  },

  getTrending() {
    return api.get('api/index')
  },

  getFeedInfo(feedId: Id) {
    return api.get(`api/feed_info/${feedId}`)
  },

  getEpisodes(feedId: Id) {
    return api.get(`api/search_feed/${feedId}`)
  },

  getEpisode(episodeId: Id) {
    return api.get(`api/search_episode/${episodeId}`)
  },

  searchByTitle(title: string) {
    return api.get(`api/search-feed-by-title/${title}`)
  },

  searchByCategory(categoryId: Id) {
    return api.get(`api/search-feeds-by-cat/${categoryId}`)
  },

  async addFavorite(feedId: Id, title: string) {
    await csrf()
    return api.post('api/add-favorite', { feed_id: feedId, title })
  },

  async deleteFavorite(feedId: Id) {
    await csrf()
    return api.post('api/delete-favorite', { feed_id: feedId })
  },

  async getFavorites() {
    await csrf()
    return api.get('api/user-favorites')
  },

  async updateFavoriteSection(favoriteId: Id, section: string | null) {
    await csrf()
    return api.post(`api/favorites/${favoriteId}/update-section`, { section })
  },

  async addBookmark(episodeId: Id, title: string) {
    await csrf()
    return api.post('api/add-bookmark', { episode_id: episodeId, title })
  },

  async deleteBookmark(episodeId: Id) {
    await csrf()
    return api.post('api/delete-bookmark', { episode_id: episodeId })
  },

  async getBookmarks() {
    await csrf()
    return api.get('api/user-bookmarks')
  },

  async updateBookmarkSection(bookmarkId: Id, section: string | null) {
    await csrf()
    return api.post(`api/bookmarks/${bookmarkId}/update-section`, { section })
  },

  async trackPlay(episodeId: Id, episodeTitle: string) {
    await csrf()
    return api.post('api/add_play_click', { episode_id: episodeId, episode_title: episodeTitle })
  },

  async trackDownload(episodeId: Id, episodeTitle: string) {
    await csrf()
    return api.post('api/add_download_click', { episode_id: episodeId, episode_title: episodeTitle })
  },
}
