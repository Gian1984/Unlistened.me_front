import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const currentEpisode = ref(null)
  const isVisible = ref(false)

  function play(episode) {
    currentEpisode.value = { ...episode }
    isVisible.value = true
  }

  function close() {
    isVisible.value = false
    currentEpisode.value = null
  }

  return { currentEpisode, isVisible, play, close }
})
