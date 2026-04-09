import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const currentEpisode = ref(null)
  const isVisible = ref(false)
  const isPlaying = ref(false)

  function play(item) {
    currentEpisode.value = {
      ...item,
      contentType: item.contentType || 'podcast',
    }
    isVisible.value = true
    isPlaying.value = true
  }

  function close() {
    isVisible.value = false
    currentEpisode.value = null
    isPlaying.value = false
  }

  function setPlaying(state) {
    isPlaying.value = state
  }

  function togglePlayback() {
    isPlaying.value = !isPlaying.value
  }

  function isCurrent(episodeId) {
    return isVisible.value
      && currentEpisode.value
      && String(currentEpisode.value.id) === String(episodeId)
  }

  function togglePlayFor(trackId) {
    if (isCurrent(trackId)) {
      togglePlayback()
      return true
    }
    return false
  }

  const isMusic = computed(() => currentEpisode.value?.contentType === 'music')
  const isPodcast = computed(() => currentEpisode.value?.contentType !== 'music')

  return { 
    currentEpisode, 
    isVisible, 
    isPlaying,
    play, 
    close, 
    setPlaying,
    togglePlayback,
    togglePlayFor,
    isCurrent, 
    isMusic, 
    isPodcast 
  }
})
