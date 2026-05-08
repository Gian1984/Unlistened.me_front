import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSafeLocalStorage } from '@/utils/browserStorage'
import { historyService } from '@/services/historyService'

const STORAGE_KEY = 'unlistened.history.v1'
const MAX_ENTRIES = 50
const COMPLETION_THRESHOLD = 0.95
const RESUME_MIN_SECONDS = 5
const PROGRESS_DEBOUNCE_MS = 30000

function loadFromStorage() {
  try {
    const raw = getSafeLocalStorage().getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(entries) {
  try {
    getSafeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {}
}

export const useHistoryStore = defineStore('history', () => {
  const entries = ref(loadFromStorage())
  const progressTimers = {}

  const recent = computed(() =>
    [...entries.value].sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
  )

  const continueListening = computed(() =>
    recent.value.filter(
      (e) => !e.completed && e.currentTime > RESUME_MIN_SECONDS
    )
  )

  const continueListeningMusic = computed(() =>
    continueListening.value.filter((e) => e.type === 'music')
  )

  function getEntry(episodeId) {
    if (episodeId == null) return null
    return entries.value.find((e) => e.episodeId === episodeId) || null
  }

  function getProgress(episodeId) {
    const entry = getEntry(episodeId)
    if (!entry) return null
    const percent =
      entry.duration > 0 ? (entry.currentTime / entry.duration) * 100 : 0
    return { currentTime: entry.currentTime, duration: entry.duration, completed: entry.completed, percent }
  }

  // ---- API sync helpers ------------------------------------------------

  function entryToAPIPayload(entry) {
    return {
      external_id:    entry.episodeId,
      content_type:   entry.type || 'podcast',
      title:          entry.title || '',
      feed_title:     entry.feedTitle || null,
      feed_id:        entry.feedId   || null,
      image_url:      entry.image    || null,
      audio_url:      entry.enclosureUrl || null,
      current_time:   entry.currentTime  || 0,
      duration:       entry.duration     || 0,
      completed:      entry.completed    || false,
      last_played_at: entry.lastPlayedAt
        ? new Date(entry.lastPlayedAt).toISOString()
        : null,
    }
  }

  async function syncEntryToAPI(entry) {
    // Backend sync is a feature for authenticated users; guests keep their
    // history in localStorage only. Skipping the call here also prevents the
    // global 401 handler from kicking the user to /login on every play.
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return
    try {
      const { data } = await historyService.upsert(entryToAPIPayload(entry))
      const backendId = data?.data?.id ?? data?.id
      if (backendId) {
        const idx = entries.value.findIndex((e) => e.episodeId === entry.episodeId)
        if (idx >= 0) entries.value[idx].backendId = backendId
      }
    } catch {}
  }

  function scheduleSyncToAPI(episodeId) {
    if (progressTimers[episodeId]) clearTimeout(progressTimers[episodeId])
    progressTimers[episodeId] = setTimeout(() => {
      const current = entries.value.find((e) => e.episodeId === episodeId)
      if (current) syncEntryToAPI(current)
      delete progressTimers[episodeId]
    }, PROGRESS_DEBOUNCE_MS)
  }

  // ---- Load from API (call after successful auth) ----------------------

  async function loadFromAPI() {
    try {
      const { data } = await historyService.getHistory()
      const list = data?.data ?? data ?? []
      if (!Array.isArray(list) || list.length === 0) return
      const apiEntries = list.map((item) => ({
        episodeId:    item.external_id,
        title:        item.title,
        feedTitle:    item.feed_title,
        feedId:       item.feed_id,
        image:        item.image_url,
        enclosureUrl: item.audio_url,
        currentTime:  item.current_time,
        duration:     item.duration,
        completed:    item.completed,
        type:         item.content_type,
        lastPlayedAt: item.last_played_at
          ? new Date(item.last_played_at).getTime()
          : Date.now(),
        backendId: item.id,
      }))
      entries.value = apiEntries
      saveToStorage(apiEntries)
    } catch {}
  }

  // ---- Store actions ---------------------------------------------------

  function recordPlay(episode) {
    if (!episode?.id) return
    const idx = entries.value.findIndex((e) => e.episodeId === episode.id)
    const now = Date.now()
    if (idx >= 0) {
      entries.value[idx] = {
        ...entries.value[idx],
        title:        episode.title        || entries.value[idx].title,
        feedTitle:    episode.feedTitle    || entries.value[idx].feedTitle,
        feedId:       episode.feedId       ?? entries.value[idx].feedId,
        image:        episode.image        || entries.value[idx].image,
        enclosureUrl: episode.enclosureUrl || entries.value[idx].enclosureUrl,
        type:         episode.contentType  || 'podcast',
        lastPlayedAt: now,
      }
    } else {
      entries.value.unshift({
        episodeId:    episode.id,
        title:        episode.title        || '',
        feedTitle:    episode.feedTitle    || '',
        feedId:       episode.feedId       ?? null,
        image:        episode.image        || '',
        enclosureUrl: episode.enclosureUrl || '',
        currentTime:  0,
        duration:     0,
        completed:    false,
        type:         episode.contentType  || 'podcast',
        lastPlayedAt: now,
      })
    }
    trim()
    persist()
    const entry = entries.value.find((e) => e.episodeId === episode.id)
    if (entry) syncEntryToAPI(entry)
  }

  function updateProgress(episodeId, currentTime, duration) {
    const idx = entries.value.findIndex((e) => e.episodeId === episodeId)
    if (idx < 0) return
    entries.value[idx].currentTime = currentTime
    if (duration && duration > 0) {
      entries.value[idx].duration = duration
      if (currentTime / duration >= COMPLETION_THRESHOLD) {
        entries.value[idx].completed = true
      }
    }
    entries.value[idx].lastPlayedAt = Date.now()
    persist()
    scheduleSyncToAPI(episodeId)
  }

  function markCompleted(episodeId) {
    const idx = entries.value.findIndex((e) => e.episodeId === episodeId)
    if (idx < 0) return
    entries.value[idx].completed = true
    entries.value[idx].lastPlayedAt = Date.now()
    persist()
    syncEntryToAPI(entries.value[idx])
  }

  async function removeEntry(episodeId) {
    const entry = entries.value.find((e) => e.episodeId === episodeId)
    entries.value = entries.value.filter((e) => e.episodeId !== episodeId)
    persist()
    if (entry?.backendId) {
      try { await historyService.remove(entry.backendId) } catch {}
    }
  }

  async function clearAll() {
    entries.value = []
    persist()
    try { await historyService.clear() } catch {}
  }

  function trim() {
    if (entries.value.length > MAX_ENTRIES) {
      entries.value = [...entries.value]
        .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
        .slice(0, MAX_ENTRIES)
    }
  }

  function persist() {
    saveToStorage(entries.value)
  }

  return {
    entries,
    recent,
    continueListening,
    continueListeningMusic,
    getEntry,
    getProgress,
    loadFromAPI,
    recordPlay,
    updateProgress,
    markCompleted,
    removeEntry,
    clearAll,
  }
}, {
  persist: true,
})
