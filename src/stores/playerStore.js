import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQueueStore } from '@/stores/queueStore.js'
import { getSafeSessionStorage } from '@/utils/browserStorage'

export const usePlayerStore = defineStore('player', () => {
  const currentEpisode = ref(null)
  const isVisible = ref(false)
  // Mirrors the audio element's actual playing state. OffcanvasPlayer
  // is the single writer (via setPlaying); views read this to decide
  // whether a track row should show a play or pause icon.
  const isPlaying = ref(false)
  // Bumped by views/components that want to toggle play/pause without
  // touching the audio element directly. OffcanvasPlayer watches this
  // and calls its local togglePlay() handler on each change.
  const toggleSignal = ref(0)

  function play(item) {
    // If the play call isn't part of an active queue context (i.e. a
    // view called setQueue() right before this), nuke the stale queue
    // so prev/next don't jump back to a podcast you played an hour ago.
    // Views with a queue (FeedEpisodesView, MusicPlaylistDetailView,
    // MusicHomeView, MusicFavoritesView, SearchResultView) all call
    // queueStore.setQueue(...) BEFORE play(), so currentItem already
    // matches `item` and the queue is preserved.
    const queueStore = useQueueStore()
    if (!queueStore.isCurrent(item?.id)) {
      queueStore.clear()
    }
    currentEpisode.value = {
      ...item,
      contentType: item.contentType || 'podcast',
    }
    isVisible.value = true
  }

  function close() {
    isVisible.value = false
    currentEpisode.value = null
    isPlaying.value = false
  }

  function isCurrent(episodeId) {
    return isVisible.value
      && currentEpisode.value
      && String(currentEpisode.value.id) === String(episodeId)
  }

  // True only when this id is the active episode AND audio is actually
  // playing. Use this in track lists so a "pause" icon really means
  // "click to pause" — never "click to restart from zero".
  function isPlayingTrack(episodeId) {
    return isPlaying.value && isCurrent(episodeId)
  }

  function setPlaying(value) {
    isPlaying.value = !!value
  }

  function togglePlay() {
    toggleSignal.value++
  }

  const isMusic = computed(() => currentEpisode.value?.contentType === 'music')
  const isPodcast = computed(() => currentEpisode.value?.contentType !== 'music')

  return {
    currentEpisode,
    isVisible,
    isPlaying,
    toggleSignal,
    play,
    close,
    isCurrent,
    isPlayingTrack,
    setPlaying,
    togglePlay,
    isMusic,
    isPodcast,
  }
}, {
  persist: {
    key: 'player',
    pick: ['currentEpisode', 'isVisible'],
    storage: getSafeSessionStorage(),
  }
})
