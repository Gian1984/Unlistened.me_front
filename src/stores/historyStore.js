import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'unlistened.history.v1'
const MAX_ENTRIES = 50
const COMPLETION_THRESHOLD = 0.95
const RESUME_MIN_SECONDS = 5

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // quota exceeded or storage disabled — fail silently
  }
}

export const useHistoryStore = defineStore('history', () => {
  const entries = ref(loadFromStorage())

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
    return {
      currentTime: entry.currentTime,
      duration: entry.duration,
      completed: entry.completed,
      percent,
    }
  }

  function recordPlay(episode) {
    if (!episode?.id) return
    const idx = entries.value.findIndex((e) => e.episodeId === episode.id)
    const now = Date.now()
    if (idx >= 0) {
      entries.value[idx] = {
        ...entries.value[idx],
        title: episode.title || entries.value[idx].title,
        feedTitle: episode.feedTitle || entries.value[idx].feedTitle,
        feedId: episode.feedId ?? entries.value[idx].feedId,
        image: episode.image || entries.value[idx].image,
        enclosureUrl: episode.enclosureUrl || entries.value[idx].enclosureUrl,
        type: episode.contentType || 'podcast',
        lastPlayedAt: now,
      }
    } else {
      entries.value.unshift({
        episodeId: episode.id,
        title: episode.title || '',
        feedTitle: episode.feedTitle || '',
        feedId: episode.feedId ?? null,
        image: episode.image || '',
        enclosureUrl: episode.enclosureUrl || '',
        currentTime: 0,
        duration: 0,
        completed: false,
        type: episode.contentType || 'podcast',
        lastPlayedAt: now,
      })
    }
    trim()
    persist()
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
  }

  function markCompleted(episodeId) {
    const idx = entries.value.findIndex((e) => e.episodeId === episodeId)
    if (idx < 0) return
    entries.value[idx].completed = true
    entries.value[idx].lastPlayedAt = Date.now()
    persist()
  }

  function removeEntry(episodeId) {
    entries.value = entries.value.filter((e) => e.episodeId !== episodeId)
    persist()
  }

  function clearAll() {
    entries.value = []
    persist()
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
    recordPlay,
    updateProgress,
    markCompleted,
    removeEntry,
    clearAll,
  }
})
