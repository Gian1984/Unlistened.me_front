import { ref } from 'vue'
import { musicService } from '@/services/musicService.js'
const FALLBACK_GENRES = [
  { label: 'Electronic', tag: 'electronic' },
  { label: 'Ambient', tag: 'ambient' },
  { label: 'Jazz', tag: 'jazz' },
  { label: 'Classical', tag: 'classical' },
  { label: 'Rock', tag: 'rock' },
  { label: 'Hip Hop', tag: 'hiphop' },
  { label: 'Folk', tag: 'folk' },
  { label: 'Lo-fi', tag: 'lounge' },
  { label: 'World', tag: 'world' },
  { label: 'Cinematic', tag: 'soundtrack' },
  { label: 'Pop', tag: 'pop' },
  { label: 'Metal', tag: 'metal' },
  { label: 'R&B', tag: 'rnb' },
  { label: 'Reggae', tag: 'reggae' },
  { label: 'Latin', tag: 'latin' },
  { label: 'Country', tag: 'country' },
]

let cachedGenres = null
let pendingRequest = null

const GENRE_LABEL_MAP = {
  afrobeat: 'Afrobeat',
  chillhop: 'Chillhop',
  cinematic: 'Cinematic',
  classical: 'Classical',
  electronic: 'Electronic',
  folk: 'Folk',
  hiphop: 'Hip Hop',
  jazz: 'Jazz',
  latin: 'Latin',
  lofi: 'Lo-fi',
  lounge: 'Lo-fi',
  metal: 'Metal',
  newage: 'New Age',
  pop: 'Pop',
  rnb: 'R&B',
  reggae: 'Reggae',
  rock: 'Rock',
  soundtrack: 'Cinematic',
  world: 'World',
}

function titleizeGenre(tag) {
  const normalized = String(tag).trim().toLowerCase()
  if (GENRE_LABEL_MAP[normalized]) return GENRE_LABEL_MAP[normalized]

  return normalized
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => {
      if (part.toLowerCase() === 'rnb') return 'R&B'
      if (part.toLowerCase() === 'lofi') return 'Lo-fi'
      if (part.toLowerCase() === 'hiphop') return 'Hip Hop'
      if (part.toLowerCase() === 'newage') return 'New Age'
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(' ')
}

export function extractGenresFromTracks(tracks) {
  const rows = Array.isArray(tracks) ? tracks : []
  const seen = new Set()

  const extracted = rows
    .flatMap((track) => track?.musicinfo?.tags?.genres ?? [])
    .map((genre) => String(genre || '').trim().toLowerCase())
    .filter(Boolean)
    .filter((genre) => {
      if (seen.has(genre)) return false
      seen.add(genre)
      return true
    })
    .map((genre) => ({
      tag: genre,
      label: titleizeGenre(genre),
    }))

  return extracted.length ? extracted : FALLBACK_GENRES
}

export function seedMusicGenresFromTracks(tracks) {
  cachedGenres = extractGenresFromTracks(tracks)
  return cachedGenres
}

async function fetchMusicGenres() {
  if (cachedGenres) return cachedGenres
  if (pendingRequest) return pendingRequest

  pendingRequest = musicService.getTrending(30)
    .then((response) => {
      cachedGenres = extractGenresFromTracks(response?.data?.results ?? [])
      return cachedGenres
    })
    .catch(() => {
      cachedGenres = FALLBACK_GENRES
      return cachedGenres
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

export function useMusicGenres(options = {}) {
  const includeTrending = options.includeTrending === true
  const loading = ref(false)
  const genres = ref(
    includeTrending
      ? [{ label: 'Trending', tag: '' }, ...(cachedGenres || FALLBACK_GENRES)]
      : (cachedGenres || FALLBACK_GENRES)
  )

  async function loadGenres() {
    loading.value = true
    const resolved = await fetchMusicGenres()
    genres.value = includeTrending
      ? [{ label: 'Trending', tag: '' }, ...resolved]
      : resolved
    loading.value = false
    return genres.value
  }

  return {
    genres,
    loading,
    loadGenres,
  }
}
