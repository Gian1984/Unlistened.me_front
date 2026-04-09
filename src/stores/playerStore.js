import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const currentEpisode = ref(null)
  const isVisible = ref(false)

  function play(item) {
    currentEpisode.value = {
      ...item,
      contentType: item.contentType || 'podcast',
    }
    isVisible.value = true
  }

  function close() {
    isVisible.value = false
    currentEpisode.value = null
  }

  const isMusic = computed(() => currentEpisode.value?.contentType === 'music')
  const isPodcast = computed(() => currentEpisode.value?.contentType !== 'music')

  return { currentEpisode, isVisible, play, close, isMusic, isPodcast }
})
