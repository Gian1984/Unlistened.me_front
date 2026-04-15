<script setup>
import { onMounted } from 'vue'
import { HeartIcon as HeartSolid, PauseIcon, PlayIcon } from '@heroicons/vue/24/solid'
import { MusicalNoteIcon, TrashIcon } from '@heroicons/vue/24/outline'
import LicenseBadge from '~/src/components/music/LicenseBadge.vue'
import AddToPlaylistMenu from '~/src/components/music/AddToPlaylistMenu.vue'
import SkeletonRow from '~/src/components/SkeletonRow.vue'
import EmptyState from '~/src/components/EmptyState.vue'
import { useMusicLibraryStore } from '~/src/stores/musicLibraryStore.js'
import { usePlayerStore } from '~/src/stores/playerStore.js'
import { useQueueStore } from '~/src/stores/queueStore.js'
import { useMessageStore } from '~/src/stores/messageStore.js'
import { useSeo } from '~/src/seo/composables/useSeo.js'
import { musicFavoritesSeo } from '~/src/seo/registry/index.js'
import { backendRowToPlayerPayload } from '~/src/utils/musicTrackPayload.js'
import { formatDuration } from '~/src/utils/formatTime.js'

definePageMeta({
  middleware: ['auth'],
})

useSeo(musicFavoritesSeo)

const library = useMusicLibraryStore()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const messageStore = useMessageStore()

onMounted(() => library.loadFavorites())

function playFavorite(fav) {
  if (playerStore.isCurrent(fav.jamendo_track_id)) {
    playerStore.togglePlay()
    return
  }
  const allFavorites = library.favorites.map(backendRowToPlayerPayload)
  const index = allFavorites.findIndex(t => String(t.id) === String(fav.jamendo_track_id))
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
      <div class="mb-8">
        <p class="text-sm font-semibold text-pink-400">Your library</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Favorite music
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-gray-400">
          Tracks you have hearted, all in one place. Independent artists, Creative Commons licensed, no tracking.
        </p>
      </div>

      <div v-if="library.favoritesLoading && !library.favorites.length" class="space-y-2">
        <SkeletonRow v-for="n in 6" :key="n" />
      </div>

      <div v-else-if="!library.favorites.length" class="mx-auto max-w-4xl py-8">
        <EmptyState
          :icon="HeartSolid"
          title="No favorite tracks yet"
          description="Open the music page, hit the heart on any track, and it will land here."
          action-text="Discover music"
          action-link="/music"
        />
      </div>

      <ul v-else class="space-y-2">
        <li
          v-for="(fav, idx) in library.favorites"
          :key="fav.jamendo_track_id"
          class="group flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/40 p-2 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60 sm:gap-3 sm:p-3"
        >
          <span class="hidden w-5 shrink-0 text-center text-xs text-gray-500 tabular-nums sm:block">
            {{ idx + 1 }}
          </span>

          <div
            class="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-700 sm:h-12 sm:w-12"
            @click="playFavorite(fav)"
          >
            <img
              v-if="fav.album_image"
              :src="fav.album_image"
              :alt="fav.album_name || fav.title"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div v-else class="flex h-full w-full items-center justify-center">
              <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
            </div>
            <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
              <PauseIcon v-if="isCurrentTrack(fav)" class="h-5 w-5 text-white sm:h-6 sm:w-6" />
              <PlayIcon v-else class="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <p
              class="cursor-pointer truncate text-sm font-semibold transition-colors"
              :class="isCurrentTrack(fav) ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
              @click="playFavorite(fav)"
            >
              {{ fav.title }}
            </p>
            <p class="mt-1 truncate text-xs text-gray-400">{{ fav.artist_name }}</p>
            <div class="mt-1 min-h-5 text-xs text-gray-400">
              <LicenseBadge v-if="fav.license_ccurl" :url="fav.license_ccurl" size="xs" />
              <span v-else class="truncate">Creative Commons</span>
            </div>
            <NuxtLink
              v-if="fav.album_id && fav.album_name"
              :to="`/music/album/${fav.album_id}`"
              class="mt-1 inline-flex max-w-full text-xs text-gray-500 transition-colors hover:text-indigo-300"
            >
              <span class="truncate">{{ favoriteAlbumLabel(fav) }}</span>
            </NuxtLink>
            <p v-else class="mt-1 truncate text-xs text-gray-500">{{ favoriteAlbumLabel(fav) }}</p>
          </div>

          <span class="hidden shrink-0 text-xs text-gray-500 tabular-nums sm:block">
            {{ formatDuration(fav.duration) }}
          </span>

          <div class="flex shrink-0 items-center gap-0.5">
            <AddToPlaylistMenu :track="asTrack(fav)" size="sm" />
            <button
              type="button"
              :title="'Remove from favorites'"
              :aria-label="'Remove from favorites'"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-red-400"
              @click.stop="removeOne(fav)"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </li>
      </ul>

      <p class="mt-10 text-center text-xs text-gray-600">
        Music provided by
        <a href="https://www.jamendo.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 transition-colors hover:text-indigo-400">Jamendo</a>
        under Creative Commons licenses.
      </p>
    </div>
  </div>
</template>
