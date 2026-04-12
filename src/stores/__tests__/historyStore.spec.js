import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useHistoryStore } from '@/stores/historyStore'

describe('historyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('records play state and returns resumable progress', () => {
    const store = useHistoryStore()

    store.recordPlay({
      id: 42,
      title: 'Episode 42',
      contentType: 'podcast',
    })
    store.updateProgress(42, 60, 120)

    expect(store.entries).toHaveLength(1)
    expect(store.continueListening).toHaveLength(1)
    expect(store.getProgress(42)).toMatchObject({
      currentTime: 60,
      duration: 120,
      completed: false,
      percent: 50,
    })
  })

  it('marks an entry as completed when progress crosses threshold', () => {
    const store = useHistoryStore()

    store.recordPlay({
      id: 99,
      title: 'Finished episode',
      contentType: 'podcast',
    })
    store.updateProgress(99, 96, 100)

    expect(store.getProgress(99)?.completed).toBe(true)
    expect(store.continueListening).toHaveLength(0)
  })
})
