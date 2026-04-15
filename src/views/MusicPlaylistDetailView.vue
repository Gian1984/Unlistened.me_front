<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PlayIcon,
  PauseIcon,
} from '@heroicons/vue/24/solid'
import {
  TrashIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  MusicalNoteIcon,
  ArrowLeftIcon,
  ListBulletIcon,
  Bars3Icon,
} from '@heroicons/vue/24/outline'
import draggable from 'vuedraggable'
import { musicService } from '@/services/musicService.js'
import { useMusicLibraryStore } from '@/stores/musicLibraryStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useQueueStore } from '@/stores/queueStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import FavoriteMusicButton from '@/components/music/FavoriteMusicButton.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'
import EmptyState from '@/components/EmptyState.vue'
import Footer from '@/components/Footer.vue'
import { backendRowToPlayerPayload } from '@/utils/musicTrackPayload.js'
import { formatDuration } from '@/utils/formatTime.js'

const route = useRoute()
const router = useRouter()
const library = useMusicLibraryStore()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const messageStore = useMessageStore()
const authStore = useAuthStore()

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
      router.push({ name: 'MusicPlaylists' })
    } else if (err?.response?.status !== 401) {
      messageStore.setMessage('Could not load the playlist.')
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchPlaylist)
watch(playlistId, fetchPlaylist)

function playTrack(t, index) {
  // Track already loaded → toggle pause/resume so the pause icon in
  // the row actually pauses instead of restarting from 0.
  if (playerStore.isCurrent(t.jamendo_track_id)) {
    playerStore.togglePlay()
    return
  }
  const allTracks = tracks.value.map(backendRowToPlayerPayload)
  queueStore.setQueue(allTracks, index)
  playerStore.play(allTracks[index])
}

function isCurrentTrack(t) {
  return playerStore.isPlayingTrack(t.jamendo_track_id)
}

function playlistAlbumLabel(track) {
  return track.album_name || 'Single'
}

function playAll() {
  if (!tracks.value.length) return
  playTrack(tracks.value[0], 0)
}

async function removeTrack(t) {
  try {
    await library.removeTrackFromPlaylist(playlistId.value, t.jamendo_track_id)
    tracks.value = tracks.value.filter(x => x.jamendo_track_id !== t.jamendo_track_id)
    messageStore.setMessage('Track removed')
  } catch {
    messageStore.setMessage('Could not remove the track.')
  }
}

async function onDragEnd(evt) {
  if (evt.moved) {
    const orderedTracks = tracks.value.map((tr, idx) => ({
      jamendo_track_id: tr.jamendo_track_id,
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
    router.push({ name: 'MusicPlaylists' })
  } catch {
    messageStore.setMessage('Could not delete. Please try again.')
  }
}

function asTrackForLibrary(t) {
  return {
    id: t.jamendo_track_id,
    name: t.title,
    artist_name: t.artist_name,
    artist_id: t.artist_id,
    album_image: t.album_image,
    audio: t.audio_url,
    duration: t.duration,
    license_ccurl: t.license_ccurl,
    shareurl: t.shareurl,
  }
}

</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <!-- Back link -->
      <router-link
        :to="{ name: 'MusicPlaylists' }"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-indigo-300"
      >
        <ArrowLeftIcon class="h-3.5 w-3.5" />
        All playlists
      </router-link>

      <!-- Header -->
      <div class="mt-4 mb-8 flex items-start gap-5">
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
                @keyup.enter="saveRename"
                class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-2xl font-semibold text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <button
                @click="saveRename"
                class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500"
                :title="'Save'"
              >
                <CheckIcon class="h-4 w-4" />
              </button>
              <button
                @click="editing = false; editName = playlist?.name ?? ''"
                class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                :title="'Cancel'"
              >
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
            <button
              v-if="playlist && !editing"
              @click="editing = true"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800 hover:text-indigo-300"
              :title="'Rename'"
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
              @click="playAll"
              :disabled="!tracks.length"
              class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
            >
              <PlayIcon class="h-4 w-4" />
              Play
            </button>
            <button
              v-if="playlist"
              type="button"
              @click="onDeletePlaylist"
              class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              <TrashIcon class="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-2">
        <SkeletonRow v-for="n in 5" :key="n" />
      </div>

      <!-- Empty -->
      <div v-else-if="!tracks.length" class="mx-auto max-w-4xl py-8">
        <EmptyState
          :icon="MusicalNoteIcon"
          title="No tracks in this playlist yet"
          description="Open the music page and use the plus button next to a track to add it here."
          action-text="Discover music"
          action-link="/music"
        />
      </div>

      <!-- Tracks -->
      <p v-if="tracks.length > 1" class="mb-3 text-xs text-gray-500">
        Drag the handle to reorder tracks in your playlist.
      </p>
      <draggable
        v-model="tracks"
        item-key="jamendo_track_id"
        @change="onDragEnd"
        class="space-y-2"
      >
        <template #item="{ element: t, index: idx }">
          <li
            class="group flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-2 sm:p-3 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60"
          >
            <!-- Drag handle (desktop only) -->
            <div class="drag-handle hidden sm:flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-full bg-gray-700 text-gray-400 active:cursor-grabbing" title="Drag to reorder">
              <Bars3Icon class="h-4 w-4" />
            </div>

            <!-- Cover with play overlay -->
            <div
              class="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-gray-700 cursor-pointer"
              @click="playTrack(t, idx)"
            >
              <img
                v-if="t.album_image"
                :src="t.album_image"
                :alt="t.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity flex items-center justify-center">
                <PauseIcon v-if="isCurrentTrack(t)" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <PlayIcon v-else class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <!-- Index -->
            <span class="hidden sm:block w-5 shrink-0 text-center text-xs text-gray-500 tabular-nums">
              {{ idx + 1 }}
            </span>

            <!-- Title + artist + rights + album -->
            <div class="flex-1 min-w-0 min-w-0">
              <p
                class="text-sm font-semibold truncate transition-colors cursor-pointer"
                :class="isCurrentTrack(t) ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
                @click="playTrack(t, idx)"
              >
                {{ t.title }}
              </p>
              <p class="mt-0.5 truncate text-xs text-gray-400">{{ t.artist_name }}</p>
              <div class="mt-0.5 min-h-5 text-xs text-gray-400">
                <LicenseBadge v-if="t.license_ccurl" :url="t.license_ccurl" size="xs" />
                <span v-else class="truncate">Creative Commons</span>
              </div>
              <p class="mt-0.5 truncate text-xs text-gray-500">{{ playlistAlbumLabel(t) }}</p>
            </div>

            <!-- Duration + actions -->
            <div class="flex shrink-0 items-center gap-1 sm:gap-0.5">
              <span class="hidden sm:block text-xs text-gray-500 tabular-nums mr-2">
                {{ formatDuration(t.duration) }}
              </span>
              <FavoriteMusicButton :track="asTrackForLibrary(t)" size="sm" />
              <button
                type="button"
                @click.stop="removeTrack(t)"
                :title="'Remove from playlist'"
                :aria-label="'Remove from playlist'"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-red-400"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </li>
        </template>
      </draggable>

      <p class="mt-10 text-center text-xs text-gray-600">
        Music provided by
        <a href="https://www.jamendo.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-indigo-400 transition-colors">Jamendo</a>
        under Creative Commons licenses.
      </p>
    </div>
  </div>
  <Footer />
</template>
