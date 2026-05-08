<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { musicService } from '@/services/musicService.js'
import MusicTrackRow from '@/components/music/MusicTrackRow.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'
import PageHero from '@/components/PageHero.vue'
import { MusicalNoteIcon } from '@heroicons/vue/24/outline'
import { jamendoToPlayerPayload } from '@/utils/musicTrackPayload.js'
import { getSafeSessionStorage } from '@/utils/browserStorage.js'
import { seedMusicGenresFromTracks, useMusicGenres } from '@/composables/useMusicGenres.js'
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo('musicSingles')

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const historyStore = useHistoryStore()
const authStore = useAuthStore()
const library = useMusicLibraryStore()

const tracks = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const activeGenre = ref('')
const offset = ref(0)
const hasMore = ref(true)
const TRENDING_PAGE_SIZE = 30
const GENRE_PAGE_SIZE = 20
const { genres, loadGenres } = useMusicGenres({ includeTrending: true })
const STORAGE_KEY = 'unlistened:music-singles-view'

const continueListeningMusic = computed(() => historyStore.continueListeningMusic)

function restoreState() {
  try {
    const raw = getSafeSessionStorage().getItem(STORAGE_KEY)
    if (!raw) return false

    const saved = JSON.parse(raw)
    const currentGenre = typeof route.query.genre === 'string' ? route.query.genre : ''

    if (String(saved?.activeGenre || '') !== currentGenre) return false
    if (!Array.isArray(saved?.tracks) || !Array.isArray(saved?.genres)) return false

    tracks.value = saved.tracks
    genres.value = saved.genres
    activeGenre.value = currentGenre
    offset.value = Number(saved.offset || saved.tracks.length || 0)
    hasMore.value = Boolean(saved.hasMore)
    loading.value = false
    loadingMore.value = false
    return true
  } catch {
    return false
  }
}

function persistState() {
  try {
    getSafeSessionStorage().setItem(STORAGE_KEY, JSON.stringify({
      activeGenre: activeGenre.value,
      tracks: tracks.value,
      genres: genres.value,
      offset: offset.value,
      hasMore: hasMore.value,
    }))
  } catch {
    // Ignore storage failures.
  }
}

function getDailySeed() {
  const now = new Date()
  return Number(`${now.getUTCFullYear()}${now.getUTCMonth() + 1}${now.getUTCDate()}`)
}

function stringToSeed(value) {
  return String(value)
    .split('')
    .reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 0)
}

function seededShuffle(items, seed) {
  const result = [...items]
  let state = seed || 1

  function nextRandom() {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

function shuffleTrendingBatch(rows, genre, batchOffset) {
  const seed = getDailySeed() ^ stringToSeed(`${genre}:${batchOffset}`)
  return seededShuffle(rows, seed)
}

async function fetchMusicBatch(genre, batchOffset) {
  if (genre) return musicService.search('', genre, batchOffset)
  return musicService.getTrending(TRENDING_PAGE_SIZE, '', batchOffset)
}

async function fetchTrending(genre = '', reset = true) {
  if (reset) {
    loading.value = true
    offset.value = 0
    hasMore.value = true
    tracks.value = []
  } else {
    loadingMore.value = true
  }

  try {
    const response = await fetchMusicBatch(genre, offset.value)
    const rawTracks = response.data?.results || []
    const pageSize = genre ? GENRE_PAGE_SIZE : TRENDING_PAGE_SIZE
    const newTracks = genre
      ? rawTracks
      : shuffleTrendingBatch(rawTracks, genre, offset.value)

    if (reset && !genre) {
      genres.value = [{ label: 'Trending', tag: '' }, ...seedMusicGenresFromTracks(newTracks)]
    }

    tracks.value = reset ? newTracks : [...tracks.value, ...newTracks]
    hasMore.value = newTracks.length === pageSize
    offset.value += newTracks.length
    persistState()
  } catch {
    tracks.value = []
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function selectGenre(tag) {
  if (activeGenre.value === tag) return
  activeGenre.value = tag
  router.replace({ path: '/music/singles', query: tag ? { genre: tag } : {} })
  fetchTrending(tag, true)
}

function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  fetchTrending(activeGenre.value, false)
}

function playTrack(track) {
  if (playerStore.isCurrent(track.id)) {
    playerStore.togglePlay()
    return
  }
  const allTracks = tracks.value.map(jamendoToPlayerPayload)
  const index = allTracks.findIndex((item) => String(item.id) === String(track.id))
  if (index === -1) {
    playerStore.play(jamendoToPlayerPayload(track))
    return
  }
  queueStore.setQueue(allTracks, index)
  playerStore.play(allTracks[index])
}

function isCurrentTrack(track) {
  return playerStore.isPlayingTrack(track.id)
}

function playHistoryEntry(entry) {
  const track = {
    contentType: entry.type === 'music' ? 'music' : 'podcast',
    id: entry.episodeId,
    title: entry.title,
    enclosureUrl: entry.enclosureUrl,
    image: entry.image,
    feedTitle: entry.feedTitle,
    duration: entry.duration,
  }
  if (entry.type === 'music') {
    const saved = historyStore.getProgress(entry.episodeId)
    if (saved) track.resumeTime = saved.currentTime
  }
  playerStore.play(track)
}

onMounted(async () => {
  const restored = restoreState()

  if (!restored) {
    await loadGenres()
    const genre = route.query.genre
    if (genre && genres.value.some((item) => item.tag === genre)) {
      activeGenre.value = genre
      await fetchTrending(genre, true)
    } else {
      await fetchTrending()
    }
  }

  if (authStore.isAuthenticated) {
    library.loadFavorites()
    library.loadPlaylists()
  }
})

watch(
  () => route.query.genre,
  async (genre) => {
    const nextGenre = typeof genre === 'string' ? genre : ''
    if (nextGenre === activeGenre.value) return

    if (!nextGenre) {
      activeGenre.value = ''
      await fetchTrending('', true)
      return
    }

    if (genres.value.some((item) => item.tag === nextGenre)) {
      activeGenre.value = nextGenre
      await fetchTrending(nextGenre, true)
    }
  }
)

watch([tracks, genres, activeGenre, offset, hasMore], persistState, { deep: true })
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <PageHero
        eyebrow="Trending songs"
        title="Singles and standout tracks"
        description="Browse trending songs, filter by genre, and keep exploring with a consistent queue and full library actions."
        :breadcrumbs="[
          { label: 'Home', to: '/' },
          { label: 'Music', to: '/music' },
          { label: 'Singles' },
        ]"
      />

      <div v-if="continueListeningMusic.length" class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-gray-300">Continue listening</h2>
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div
            v-for="entry in continueListeningMusic"
            :key="entry.episodeId"
            @click="playHistoryEntry(entry)"
            class="group relative w-36 shrink-0 cursor-pointer"
          >
            <div class="relative aspect-square w-36 overflow-hidden rounded-lg bg-gray-800">
              <img
                v-if="entry.image"
                :src="entry.image"
                :alt="entry.title"
                loading="lazy"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <MusicalNoteIcon class="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <p class="mt-2 truncate text-sm font-medium text-white">{{ entry.title }}</p>
            <p class="truncate text-xs text-gray-400">{{ entry.feedTitle }}</p>
          </div>
        </div>
      </div>

      <div class="mb-8 flex flex-wrap gap-2">
        <button
          v-for="genre in genres"
          :key="genre.label"
          type="button"
          @click="selectGenre(genre.tag)"
          :class="[
            'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            activeGenre === genre.tag
              ? 'border-indigo-500 bg-indigo-600 text-white'
              : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          ]"
        >
          {{ genre.label }}
        </button>
      </div>

      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">
            {{ activeGenre ? genres.find((genre) => genre.tag === activeGenre)?.label : 'Trending songs' }}
          </h2>
        </div>

        <div v-if="loading" class="space-y-2">
          <SkeletonRow v-for="n in 8" :key="n" />
        </div>

        <div
          v-else-if="!tracks.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MusicalNoteIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">No tracks for this genre right now. Try another one.</p>
        </div>

        <ul v-else class="space-y-2">
          <MusicTrackRow
            v-for="(track, idx) in tracks"
            :key="track.id"
            :track="track"
            :index="idx"
            :is-playing="isCurrentTrack(track)"
            @play="playTrack"
          />
        </ul>

        <div v-if="hasMore && tracks.length > 0" class="mt-6 flex justify-center">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="loadingMore" class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-400"></span>
            {{ loadingMore ? 'Loading...' : 'Show more' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
