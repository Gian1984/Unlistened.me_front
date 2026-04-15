<script setup>
import { onMounted } from 'vue'
import {
  HeartIcon as HeartSolid,
  PlayIcon,
  PauseIcon,
} from '@heroicons/vue/24/solid'
import { TrashIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import { useMusicLibraryStore } from '@/stores/musicLibraryStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useQueueStore } from '@/stores/queueStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import AddToPlaylistMenu from '@/components/music/AddToPlaylistMenu.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'
import EmptyState from '@/components/EmptyState.vue'
import Footer from '@/components/Footer.vue'
import { useSeo } from '@/seo/composables/useSeo.js'
import { musicFavoritesSeo } from '@/seo/registry/index.js'
import { backendRowToPlayerPayload } from '@/utils/musicTrackPayload.js'
import { formatDuration } from '@/utils/formatTime.js'

useSeo(musicFavoritesSeo)

const library = useMusicLibraryStore()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const messageStore = useMessageStore()

onMounted(() => library.loadFavorites())

function playFavorite(fav) {
  // Track already loaded → toggle pause/resume so the pause icon in
  // the row actually pauses instead of restarting from 0.
  if (playerStore.isCurrent(fav.jamendo_track_id)) {
    playerStore.togglePlay()
    return
  }
  const allFavorites = library.favorites.map(backendRowToPlayerPayload)
  const index = allFavorites.findIndex(
    t => String(t.id) === String(fav.jamendo_track_id)
  )
  if (index === -1) {
    playerStore.play(backendRowToPlayerPayload(fav))
    return
  }
  queueStore.setQueue(allFavorites, index)
  playerStore.play(allFavorites[index])
}

function isCurrentTrack(fav) {
  return playerStore.isPlayingTrack(fav.jamendo_track_id)
}

function favoriteAlbumLabel(fav) {
  return fav.album_name || 'Single'
}

async function removeOne(fav) {
  try {
    await library.removeFavorite(fav.jamendo_track_id)
    messageStore.setMessage('Removed from favorites')
  } catch {
    messageStore.setMessage('Could not remove. Please try again.')
  }
}

// Convert backend favorite row -> raw Jamendo shape for AddToPlaylistMenu
function asTrack(fav) {
  return {
    id: fav.jamendo_track_id,
    name: fav.title,
    artist_name: fav.artist_name,
    artist_id: fav.artist_id,
    album_id: fav.album_id,
    album_name: fav.album_name,
    album_image: fav.album_image,
    audio: fav.audio_url,
    duration: fav.duration,
    license_ccurl: fav.license_ccurl,
    shareurl: fav.shareurl,
  }
}
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <!-- Header -->
      <div class="mb-8">
        <p class="text-sm font-semibold text-pink-400">Your library</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Favorite music
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-gray-400">
          Tracks you have hearted, all in one place. Independent artists, Creative Commons licensed, no tracking.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="library.favoritesLoading && !library.favorites.length" class="space-y-2">
        <SkeletonRow v-for="n in 6" :key="n" />
      </div>

      <!-- Empty -->
      <div v-else-if="!library.favorites.length" class="mx-auto max-w-4xl py-8">
        <EmptyState
          :icon="HeartSolid"
          title="No favorite tracks yet"
          description="Open the music page, hit the heart on any track, and it will land here."
          action-text="Discover music"
          action-link="/music"
        />
      </div>

      <!-- List -->
      <ul v-else class="space-y-2">
        <li
          v-for="(fav, idx) in library.favorites"
          :key="fav.jamendo_track_id"
          class="group flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-2 sm:p-3 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60"
        >
          <span class="hidden w-5 shrink-0 text-center text-xs text-gray-500 sm:block tabular-nums">
            {{ idx + 1 }}
          </span>

          <!-- Cover with play overlay -->
          <div 
            class="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-gray-700 cursor-pointer"
            @click="playFavorite(fav)"
          >
            <img
              v-if="fav.album_image"
              :src="fav.album_image"
              :alt="fav.album_name || fav.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
            </div>
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity flex items-center justify-center">
              <PauseIcon v-if="isCurrentTrack(fav)" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <PlayIcon v-else class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>

          <!-- Title + artist + rights + album -->
          <div class="flex-1 min-w-0 min-w-0">
            <p
              class="text-sm font-semibold truncate transition-colors cursor-pointer"
              :class="isCurrentTrack(fav) ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
              @click="playFavorite(fav)"
            >
              {{ fav.title }}
            </p>
            <p class="mt-0.5 truncate text-xs text-gray-400">{{ fav.artist_name }}</p>
            <div class="mt-0.5 min-h-5 text-xs text-gray-400">
              <LicenseBadge v-if="fav.license_ccurl" :url="fav.license_ccurl" size="xs" />
              <span v-else class="truncate">Creative Commons</span>
            </div>
            <router-link
              v-if="fav.album_id && fav.album_name"
              :to="{ name: 'MusicAlbum', params: { id: fav.album_id } }"
              class="mt-0.5 inline-flex max-w-full text-xs text-gray-500 transition-colors hover:text-indigo-300"
            >
              <span class="truncate">{{ favoriteAlbumLabel(fav) }}</span>
            </router-link>
            <p v-else class="mt-0.5 truncate text-xs text-gray-500">{{ favoriteAlbumLabel(fav) }}</p>
          </div>

          <!-- Duration -->
          <span class="hidden sm:block shrink-0 text-xs text-gray-500 tabular-nums">
            {{ formatDuration(fav.duration) }}
          </span>

          <!-- Actions -->
          <div class="flex shrink-0 items-center gap-0.5">
            <AddToPlaylistMenu :track="asTrack(fav)" size="sm" />
            <button
              type="button"
              @click.stop="removeOne(fav)"
              :title="'Remove from favorites'"
              :aria-label="'Remove from favorites'"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-red-400"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </li>
      </ul>

      <p class="mt-10 text-center text-xs text-gray-600">
        Music provided by
        <a href="https://www.jamendo.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-indigo-400 transition-colors">Jamendo</a>
        under Creative Commons licenses.
      </p>
    </div>
  </div>
  <Footer />
</template>
