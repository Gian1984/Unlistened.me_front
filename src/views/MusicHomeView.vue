<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowRightIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import Footer from '@/components/Footer.vue'
import PageHero from '@/components/PageHero.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'
import MusicTrackRow from '@/components/music/MusicTrackRow.vue'
import { musicService } from '@/services/musicService.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useQueueStore } from '@/stores/queueStore.js'
import { useHistoryStore } from '@/stores/historyStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useMusicLibraryStore } from '@/stores/musicLibraryStore.js'
import { useSeo } from '@/seo/composables/useSeo.js'
import { musicSeo } from '@/seo/registry/index.js'
import { jamendoToPlayerPayload } from '@/utils/musicTrackPayload.js'

useSeo(musicSeo)

const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const historyStore = useHistoryStore()
const authStore = useAuthStore()
const library = useMusicLibraryStore()

const albums = ref([])
const songs = ref([])
const loadingAlbums = ref(true)
const loadingSongs = ref(true)

const ALBUMS_POOL_SIZE = 18
const ALBUMS_PREVIEW_COUNT = 6
const SONGS_POOL_SIZE = 30
const SONGS_PREVIEW_COUNT = 20

const continueListeningMusic = computed(() => historyStore.continueListeningMusic)

function getDailySeed() {
  const now = new Date()
  return Number(`${now.getUTCFullYear()}${now.getUTCMonth() + 1}${now.getUTCDate()}`)
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

async function fetchAlbums() {
  try {
    const response = await musicService.getAlbums({ limit: ALBUMS_POOL_SIZE })
    const albumRows = response.data?.results || []
    albums.value = seededShuffle(albumRows, getDailySeed() ^ 303).slice(0, ALBUMS_PREVIEW_COUNT)
  } catch (err) {
    console.error('Error fetching albums:', err)
    albums.value = []
  } finally {
    loadingAlbums.value = false
  }
}

async function fetchSongs() {
  try {
    const response = await musicService.getTrending(SONGS_POOL_SIZE)
    const tracks = response.data?.results || []
    songs.value = seededShuffle(tracks, getDailySeed()).slice(0, SONGS_PREVIEW_COUNT)
  } catch (err) {
    console.error('Error fetching songs:', err)
    songs.value = []
  } finally {
    loadingSongs.value = false
  }
}

function playTrack(track) {
  if (playerStore.isCurrent(track.id)) {
    playerStore.togglePlay()
    return
  }

  const allTracks = songs.value.map(jamendoToPlayerPayload)
  const index = allTracks.findIndex((t) => String(t.id) === String(track.id))
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

onMounted(() => {
  fetchAlbums()
  fetchSongs()
  if (authStore.isAuthenticated) {
    library.loadFavorites()
    library.loadPlaylists()
  }
})
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <PageHero
        eyebrow="Listen freely"
        title="Free music to keep you company"
        description="Independent artists, Creative Commons licensed, no tracking. Pick an album or jump into trending songs."
        :breadcrumbs="[
          { label: 'Home', to: '/' },
          { label: 'Music' },
        ]"
      />

      <div v-if="continueListeningMusic.length" class="mb-10">
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
                loading="lazy"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <MusicalNoteIcon class="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <p class="mt-2 truncate text-sm font-medium text-white">{{ entry.title }}</p>
            <p class="truncate text-xs text-gray-400">{{ entry.feedTitle }}</p>
          </div>
        </div>
      </div>

      <section class="mb-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-300">Trending albums</h2>
          <NuxtLink
            to="/music/albums"
            class="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            See all
            <ArrowRightIcon class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div v-if="loadingAlbums" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <div
          v-else-if="!albums.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MusicalNoteIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">No albums available right now.</p>
        </div>

        <ul v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <li
            v-for="album in albums"
            :key="album.id"
            class="rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
          >
            <NuxtLink :to="`/music/album/${album.id}`" class="block">
              <div class="flex items-center gap-3 p-4">
                <div class="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-700">
                  <img
                    v-if="album.image"
                    :src="album.image"
                    :alt="album.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {{ album.name }}
                  </h3>
                  <p class="text-xs text-gray-400 truncate mt-0.5">{{ album.artist_name }}</p>
                  <p class="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    Released {{ album.releasedate || 'recently' }}<span v-if="album.zip_allowed"> • Download available</span>
                  </p>
                </div>
              </div>
            </NuxtLink>
            <div class="flex items-center gap-2 px-4 pb-3">
              <span class="text-xs text-gray-500">{{ album.zip_allowed ? 'Downloadable' : 'Streaming' }}</span>
              <NuxtLink
                :to="`/music/album/${album.id}`"
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors ml-auto"
              >
                <span>Album</span>
                <ArrowRightIcon class="h-3.5 w-3.5" />
              </NuxtLink>
            </div>
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-300">Trending songs</h2>
          <NuxtLink
            to="/music/singles"
            class="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            See all
            <ArrowRightIcon class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div v-if="loadingSongs" class="space-y-2">
          <SkeletonRow v-for="n in 8" :key="n" />
        </div>

        <div
          v-else-if="!songs.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MusicalNoteIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">No songs available right now.</p>
        </div>

        <ul v-else class="space-y-2">
          <MusicTrackRow
            v-for="(track, idx) in songs"
            :key="track.id"
            :track="track"
            :index="idx"
            :is-playing="isCurrentTrack(track)"
            @play="playTrack"
          />
        </ul>
      </section>
    </div>
  </div>
  <Footer />
</template>
