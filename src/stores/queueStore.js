import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQueueStore = defineStore('queue', () => {
  const items = ref([])
  const history = ref([])
  const currentIndex = ref(-1)

  function setQueue(tracks, startIndex = 0) {
    items.value = tracks.slice(startIndex + 1)
    history.value = tracks.slice(0, startIndex + 1)
    currentIndex.value = startIndex
  }

  function addToQueue(track) {
    items.value.push(track)
  }

  function playNext(track) {
    items.value.unshift(track)
  }

  function consumeNext() {
    if (!items.value.length) return null
    const track = items.value.shift()
    history.value.push(track)
    currentIndex.value++
    return track
  }

  function pushHistory(track) {
    history.value.push(track)
  }

  function popPrevious() {
    if (!history.value.length) return null
    const track = history.value.pop()
    items.value.unshift(track)
    currentIndex.value--
    return track
  }

  function clear() {
    items.value = []
    history.value = []
    currentIndex.value = -1
  }

  function setCurrentIndex(idx) {
    currentIndex.value = idx
  }

  const hasNext = computed(() => items.value.length > 0)
  const hasPrevious = computed(() => history.value.length > 1)
  const isEmpty = computed(() => items.value.length === 0 && history.value.length === 0)

  return {
    items,
    history,
    currentIndex,
    setQueue,
    addToQueue,
    playNext,
    consumeNext,
    pushHistory,
    popPrevious,
    clear,
    setCurrentIndex,
    hasNext,
    hasPrevious,
    isEmpty,
  }
})
