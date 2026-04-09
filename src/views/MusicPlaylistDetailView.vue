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
} from '@heroicons/vue/24/outline'
import { musicService } from '@/services/musicService.js'
import { useMusicLibraryStore } from '@/stores/musicLibraryStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import FavoriteMusicButton from '@/components/music/FavoriteMusicButton.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'
import EmptyState from '@/components/EmptyState.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const router = useRouter()
const library = useMusicLibraryStore()
const playerStore = usePlayerStore()
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
    if (err?.response?.status === 401) {
      authStore.clearUser()
      router.push({ name: 'Login' })
    } else if (err?.response?.status === 404) {
      messageStore.setMessage('Playlist not found.')
      router.push({ name: 'MusicPlaylists' })
    } else {
      messageStore.setMessage('Could not load the playlist.')
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchPlaylist)
watch(playlistId, fetchPlaylist)

function playTrack(t) {
  playerStore.play({
    contentType: 'music',
    id: t.jamendo_track_id,
    title: t.title,
    enclosureUrl: t.audio_url,
    image: t.album_image,
    feedTitle: t.artist_name,
    artistId: t.artist_id,
    albumName: t.album_name,
    licenseUrl: t.license_ccurl,
    shareUrl: t.shareurl,
    duration: t.duration,
  })
}

function isCurrentTrack(t) {
  return playerStore.isVisible
    && playerStore.currentEpisode
    && String(playerStore.currentEpisode.id) === String(t.jamendo_track_id)
}

function playAll() {
  if (!tracks.value.length) return
  playTrack(tracks.value[0])
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

function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
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
      <ul v-else class="space-y-2">
        <li
          v-for="(t, idx) in tracks"
          :key="t.jamendo_track_id"
          @click="playTrack(t)"
          class="group flex cursor-pointer items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-3 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60"
        >
          <span class="hidden w-6 shrink-0 text-center text-xs text-gray-500 sm:block tabular-nums">
            {{ idx + 1 }}
          </span>

          <div class="relative shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-700">
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
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <PauseIcon v-if="isCurrentTrack(t)" class="h-6 w-6 text-white" />
              <PlayIcon v-else class="h-6 w-6 text-white" />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-semibold truncate transition-colors"
              :class="isCurrentTrack(t) ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
            >
              {{ t.title }}
            </p>
            <div class="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-400">
              <span class="truncate">{{ t.artist_name }}</span>
              <LicenseBadge :url="t.license_ccurl" size="xs" />
            </div>
          </div>

          <span class="hidden sm:block shrink-0 text-xs text-gray-500 tabular-nums">
            {{ formatDuration(t.duration) }}
          </span>

          <div class="flex shrink-0 items-center gap-0.5">
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
