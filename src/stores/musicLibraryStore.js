import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { musicService } from '@/services/musicService.js'

/**
 * Single source of truth for the user's Jamendo music library:
 * favorites + playlists. Hydrated lazily on first use after login,
 * then kept in sync optimistically by add/remove actions so every
 * heart icon and playlist menu in the app reflects the same state
 * without re-fetching.
 */
export const useMusicLibraryStore = defineStore('musicLibrary', () => {
  // ---- Favorites ------------------------------------------------------
  const favorites = ref([])              // full track rows from backend
  const favoriteIds = ref(new Set())     // Set<string> of jamendo_track_id for O(1) check
  const favoritesLoaded = ref(false)
  const favoritesLoading = ref(false)

  // ---- Playlists ------------------------------------------------------
  const playlists = ref([])              // [{id, name, description, tracks_count?}]
  const playlistsLoaded = ref(false)
  const playlistsLoading = ref(false)

  // ---- Derived --------------------------------------------------------
  const favoritesCount = computed(() => favorites.value.length)
  const playlistsCount = computed(() => playlists.value.length)

  function isFavorite(trackId) {
    return favoriteIds.value.has(String(trackId))
  }

  // ---- Favorites actions ---------------------------------------------
  async function loadFavorites(force = false) {
    if (favoritesLoading.value) return
    if (favoritesLoaded.value && !force) return
    favoritesLoading.value = true
    try {
      const { data } = await musicService.getFavorites()
      const list = Array.isArray(data) ? data : (data?.data ?? data?.results ?? [])
      favorites.value = list
      favoriteIds.value = new Set(list.map(f => String(f.jamendo_track_id)))
      favoritesLoaded.value = true
    } catch (err) {
      console.error('Failed to load music favorites:', err)
    } finally {
      favoritesLoading.value = false
    }
  }

  /**
   * Adds a Jamendo track to favorites. `track` is the raw Jamendo
   * shape (track.id, track.name, track.artist_name, ...) — we map
   * it to the backend column names here.
   */
  async function addFavorite(track) {
    const id = String(track.id ?? track.jamendo_track_id)
    if (favoriteIds.value.has(id)) return
    // Optimistic
    favoriteIds.value.add(id)
    const optimisticRow = {
      jamendo_track_id: id,
      title: track.name ?? track.title,
      artist_name: track.artist_name,
      artist_id: track.artist_id,
      album_name: track.album_name,
      album_image: track.album_image,
      audio_url: track.audio ?? track.audio_url,
      duration: track.duration,
      license_ccurl: track.license_ccurl,
      shareurl: track.shareurl,
      _optimistic: true,
    }
    favorites.value = [optimisticRow, ...favorites.value]

    try {
      const { data } = await musicService.addFavorite({
        jamendo_track_id: id,
        title: optimisticRow.title,
        artist_name: optimisticRow.artist_name,
        artist_id: optimisticRow.artist_id,
        album_name: optimisticRow.album_name,
        album_image: optimisticRow.album_image,
        audio_url: optimisticRow.audio_url,
        duration: optimisticRow.duration,
        license_ccurl: optimisticRow.license_ccurl,
        shareurl: optimisticRow.shareurl,
      })
      // Replace optimistic row with the real one if backend returns it
      const real = data?.data ?? data
      if (real && real.jamendo_track_id) {
        favorites.value = favorites.value.map(f =>
          f.jamendo_track_id === id && f._optimistic ? real : f
        )
      }
    } catch (err) {
      // Rollback
      favoriteIds.value.delete(id)
      favorites.value = favorites.value.filter(f => f.jamendo_track_id !== id)
      throw err
    }
  }

  async function removeFavorite(trackId) {
    const id = String(trackId)
    if (!favoriteIds.value.has(id)) return
    const previous = favorites.value
    // Optimistic
    favoriteIds.value.delete(id)
    favorites.value = favorites.value.filter(f => String(f.jamendo_track_id) !== id)

    try {
      await musicService.removeFavorite(id)
    } catch (err) {
      // Rollback
      favoriteIds.value.add(id)
      favorites.value = previous
      throw err
    }
  }

  async function toggleFavorite(track) {
    const id = String(track.id ?? track.jamendo_track_id)
    if (favoriteIds.value.has(id)) {
      await removeFavorite(id)
      return false
    }
    await addFavorite(track)
    return true
  }

  // ---- Playlists actions ---------------------------------------------
  async function loadPlaylists(force = false) {
    if (playlistsLoading.value) return
    if (playlistsLoaded.value && !force) return
    playlistsLoading.value = true
    try {
      const { data } = await musicService.getPlaylists()
      const list = Array.isArray(data) ? data : (data?.data ?? data?.results ?? [])
      playlists.value = list
      playlistsLoaded.value = true
    } catch (err) {
      console.error('Failed to load music playlists:', err)
    } finally {
      playlistsLoading.value = false
    }
  }

  async function createPlaylist(name, description = '') {
    const trimmed = (name || '').trim()
    if (!trimmed) throw new Error('Playlist name is required')
    const { data } = await musicService.createPlaylist({ name: trimmed, description })
    const created = data?.data ?? data
    playlists.value = [created, ...playlists.value]
    return created
  }

  async function renamePlaylist(id, name, description) {
    const { data } = await musicService.updatePlaylist(id, { name, description })
    const updated = data?.data ?? data
    playlists.value = playlists.value.map(p =>
      String(p.id) === String(id) ? { ...p, ...updated } : p
    )
    return updated
  }

  async function deletePlaylist(id) {
    const previous = playlists.value
    playlists.value = playlists.value.filter(p => String(p.id) !== String(id))
    try {
      await musicService.deletePlaylist(id)
    } catch (err) {
      playlists.value = previous
      throw err
    }
  }

  async function addTrackToPlaylist(playlistId, track) {
    await musicService.addTrackToPlaylist(playlistId, {
      jamendo_track_id: String(track.id ?? track.jamendo_track_id),
      title: track.name ?? track.title,
      artist_name: track.artist_name,
      artist_id: track.artist_id,
      album_image: track.album_image,
      audio_url: track.audio ?? track.audio_url,
      duration: track.duration,
      license_ccurl: track.license_ccurl,
    })
    // Bump local tracks_count if backend exposes it
    playlists.value = playlists.value.map(p =>
      String(p.id) === String(playlistId)
        ? { ...p, tracks_count: (p.tracks_count ?? 0) + 1 }
        : p
    )
  }

  async function removeTrackFromPlaylist(playlistId, trackId) {
    await musicService.removeTrackFromPlaylist(playlistId, trackId)
    playlists.value = playlists.value.map(p =>
      String(p.id) === String(playlistId)
        ? { ...p, tracks_count: Math.max(0, (p.tracks_count ?? 1) - 1) }
        : p
    )
  }

  // ---- Reset (logout) ------------------------------------------------
  function reset() {
    favorites.value = []
    favoriteIds.value = new Set()
    favoritesLoaded.value = false
    playlists.value = []
    playlistsLoaded.value = false
  }

  return {
    // state
    favorites,
    favoriteIds,
    favoritesLoaded,
    favoritesLoading,
    playlists,
    playlistsLoaded,
    playlistsLoading,
    // getters
    favoritesCount,
    playlistsCount,
    isFavorite,
    // favorites actions
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    // playlists actions
    loadPlaylists,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    // misc
    reset,
  }
})
