<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowRightIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import PageHero from '~/src/components/PageHero.vue'
import SkeletonCard from '~/src/components/SkeletonCard.vue'
import SkeletonRow from '~/src/components/SkeletonRow.vue'
import MusicTrackRow from '~/src/components/music/MusicTrackRow.vue'
import { musicService } from '~/src/services/musicService.js'
import { usePlayerStore } from '~/src/stores/playerStore.js'
import { useQueueStore } from '~/src/stores/queueStore.js'
import { useHistoryStore } from '~/src/stores/historyStore.js'
import { useAuthStore } from '~/src/stores/authStore.js'
import { useMusicLibraryStore } from '~/src/stores/musicLibraryStore.js'
import { jamendoToPlayerPayload } from '~/src/utils/musicTrackPayload.js'
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo('music')

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
  } catch (error) {
    console.error('Error fetching albums:', error)
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
  } catch (error) {
    console.error('Error fetching songs:', error)
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

      <section class="mb-12">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">Trending albums</h2>
          <NuxtLink
            to="/music/albums"
            class="flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            See all
            <ArrowRightIcon class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div v-if="loadingAlbums" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <div
          v-else-if="!albums.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MusicalNoteIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">No albums available right now.</p>
        </div>

        <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <li
            v-for="album in albums"
            :key="album.id"
            class="group overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-all hover:border-indigo-500 hover:shadow-lg"
          >
            <NuxtLink :to="`/music/album/${album.id}`" class="block">
              <div class="flex items-center gap-3 p-4">
                <div class="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-700">
                  <img
                    v-if="album.image"
                    :src="album.image"
                    :alt="album.name"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center">
                    <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                    {{ album.name }}
                  </h3>
                  <p class="mt-0.5 truncate text-xs text-gray-400">{{ album.artist_name }}</p>
                  <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    Released {{ album.releasedate || 'recently' }}<span v-if="album.zip_allowed"> • Download available</span>
                  </p>
                </div>
              </div>
            </NuxtLink>
            <div class="flex items-center gap-2 px-4 pb-3">
              <span class="text-xs text-gray-500">{{ album.zip_allowed ? 'Downloadable' : 'Streaming' }}</span>
              <NuxtLink
                :to="`/music/album/${album.id}`"
                class="ml-auto flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-indigo-400"
              >
                <span>Album</span>
                <ArrowRightIcon class="h-3.5 w-3.5" />
              </NuxtLink>
            </div>
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">Trending songs</h2>
          <NuxtLink
            to="/music/singles"
            class="flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
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
</template>
