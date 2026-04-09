<script setup>
import { ref, onMounted } from 'vue'
import { MusicalNoteIcon, PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { musicService } from '@/services/musicService.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'
import Footer from '@/components/Footer.vue'
import { useSeo } from '@/seo/composables/useSeo.js'
import { musicSeo } from '@/seo/registry/index.js'

useSeo(musicSeo)

const playerStore = usePlayerStore()

const tracks = ref([])
const loading = ref(true)
const activeGenre = ref('')

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

async function fetchTrending(genre = '') {
  loading.value = true
  try {
    const response = await musicService.getTrending(30, genre)
    tracks.value = response.data?.results || []
  } catch (err) {
    console.error('Error fetching music:', err)
    tracks.value = []
  } finally {
    loading.value = false
  }
}

function selectGenre(tag) {
  if (activeGenre.value === tag) return
  activeGenre.value = tag
  fetchTrending(tag)
}

function playTrack(track) {
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

function isCurrentTrack(track) {
  return playerStore.isVisible
    && playerStore.currentEpisode
    && String(playerStore.currentEpisode.id) === String(track.id)
}

function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

onMounted(() => fetchTrending())
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
            @click="playTrack(track)"
            class="group flex cursor-pointer items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-3 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60"
          >
            <!-- Index -->
            <span class="hidden w-6 shrink-0 text-center text-xs text-gray-500 sm:block tabular-nums">
              {{ idx + 1 }}
            </span>

            <!-- Cover with hover play overlay -->
            <div class="relative shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-700">
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
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PauseIcon v-if="isCurrentTrack(track)" class="h-6 w-6 text-white" />
                <PlayIcon v-else class="h-6 w-6 text-white" />
              </div>
            </div>

            <!-- Title + artist + license badge (CC attribution required) -->
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-semibold truncate transition-colors"
                :class="isCurrentTrack(track) ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
              >
                {{ track.name }}
              </p>
              <div class="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-400">
                <span class="truncate">{{ track.artist_name }}</span>
                <LicenseBadge :url="track.license_ccurl" size="xs" />
              </div>
            </div>

            <!-- Duration -->
            <span class="hidden sm:block shrink-0 text-xs text-gray-500 tabular-nums">
              {{ formatDuration(track.duration) }}
            </span>
          </li>
        </ul>
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
