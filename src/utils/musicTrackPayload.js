/**
 * Shape adapters for the Jamendo music side of the player.
 *
 * The player (OffcanvasPlayer + playerStore) consumes a single
 * normalized "podcast-style" payload regardless of content type.
 * Music tracks come from two different shapes:
 *
 *   1. Raw Jamendo API tracks (track.id, track.name, track.audio, ...)
 *   2. Backend rows from `music_favorites` / `music_playlist_tracks`
 *      (jamendo_track_id, title, audio_url, ...)
 *
 * Centralizing the mapping here means every view that plays music
 * agrees on the field names and contentType. Update once, not five
 * times.
 */

export function jamendoToPlayerPayload(track) {
  return {
    contentType: 'music',
    id: track.id,
    title: track.name,
    enclosureUrl: track.audio,
    image: track.album_image,
    feedTitle: track.artist_name,
    artistId: track.artist_id,
    albumId: track.album_id,
    albumName: track.album_name,
    licenseUrl: track.license_ccurl,
    shareUrl: track.shareurl,
    duration: track.duration,
  }
}

export function backendRowToPlayerPayload(row) {
  return {
    contentType: 'music',
    id: row.jamendo_track_id,
    title: row.title,
    enclosureUrl: row.audio_url,
    image: row.album_image,
    feedTitle: row.artist_name,
    artistId: row.artist_id,
    albumId: row.album_id,
    albumName: row.album_name,
    licenseUrl: row.license_ccurl,
    shareUrl: row.shareurl,
    duration: row.duration,
  }
}
