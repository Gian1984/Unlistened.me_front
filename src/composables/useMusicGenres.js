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
  if (pendingRequest) return pendingRequest

  pendingRequest = musicService.getRadios()
    .then((response) => {
      const normalized = normalizeMusicGenres(response?.data)
      cachedGenres = normalized.length ? normalized : FALLBACK_GENRES
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
