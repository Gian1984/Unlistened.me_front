<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { PauseIcon, PlayIcon } from '@heroicons/vue/24/solid'
import {
  ArrowLeftIcon,
  Bars3Icon,
  CheckIcon,
  ListBulletIcon,
  MusicalNoteIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import draggable from 'vuedraggable'
import LicenseBadge from '~/src/components/music/LicenseBadge.vue'
import FavoriteMusicButton from '~/src/components/music/FavoriteMusicButton.vue'
import SkeletonRow from '~/src/components/SkeletonRow.vue'
import EmptyState from '~/src/components/EmptyState.vue'
import { musicService } from '~/src/services/musicService.js'
import { useMusicLibraryStore } from '~/src/stores/musicLibraryStore.js'
import { usePlayerStore } from '~/src/stores/playerStore.js'
import { useQueueStore } from '~/src/stores/queueStore.js'
import { useMessageStore } from '~/src/stores/messageStore.js'
import { backendRowToPlayerPayload } from '~/src/utils/musicTrackPayload.js'
import { formatDuration } from '~/src/utils/formatTime.js'

definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const router = useRouter()
const library = useMusicLibraryStore()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const messageStore = useMessageStore()

const playlist = ref(null)
const tracks = ref([])
const loading = ref(true)
const editing = ref(false)
const editName = ref('')

const playlistId = computed(() => route.params.id)

async function fetchPlaylist() {
  loading.value = true
  try {
    const { data } = await musicService.getPlaylist(playlistId.value)
    const payload = data?.data ?? data
    playlist.value = payload
    tracks.value = payload?.tracks ?? []
    editName.value = payload?.name ?? ''
  } catch (err) {
    if (err?.response?.status === 404) {
      messageStore.setMessage('Playlist not found.')
      router.push('/music/playlists')
    } else if (err?.response?.status !== 401) {
      messageStore.setMessage('Could not load the playlist.')
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchPlaylist)
watch(playlistId, fetchPlaylist)

function playTrack(track, index) {
  if (playerStore.isCurrent(track.jamendo_track_id)) {
    playerStore.togglePlay()
    return
  }
  const allTracks = tracks.value.map(backendRowToPlayerPayload)
  queueStore.setQueue(allTracks, index)
  playerStore.play(allTracks[index])
}

function isCurrentTrack(track) {
  return playerStore.isPlayingTrack(track.jamendo_track_id)
}

function playlistAlbumLabel(track) {
  return track.album_name || 'Single'
}

function playAll() {
  if (!tracks.value.length) return
  playTrack(tracks.value[0], 0)
}

async function removeTrack(track) {
  try {
    await library.removeTrackFromPlaylist(playlistId.value, track.jamendo_track_id)
    tracks.value = tracks.value.filter(item => item.jamendo_track_id !== track.jamendo_track_id)
    messageStore.setMessage('Track removed')
  } catch {
    messageStore.setMessage('Could not remove the track.')
  }
}

async function onDragEnd(evt) {
  if (evt.moved) {
    const orderedTracks = tracks.value.map((track, idx) => ({
      jamendo_track_id: track.jamendo_track_id,
      position: idx,
    }))
    try {
      await musicService.reorderPlaylist(playlistId.value, orderedTracks)
    } catch {
      messageStore.setMessage('Could not save order. Please try again.')
    }
  }
}

async function saveRename() {
  const name = editName.value.trim()
  if (!name) return
  try {
    await library.renamePlaylist(playlistId.value, name, playlist.value?.description ?? '')
    if (playlist.value) playlist.value.name = name
    editing.value = false
    messageStore.setMessage('Playlist renamed')
  } catch {
    messageStore.setMessage('Could not rename. Please try again.')
  }
}

async function onDeletePlaylist() {
  if (!confirm(`Delete "${playlist.value?.name}"? This cannot be undone.`)) return
  try {
    await library.deletePlaylist(playlistId.value)
    messageStore.setMessage('Playlist deleted')
    router.push('/music/playlists')
  } catch {
    messageStore.setMessage('Could not delete. Please try again.')
  }
}

function asTrackForLibrary(track) {
  return {
    id: track.jamendo_track_id,
    name: track.title,
    artist_name: track.artist_name,
    artist_id: track.artist_id,
    album_image: track.album_image,
    audio: track.audio_url,
    duration: track.duration,
    license_ccurl: track.license_ccurl,
    shareurl: track.shareurl,
  }
}
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <NuxtLink
        to="/music/playlists"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-indigo-300"
      >
        <ArrowLeftIcon class="h-3.5 w-3.5" />
        All playlists
      </NuxtLink>

      <div class="mb-8 mt-4 flex items-start gap-5">
        <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
          <ListBulletIcon class="h-8 w-8" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-pink-400">Playlist</p>
          <div class="mt-1 flex items-center gap-3">
            <h1 v-if="!editing" class="truncate text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {{ playlist?.name || 'Loading…' }}
            </h1>
            <div v-else class="flex flex-1 items-center gap-2">
              <input
                v-model="editName"
                type="text"
                class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-2xl font-semibold text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                @keyup.enter="saveRename"
              />
              <button
                class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500"
                :title="'Save'"
                @click="saveRename"
              >
                <CheckIcon class="h-4 w-4" />
              </button>
              <button
                class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                :title="'Cancel'"
                @click="editing = false; editName = playlist?.name ?? ''"
              >
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
            <button
              v-if="playlist && !editing"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800 hover:text-indigo-300"
              :title="'Rename'"
              @click="editing = true"
            >
              <PencilSquareIcon class="h-4 w-4" />
            </button>
          </div>
          <p v-if="playlist?.description" class="mt-2 text-sm text-gray-400">
            {{ playlist.description }}
          </p>
          <p class="mt-2 text-xs text-gray-500">
            {{ tracks.length }} {{ tracks.length === 1 ? 'track' : 'tracks' }}
          </p>

          <div class="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              :disabled="!tracks.length"
              class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
              @click="playAll"
            >
              <PlayIcon class="h-4 w-4" />
              Play
            </button>
            <button
              v-if="playlist"
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-red-500/40 hover:text-red-400"
              @click="onDeletePlaylist"
            >
              <TrashIcon class="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="space-y-2">
        <SkeletonRow v-for="n in 5" :key="n" />
      </div>

      <div v-else-if="!tracks.length" class="mx-auto max-w-4xl py-8">
        <EmptyState
          :icon="MusicalNoteIcon"
          title="No tracks in this playlist yet"
          description="Open the music page and use the plus button next to a track to add it here."
          action-text="Discover music"
          action-link="/music"
        />
      </div>

      <p v-if="tracks.length > 1" class="mb-3 text-xs text-gray-500">
        Drag the handle to reorder tracks in your playlist.
      </p>
      <draggable
        v-model="tracks"
        item-key="jamendo_track_id"
        class="space-y-2"
        @change="onDragEnd"
      >
        <template #item="{ element: track, index: idx }">
          <li class="group flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/40 p-2 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60 sm:gap-3 sm:p-3">
            <div class="drag-handle hidden h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-full bg-gray-700 text-gray-400 active:cursor-grabbing sm:flex" title="Drag to reorder">
              <Bars3Icon class="h-4 w-4" />
            </div>

            <div
              class="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-700 sm:h-12 sm:w-12"
              @click="playTrack(track, idx)"
            >
              <img
                v-if="track.album_image"
                :src="track.album_image"
                :alt="track.title"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
              </div>
              <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                <PauseIcon v-if="isCurrentTrack(track)" class="h-5 w-5 text-white sm:h-6 sm:w-6" />
                <PlayIcon v-else class="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>

            <span class="hidden w-5 shrink-0 text-center text-xs text-gray-500 tabular-nums sm:block">
              {{ idx + 1 }}
            </span>

            <div class="min-w-0 flex-1">
              <p
                class="cursor-pointer truncate text-sm font-semibold transition-colors"
                :class="isCurrentTrack(track) ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
                @click="playTrack(track, idx)"
              >
                {{ track.title }}
              </p>
              <p class="mt-1 truncate text-xs text-gray-400">{{ track.artist_name }}</p>
              <div class="mt-1 min-h-5 text-xs text-gray-400">
                <LicenseBadge v-if="track.license_ccurl" :url="track.license_ccurl" size="xs" />
                <span v-else class="truncate">Creative Commons</span>
              </div>
              <p class="mt-1 truncate text-xs text-gray-500">{{ playlistAlbumLabel(track) }}</p>
            </div>

            <div class="flex shrink-0 items-center gap-1 sm:gap-0.5">
              <span class="mr-2 hidden text-xs text-gray-500 tabular-nums sm:block">
                {{ formatDuration(track.duration) }}
              </span>
              <FavoriteMusicButton :track="asTrackForLibrary(track)" size="sm" />
              <button
                type="button"
                :title="'Remove from playlist'"
                :aria-label="'Remove from playlist'"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-red-400"
                @click.stop="removeTrack(track)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </li>
        </template>
      </draggable>

      <p class="mt-10 text-center text-xs text-gray-600">
        Music provided by
        <a href="https://www.jamendo.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 transition-colors hover:text-indigo-400">Jamendo</a>
        under Creative Commons licenses.
      </p>
    </div>
  </div>
</template>
