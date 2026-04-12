import { ref } from 'vue'
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

function titleizeGenre(tag) {
  return String(tag)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => {
      if (part.toLowerCase() === 'rnb') return 'R&B'
      if (part.toLowerCase() === 'lofi') return 'Lo-fi'
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

function normalizeMusicGenres(payload) {
  const rows = Array.isArray(payload)
    ? payload
    : payload?.results ?? payload?.data ?? []

  if (!Array.isArray(rows)) return []

  const seen = new Set()

  return rows
    .map((row) => {
      const tag = String(row?.name ?? row?.tag ?? '').trim().toLowerCase()
      if (!tag || tag === 'bestof') return null

      const rawLabel = String(row?.dispname ?? row?.label ?? row?.name ?? '').trim()
      const label = rawLabel.replace(/\s+radio$/i, '').trim()
      if (!label) return null

      if (seen.has(tag)) return null
      seen.add(tag)

      return { tag, label }
    })
    .filter(Boolean)
}

async function fetchMusicGenres() {
  if (cachedGenres) return cachedGenres

  cachedGenres = normalizeMusicGenres([])
  return cachedGenres
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
