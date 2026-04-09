<template>
  <audio
    ref="audioEl"
    preload="auto"
    playsinline
    x-webkit-airplay="allow"
    @loadedmetadata="onLoadedMetadata"
    @timeupdate="onTimeUpdate"
    @play="onPlay"
    @pause="onPause"
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
      :class="[
        'fixed bottom-0 right-0 z-40 bg-gray-900 border-t border-gray-700 shadow-2xl transition-all duration-300',
        isDesktopCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-72'
      ]"
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
          <!-- Music: artist + license + via Jamendo (CC attribution required) -->
          <div
            v-if="playerStore.isMusic"
            class="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-400 leading-tight"
          >
            <span class="truncate">{{ playerStore.currentEpisode.feedTitle }}</span>
            <LicenseBadge
              v-if="playerStore.currentEpisode.licenseUrl"
              :url="playerStore.currentEpisode.licenseUrl"
              size="xs"
            />
            <a
              v-if="playerStore.currentEpisode.shareUrl"
              :href="playerStore.currentEpisode.shareUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
              class="hidden sm:inline shrink-0 text-gray-500 hover:text-indigo-400 transition-colors"
              title="Open on Jamendo"
            >
              · via Jamendo
            </a>
          </div>
          <!-- Podcast: feed title -->
          <p
            v-else-if="playerStore.currentEpisode.feedTitle"
            class="text-xs text-gray-400 truncate leading-tight mt-0.5"
          >
            {{ playerStore.currentEpisode.feedTitle }}
          </p>
        </div>

        <!-- Time display -->
        <span class="hidden sm:block text-xs text-gray-400 shrink-0 tabular-nums">
          {{ formatTime(currentTimeSec) }} / {{ formatTime(durationSec) }}
        </span>

        <!-- Favorite (music only) -->
        <FavoriteMusicButton
          v-if="currentMusicTrack"
          :track="currentMusicTrack"
          size="sm"
        />

        <!-- Speed control (podcasts only) -->
        <button
          v-if="playerStore.isPodcast"
          @click="cycleSpeed"
          class="hidden sm:flex shrink-0 items-center justify-center h-7 px-1.5 rounded text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-colors tabular-nums"
          aria-label="Playback speed"
        >
          {{ playbackSpeed }}x
        </button>

        <!-- Previous track -->
        <button
          @click="playPrevious"
          class="flex shrink-0 items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          :class="{ 'opacity-30 cursor-not-allowed': !queueStore.hasPrevious }"
          :disabled="!queueStore.hasPrevious"
          aria-label="Previous track"
          title="Previous track"
        >
          <BackwardIcon class="h-4 w-4" />
        </button>

        <!-- Skip back 15s -->
        <button
          @click="skip(-15)"
          class="relative flex shrink-0 items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          aria-label="Skip back 15 seconds"
          title="Skip back 15 seconds"
        >
          <ArrowUturnLeftIcon class="h-5 w-5" stroke-width="2" />
          <span class="absolute inset-0 flex items-center justify-center pt-[3px] text-[8px] font-bold tabular-nums leading-none">15</span>
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
          class="relative flex shrink-0 items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          aria-label="Skip forward 30 seconds"
          title="Skip forward 30 seconds"
        >
          <ArrowUturnRightIcon class="h-5 w-5" stroke-width="2" />
          <span class="absolute inset-0 flex items-center justify-center pt-[3px] text-[8px] font-bold tabular-nums leading-none">30</span>
        </button>

        <!-- Next track -->
        <button
          @click="playNext"
          class="flex shrink-0 items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          :class="{ 'opacity-30 cursor-not-allowed': !queueStore.hasNext }"
          :disabled="!queueStore.hasNext"
          aria-label="Next track"
          title="Next track"
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
} from '@heroicons/vue/24/solid'
import {
  XMarkIcon,
  MusicalNoteIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/vue/24/outline'
import { usePlayerStore } from '@/stores/playerStore'
import { useQueueStore } from '@/stores/queueStore'
import { useHistoryStore } from '@/stores/historyStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { podcastService } from '@/services/podcastService'
import { musicService } from '@/services/musicService'
import { useSidebarState } from '@/composables/useSidebarState.js'
import { jamendoToPlayerPayload } from '@/utils/musicTrackPayload.js'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import FavoriteMusicButton from '@/components/music/FavoriteMusicButton.vue'

const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const historyStore = useHistoryStore()
const messageStore = useMessageStore()
const { isDesktopCollapsed } = useSidebarState()

// When the player is showing a Jamendo track, expose it in the raw
// shape that FavoriteMusicButton / AddToPlaylistMenu expect. The
// player normalizes incoming items into a podcast-style payload, so
// we map back here instead of leaking player concerns into the store.
const currentMusicTrack = computed(() => {
  const ep = playerStore.currentEpisode
  if (!ep || ep.contentType !== 'music') return null
  return {
    id: ep.id,
    name: ep.title,
    artist_name: ep.feedTitle,
    artist_id: ep.artistId,
    album_name: ep.albumName,
    album_image: ep.image,
    audio: ep.enclosureUrl,
    duration: ep.duration,
    license_ccurl: ep.licenseUrl,
    shareurl: ep.shareUrl,
  }
})

const audioEl = ref(null)
const isPlaying = ref(false)
const progress = ref(0)
const currentTimeSec = ref(0)
const durationSec = ref(0)
const playbackSpeed = ref(1)
const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

// History tracking
const HISTORY_SAVE_INTERVAL_SEC = 5
const RESUME_MIN_SECONDS = 5
let lastHistorySaveAt = 0
let pendingResumeTime = 0

// Screen-off / background audio continuity
let userInitiatedPause = false
let wasPlayingBeforeHidden = false

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
  const isMusic = episode.contentType === 'music'
  navigator.mediaSession.metadata = new MediaMetadata({
    title: episode.title,
    artist: episode.feedTitle || '',
    album: isMusic ? (episode.albumName || 'Jamendo') : 'Unlistened.me',
    artwork,
  })
}

function safeSetActionHandler(action, handler) {
  try {
    navigator.mediaSession.setActionHandler(action, handler)
  } catch (e) {
    // Action not supported by this browser, ignore.
  }
}

function setupMediaSessionHandlers() {
  if (!('mediaSession' in navigator)) return
  safeSetActionHandler('play', async () => {
    userInitiatedPause = false
    try {
      await audioEl.value?.play()
    } catch (e) {
      // ignore
    }
  })
  safeSetActionHandler('pause', () => { userInitiatedPause = true; audioEl.value?.pause() })
  safeSetActionHandler('stop', () => handleClose())
  safeSetActionHandler('seekbackward', (details) => skip(-(details?.seekOffset || 15)))
  safeSetActionHandler('seekforward', (details) => skip(details?.seekOffset || 30))
  safeSetActionHandler('seekto', (details) => {
    if (!audioEl.value || details.seekTime == null) return
    if (details.fastSeek && 'fastSeek' in audioEl.value) {
      audioEl.value.fastSeek(details.seekTime)
    } else {
      audioEl.value.currentTime = details.seekTime
    }
  })
  // Lock screen / Bluetooth headset prev/next.
  // These delegate to the same playPrevious / playNext used by the
  // on-screen buttons, so behavior stays consistent across surfaces.
  safeSetActionHandler('previoustrack', () => playPrevious())
  safeSetActionHandler('nexttrack', () => playNext())
}

onMounted(() => {
  setupMediaSessionHandlers()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

// Some mobile browsers throttle JS in background tabs and the audio element can
// drop out of sync with the OS lock screen. Track state on hide so we can
// detect an OS-initiated pause and resume when the screen comes back on.
function onVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    wasPlayingBeforeHidden = !!audioEl.value && !audioEl.value.paused
    return
  }
  if (!audioEl.value) return
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = audioEl.value.paused ? 'paused' : 'playing'
  }
  // If audio was playing before the screen turned off and the OS paused it
  // without the user asking, resume automatically.
  if (wasPlayingBeforeHidden && audioEl.value.paused && !userInitiatedPause) {
    audioEl.value.play().catch(() => {})
  }
  wasPlayingBeforeHidden = false
}

// React to episode changes
watch(() => playerStore.currentEpisode, (episode) => {
  if (!audioEl.value) return
  // Persist progress for the previous episode before switching
  saveHistoryNow()
  if (!episode) {
    audioEl.value.pause()
    audioEl.value.removeAttribute('src')
    audioEl.value.load()
    isPlaying.value = false
    playerStore.setPlaying(false)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null
      navigator.mediaSession.playbackState = 'none'
    }
    pendingResumeTime = 0
    return
  }
  progress.value = 0
  currentTimeSec.value = 0
  durationSec.value = 0
  lastHistorySaveAt = 0
  // Look up saved progress for resume
  const savedProgress = historyStore.getProgress(episode.id)
  pendingResumeTime =
    savedProgress &&
    !savedProgress.completed &&
    savedProgress.currentTime > RESUME_MIN_SECONDS
      ? savedProgress.currentTime
      : 0
  // Push metadata BEFORE play() so the OS lock screen sees the new track
  // immediately. Without this iOS may kill audio shortly after the screen
  // turns off because it thinks no media is active.
  updateMediaSession(episode)
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'playing'
  }
  userInitiatedPause = false
  audioEl.value.src = episode.enclosureUrl
  audioEl.value.load()
  audioEl.value.play().catch((err) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused'
    }
    // AbortError fires when a new src is set before play() resolves
    // (very common when the user clicks a different track quickly).
    // NotAllowedError is browser autoplay policy — the user just needs
    // to tap once. Both are non-actionable so we stay silent.
    // Anything else (CDN 404, decoder failure, etc.) deserves a notice
    // so the user understands why the play button isn't moving.
    const name = err?.name
    if (name && name !== 'AbortError' && name !== 'NotAllowedError') {
      messageStore.setMessage('Could not play this track. The audio source may be unavailable.')
    }
  })
  // Track all plays (podcast + music) in history for "Continue listening"
  trackPlay(episode)
  historyStore.recordPlay(episode)
})

function trackPlay(episode) {
  if (episode.id && episode.title) {
    podcastService.trackPlay(episode.id, episode.title).catch(() => {})
  }
}

function onLoadedMetadata() {
  durationSec.value = audioEl.value?.duration || 0
  if (pendingResumeTime > 0 && audioEl.value) {
    audioEl.value.currentTime = pendingResumeTime
    pendingResumeTime = 0
  }
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
  // Throttled history save
  if (
    audioEl.value.currentTime - lastHistorySaveAt >= HISTORY_SAVE_INTERVAL_SEC
  ) {
    saveHistoryNow()
  }
}

function saveHistoryNow() {
  const episode = playerStore.currentEpisode
  if (!episode?.id || !audioEl.value) return
  // Music in v1: no history persistence (avoid mixing with podcast continue listening).
  if (episode.contentType === 'music') return
  const ct = audioEl.value.currentTime || 0
  const dur = audioEl.value.duration || 0
  if (ct <= 0) return
  historyStore.updateProgress(episode.id, ct, dur)
  lastHistorySaveAt = ct
}

function onPlay() {
  isPlaying.value = true
  playerStore.setPlaying(true)
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'playing'
  }
}

async function onEnded() {
  isPlaying.value = false
  playerStore.setPlaying(false)
  progress.value = 100
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'none'
  }
  const episode = playerStore.currentEpisode
  if (episode?.id && episode.contentType !== 'music') {
    historyStore.markCompleted(episode.id)
  }
  const next = queueStore.consumeNext()
  if (next) {
    playerStore.play(next)
    return
  }
  // Music: when the explicit queue runs dry, fall back to Jamendo's
  // "similar tracks" so listening sessions don't dead-end. Spotify-style
  // endless autoplay. Podcasts intentionally don't get this behavior —
  // letting an episode end is the natural stop signal there.
  if (episode?.id && episode.contentType === 'music') {
    try {
      const response = await musicService.getSimilar(episode.id)
      const raw =
        response?.data?.results ??
        response?.data?.data ??
        response?.data ??
        []
      const similar = Array.isArray(raw) ? raw : []
      if (similar.length) {
        const payloads = similar
          .filter(t => t && t.audio)
          .map(jamendoToPlayerPayload)
        if (payloads.length) {
          queueStore.setQueue(payloads, 0)
          playerStore.play(payloads[0])
        }
      }
    } catch (err) {
      // Network/CDN hiccup — silent. The session just stops, which is
      // the same as the previous behavior.
    }
  }
}

function onPause() {
  isPlaying.value = false
  playerStore.setPlaying(false)
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'paused'
  }
  saveHistoryNow()
}

function togglePlay() {
  if (!audioEl.value) return
  if (audioEl.value.paused) {
    userInitiatedPause = false
    audioEl.value.play().catch(() => {})
  } else {
    userInitiatedPause = true
    audioEl.value.pause()
  }
}

// Track-list rows in the music views call playerStore.togglePlay() when
// the user clicks the cover of the currently active track. The audio
// element lives here, so we react to a counter signal from the store.
watch(() => playerStore.toggleSignal, () => {
  togglePlay()
})

function skip(seconds) {
  if (!audioEl.value) return
  audioEl.value.currentTime = Math.max(0, Math.min(audioEl.value.duration || 0, audioEl.value.currentTime + seconds))
}

function cycleSpeed() {
  const idx = speeds.indexOf(playbackSpeed.value)
  playbackSpeed.value = speeds[(idx + 1) % speeds.length]
  if (audioEl.value) audioEl.value.playbackRate = playbackSpeed.value
}

function playNext() {
  const next = queueStore.consumeNext()
  if (next) {
    playerStore.play(next)
  }
}

function playPrevious() {
  const prev = queueStore.popPrevious()
  if (prev) {
    playerStore.play(prev)
  }
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
  userInitiatedPause = true
  saveHistoryNow()
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
  saveHistoryNow()
  audioEl.value?.pause()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>
