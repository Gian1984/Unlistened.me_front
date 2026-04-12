import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQueueStore } from '@/stores/queueStore'

describe('queueStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
  })

  it('sets queue around the selected start index', () => {
    const store = useQueueStore()
    const tracks = [{ id: 1 }, { id: 2 }, { id: 3 }]

    store.setQueue(tracks, 1)

    expect(store.currentItem).toEqual({ id: 2 })
    expect(store.history).toEqual([{ id: 1 }])
    expect(store.items).toEqual([{ id: 3 }])
  })

  it('moves forward and backward symmetrically', () => {
    const store = useQueueStore()
    const tracks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

    store.setQueue(tracks, 0)

    expect(store.consumeNext()).toEqual({ id: 'b' })
    expect(store.currentItem).toEqual({ id: 'b' })
    expect(store.history).toEqual([{ id: 'a' }])

    expect(store.popPrevious()).toEqual({ id: 'a' })
    expect(store.currentItem).toEqual({ id: 'a' })
    expect(store.items).toEqual([{ id: 'b' }, { id: 'c' }])
  })
})
