import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSafeSessionStorage } from '@/utils/browserStorage'

/**
 * Playback queue. Single source of truth for what comes "next" and
 * what came "before" the currently playing item — for both podcasts
 * and music.
 *
 * Model: `currentItem` is tracked explicitly. Neither `history` nor
 * `items` ever contain the current item. This makes prev/next
 * symmetric and avoids the "popPrevious returns the current track"
 * footgun the previous implementation had.
 */
export const useQueueStore = defineStore('queue', () => {
  const items = ref([])         // upcoming tracks (NOT including current)
  const history = ref([])       // past tracks (NOT including current)
  const currentItem = ref(null) // the track currently playing, or null

  function setQueue(tracks, startIndex = 0) {
    if (!Array.isArray(tracks) || tracks.length === 0) {
      clear()
      return
    }
    const idx = Math.max(0, Math.min(startIndex, tracks.length - 1))
    history.value = tracks.slice(0, idx)
    currentItem.value = tracks[idx]
    items.value = tracks.slice(idx + 1)
  }

  function addToQueue(track) {
    items.value.push(track)
  }

  function playNextUp(track) {
    items.value.unshift(track)
  }

  function consumeNext() {
    if (!items.value.length) return null
    if (currentItem.value) history.value.push(currentItem.value)
    currentItem.value = items.value.shift()
    return currentItem.value
  }

  function popPrevious() {
    if (!history.value.length) return null
    if (currentItem.value) items.value.unshift(currentItem.value)
    currentItem.value = history.value.pop()
    return currentItem.value
  }

  function clear() {
    items.value = []
    history.value = []
    currentItem.value = null
  }

  /**
   * Returns true when the queue's current item matches the given id.
   * `playerStore.play()` uses this to decide whether a play() call is
   * coming from a queue context (setQueue → play) or from a one-off
   * play (Continue listening, single episode page, etc.). When false,
   * the queue is cleared so prev/next don't pull from a stale list.
   */
  function isCurrent(id) {
    if (currentItem.value == null || id == null) return false
    return String(currentItem.value.id) === String(id)
  }

  const hasNext = computed(() => items.value.length > 0)
  const hasPrevious = computed(() => history.value.length > 0)
  const isEmpty = computed(
    () => items.value.length === 0 && history.value.length === 0 && !currentItem.value
  )

  return {
    items,
    history,
    currentItem,
    setQueue,
    addToQueue,
    playNextUp,
    consumeNext,
    popPrevious,
    clear,
    isCurrent,
    hasNext,
    hasPrevious,
    isEmpty,
  }
}, {
  persist: {
    key: 'queue',
    storage: getSafeSessionStorage(),
  }
})
