import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQueueStore } from '@/stores/queueStore.js'

export const usePlayerStore = defineStore('player', () => {
  const currentEpisode = ref(null)
  const isVisible = ref(false)

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
  }

  function isCurrent(episodeId) {
    return isVisible.value
      && currentEpisode.value
      && String(currentEpisode.value.id) === String(episodeId)
  }

  const isMusic = computed(() => currentEpisode.value?.contentType === 'music')
  const isPodcast = computed(() => currentEpisode.value?.contentType !== 'music')

  return { 
    currentEpisode, 
    isVisible, 
    play, 
    close, 
    isCurrent, 
    isMusic, 
    isPodcast 
  }
})
