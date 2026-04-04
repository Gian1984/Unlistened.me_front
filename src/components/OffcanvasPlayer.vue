<template>
  <audio
    ref="audioEl"
    @loadedmetadata="onLoadedMetadata"
    @timeupdate="onTimeUpdate"
    @play="isPlaying = true"
    @pause="isPlaying = false"
    @ended="onEnded"
  />

  <transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <div
      v-if="playerStore.isVisible && playerStore.currentEpisode"
      class="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-700 shadow-2xl"
    >
      <!-- Progress bar -->
      <div
        ref="progressBarEl"
        class="relative cursor-pointer group mx-4"
        :class="isSeeking ? 'h-6 -mb-2' : 'h-5 -mb-1.5'"
        @mousedown="onSeekStart"
        @touchstart.prevent="onSeekStart"
      >
        <div
          class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-700 rounded-full group-hover:h-1.5 transition-all"
          :class="isSeeking ? 'h-1.5' : ''"
        >
          <div
            class="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <div
          class="absolute top-1/2 -translate-y-1/2 rounded-full bg-indigo-400 shadow-lg transition-transform"
          :class="isSeeking ? 'w-4 h-4 scale-110' : 'w-3 h-3'"
          :style="{ left: `calc(${progress}% - ${isSeeking ? 8 : 6}px)` }"
        />
      </div>

      <!-- Controls row -->
      <div class="flex items-center gap-3 px-4 py-3">
        <!-- Cover art -->
        <img
          v-if="playerStore.currentEpisode.image"
          :src="playerStore.currentEpisode.image"
          :alt="playerStore.currentEpisode.title"
          class="h-10 w-10 rounded object-cover shrink-0 bg-gray-700"
          @error="($event.target).style.display = 'none'"
        />
        <div v-else class="h-10 w-10 rounded bg-gray-700 shrink-0 flex items-center justify-center">
          <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
        </div>

        <!-- Episode info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate leading-tight">
            {{ playerStore.currentEpisode.title }}
          </p>
          <p v-if="playerStore.currentEpisode.feedTitle" class="text-xs text-gray-400 truncate leading-tight mt-0.5">
            {{ playerStore.currentEpisode.feedTitle }}
          </p>
        </div>

        <!-- Time display -->
        <span class="hidden sm:block text-xs text-gray-400 shrink-0 tabular-nums">
          {{ formatTime(currentTimeSec) }} / {{ formatTime(durationSec) }}
        </span>

        <!-- Speed control -->
        <button
          @click="cycleSpeed"
          class="hidden sm:flex shrink-0 items-center justify-center h-7 px-1.5 rounded text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-colors tabular-nums"
          aria-label="Playback speed"
        >
          {{ playbackSpeed }}x
        </button>

        <!-- Skip back 15s -->
        <button
          @click="skip(-15)"
          class="hidden sm:flex shrink-0 items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          aria-label="Skip back 15 seconds"
        >
          <BackwardIcon class="h-4 w-4" />
        </button>

        <!-- Play / Pause -->
        <button
          @click="togglePlay"
          class="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          :aria-label="isPlaying ? 'Pause' : 'Play'"
        >
          <PauseIcon v-if="isPlaying" class="h-4 w-4 text-white" />
          <PlayIcon v-else class="h-4 w-4 text-white ml-0.5" />
        </button>

        <!-- Skip forward 30s -->
        <button
          @click="skip(30)"
          class="hidden sm:flex shrink-0 items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          aria-label="Skip forward 30 seconds"
        >
          <ForwardIcon class="h-4 w-4" />
        </button>

        <!-- Close -->
        <button
          @click="handleClose"
          class="shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          aria-label="Close player"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon, MusicalNoteIcon, BackwardIcon, ForwardIcon } from '@heroicons/vue/24/outline'
import { usePlayerStore } from '@/stores/playerStore'
import { podcastService } from '@/services/podcastService'

const playerStore = usePlayerStore()

const audioEl = ref(null)
const isPlaying = ref(false)
const progress = ref(0)
const currentTimeSec = ref(0)
const durationSec = ref(0)
const playbackSpeed = ref(1)
const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

// MediaSession
function updateMediaSession(episode) {
  if (!('mediaSession' in navigator)) return
  const artwork = []
  if (episode.image) {
    artwork.push(
      { src: episode.image, sizes: '96x96', type: 'image/png' },
      { src: episode.image, sizes: '256x256', type: 'image/png' },
      { src: episode.image, sizes: '512x512', type: 'image/png' },
    )
  }
  navigator.mediaSession.metadata = new MediaMetadata({
    title: episode.title,
    artist: episode.feedTitle || '',
    album: 'Unlistened.me',
    artwork,
  })
}

function setupMediaSessionHandlers() {
  if (!('mediaSession' in navigator)) return
  navigator.mediaSession.setActionHandler('play', () => audioEl.value?.play())
  navigator.mediaSession.setActionHandler('pause', () => audioEl.value?.pause())
  navigator.mediaSession.setActionHandler('seekbackward', () => skip(-15))
  navigator.mediaSession.setActionHandler('seekforward', () => skip(30))
  navigator.mediaSession.setActionHandler('seekto', (details) => {
    if (audioEl.value && details.seekTime != null) {
      audioEl.value.currentTime = details.seekTime
    }
  })
}

onMounted(() => {
  setupMediaSessionHandlers()
})

// React to episode changes
watch(() => playerStore.currentEpisode, (episode) => {
  if (!audioEl.value) return
  if (!episode) {
    audioEl.value.pause()
    audioEl.value.src = ''
    isPlaying.value = false
    return
  }
  progress.value = 0
  currentTimeSec.value = 0
  durationSec.value = 0
  audioEl.value.src = episode.enclosureUrl
  audioEl.value.load()
  updateMediaSession(episode)
  audioEl.value.play().catch(() => {})
  trackPlay(episode)
})

function trackPlay(episode) {
  if (episode.id && episode.title) {
    podcastService.trackPlay(episode.id, episode.title).catch(() => {})
  }
}

function onLoadedMetadata() {
  durationSec.value = audioEl.value?.duration || 0
}

function onTimeUpdate() {
  if (!audioEl.value) return
  currentTimeSec.value = audioEl.value.currentTime
  if (audioEl.value.duration) {
    progress.value = (audioEl.value.currentTime / audioEl.value.duration) * 100
  }
  if ('mediaSession' in navigator && audioEl.value.duration) {
    navigator.mediaSession.setPositionState({
      duration: audioEl.value.duration,
      playbackRate: audioEl.value.playbackRate,
      position: audioEl.value.currentTime,
    })
  }
}

function onEnded() {
  isPlaying.value = false
  progress.value = 100
}

function togglePlay() {
  if (!audioEl.value) return
  if (audioEl.value.paused) {
    audioEl.value.play().catch(() => {})
  } else {
    audioEl.value.pause()
  }
}

function skip(seconds) {
  if (!audioEl.value) return
  audioEl.value.currentTime = Math.max(0, Math.min(audioEl.value.duration || 0, audioEl.value.currentTime + seconds))
}

function cycleSpeed() {
  const idx = speeds.indexOf(playbackSpeed.value)
  playbackSpeed.value = speeds[(idx + 1) % speeds.length]
  if (audioEl.value) audioEl.value.playbackRate = playbackSpeed.value
}

// Seek / scrub
const progressBarEl = ref(null)
const isSeeking = ref(false)

function getSeekRatio(event) {
  if (!progressBarEl.value) return 0
  const rect = progressBarEl.value.getBoundingClientRect()
  const clientX = event.touches
    ? (event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX ?? 0)
    : event.clientX
  return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
}

function onSeekStart(event) {
  if (!audioEl.value?.duration) return
  isSeeking.value = true
  const ratio = getSeekRatio(event)
  progress.value = ratio * 100
  audioEl.value.currentTime = ratio * audioEl.value.duration

  const onMove = (e) => {
    if (!audioEl.value?.duration) return
    const r = getSeekRatio(e)
    progress.value = r * 100
    audioEl.value.currentTime = r * audioEl.value.duration
  }
  const onEnd = () => {
    isSeeking.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onMove, { passive: true })
  document.addEventListener('touchend', onEnd)
}

function handleClose() {
  audioEl.value?.pause()
  playerStore.close()
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

onBeforeUnmount(() => {
  audioEl.value?.pause()
})
</script>
