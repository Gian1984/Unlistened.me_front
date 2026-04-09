<script setup>
import { ref, onMounted, computed } from 'vue'
import { MusicalNoteIcon, PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { musicService } from '@/services/musicService.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useQueueStore } from '@/stores/queueStore.js'
import { useHistoryStore } from '@/stores/historyStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useMusicLibraryStore } from '@/stores/musicLibraryStore.js'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import FavoriteMusicButton from '@/components/music/FavoriteMusicButton.vue'
import AddToPlaylistMenu from '@/components/music/AddToPlaylistMenu.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'
import Footer from '@/components/Footer.vue'
import { useSeo } from '@/seo/composables/useSeo.js'
import { musicSeo } from '@/seo/registry/index.js'

useSeo(musicSeo)

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
const PAGE_SIZE = 30

const continueListeningMusic = computed(() => historyStore.continueListeningMusic)

const GENRES = [
  { label: 'Trending',   tag: '' },
  { label: 'Electronic', tag: 'electronic' },
  { label: 'Ambient',    tag: 'ambient' },
  { label: 'Jazz',       tag: 'jazz' },
  { label: 'Classical',  tag: 'classical' },
  { label: 'Rock',       tag: 'rock' },
  { label: 'Hip Hop',    tag: 'hiphop' },
  { label: 'Folk',       tag: 'folk' },
  { label: 'Lo-fi',      tag: 'lounge' },
  { label: 'World',      tag: 'world' },
  { label: 'Cinematic',  tag: 'soundtrack' },
]

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
    const response = await musicService.getTrending(PAGE_SIZE, genre, offset.value)
    const newTracks = response.data?.results || []
    if (reset) {
      tracks.value = newTracks
    } else {
      tracks.value = [...tracks.value, ...newTracks]
    }
    hasMore.value = newTracks.length === PAGE_SIZE
    offset.value += newTracks.length
  } catch (err) {
    console.error('Error fetching music:', err)
    tracks.value = []
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function selectGenre(tag) {
  if (activeGenre.value === tag) return
  activeGenre.value = tag
  fetchTrending(tag, true)
}

function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  fetchTrending(activeGenre.value, false)
}

function playTrack(track) {
  if (playerStore.isCurrent(track.id)) {
    playerStore.togglePlayback()
  } else {
    playerStore.play({
      contentType: 'music',
      id: track.id,
      title: track.name,
      enclosureUrl: track.audio,
      image: track.album_image,
      feedTitle: track.artist_name,
      artistId: track.artist_id,
      albumName: track.album_name,
      licenseUrl: track.license_ccurl,
      shareUrl: track.shareurl,
      duration: track.duration,
    })
  }
}

function isCurrentTrack(track) {
  return playerStore.isCurrent(track.id)
}

function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
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

onMounted(() => {
  fetchTrending()
  // Hydrate library state so heart icons render the correct status
  // immediately (no fetch storm — store is idempotent + cached).
  if (authStore.isAuthenticated) {
    library.loadFavorites()
    library.loadPlaylists()
  }
})
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <!-- Header -->
      <div class="mb-8">
        <p class="text-sm font-semibold text-pink-400">Listen freely</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Free music to keep you company
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-gray-400">
          Independent artists, Creative Commons licensed, no tracking. Pick a genre, hit play, and fall in love with someone you have never heard before.
        </p>
      </div>

      <!-- Continue Listening (music) -->
      <div v-if="continueListeningMusic.length" class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-gray-300">Continue listening</h2>
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div
            v-for="entry in continueListeningMusic"
            :key="entry.episodeId"
            @click="playHistoryEntry(entry)"
            class="group relative shrink-0 w-36 cursor-pointer"
          >
            <div class="relative aspect-square w-36 rounded-lg bg-gray-800 overflow-hidden">
              <img
                v-if="entry.image"
                :src="entry.image"
                :alt="entry.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <MusicalNoteIcon class="h-8 w-8 text-gray-600" />
              </div>
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayIcon class="h-8 w-8 text-white" />
              </div>
            </div>
            <p class="mt-2 truncate text-sm font-medium text-white">{{ entry.title }}</p>
            <p class="truncate text-xs text-gray-400">{{ entry.feedTitle }}</p>
          </div>
        </div>
      </div>

      <!-- Genre pills -->
      <div class="mb-8 flex flex-wrap gap-2">
        <button
          v-for="g in GENRES"
          :key="g.label"
          type="button"
          @click="selectGenre(g.tag)"
          :class="[
            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
            activeGenre === g.tag
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-700'
          ]"
        >
          {{ g.label }}
        </button>
      </div>

      <!-- Tracks list -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-300">
            {{ activeGenre ? GENRES.find(g => g.tag === activeGenre)?.label : 'Trending now' }}
          </h2>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-2">
          <SkeletonRow v-for="n in 8" :key="n" />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="!tracks.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MusicalNoteIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">No tracks for this genre right now. Try another one.</p>
        </div>

        <!-- Track rows -->
        <ul v-else class="space-y-2">
          <li
            v-for="(track, idx) in tracks"
            :key="track.id"
            class="group flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-2 sm:p-3 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60"
          >
            <!-- Index -->
            <span class="hidden w-5 shrink-0 text-center text-xs text-gray-500 sm:block tabular-nums">
              {{ idx + 1 }}
            </span>

            <!-- Cover with hover play overlay -->
            <div 
              class="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-gray-700 cursor-pointer"
              @click="playTrack(track)"
            >
              <img
                v-if="track.album_image"
                :src="track.album_image"
                :alt="track.album_name || track.name"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
              </div>
              <div class="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity"
                :class="isCurrentTrack(track) && playerStore.isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 sm:opacity-100'">
                <PauseIcon v-if="isCurrentTrack(track) && playerStore.isPlaying" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <PlayIcon v-else class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <!-- Title + artist + license badge -->
            <div class="flex-1 min-w-0 min-w-0">
              <p
                class="text-sm font-semibold truncate transition-colors cursor-pointer"
                :class="isCurrentTrack(track) ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
                @click="playTrack(track)"
              >
                {{ track.name }}
              </p>
              <div class="flex flex-wrap items-center gap-1 text-xs text-gray-400">
                <span class="truncate">{{ track.artist_name }}</span>
                <LicenseBadge :url="track.license_ccurl" size="xs" />
              </div>
            </div>

            <!-- Duration -->
            <span class="hidden sm:block shrink-0 text-xs text-gray-500 tabular-nums">
              {{ formatDuration(track.duration) }}
            </span>

            <!-- Library actions: favorite + add to playlist -->
            <div class="flex shrink-0 items-center gap-0.5">
              <FavoriteMusicButton :track="track" size="sm" />
              <AddToPlaylistMenu :track="track" size="sm" />
            </div>
          </li>
        </ul>

        <!-- Show more button -->
        <div v-if="hasMore && tracks.length > 0" class="mt-6 flex justify-center">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="loadingMore" class="animate-spin h-4 w-4 border-2 border-gray-300 border-t-indigo-400 rounded-full"></span>
            {{ loadingMore ? 'Loading...' : 'Show more' }}
          </button>
        </div>
      </div>

      <!-- Jamendo platform attribution -->
      <p class="mt-10 text-center text-xs text-gray-600">
        Music provided by
        <a href="https://www.jamendo.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-indigo-400 transition-colors">Jamendo</a>
        under Creative Commons licenses.
      </p>
    </div>
  </div>
  <Footer />
</template>
