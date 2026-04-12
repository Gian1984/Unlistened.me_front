import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const hoisted = vi.hoisted(() => ({
  currentUser: vi.fn(),
  resetLibrary: vi.fn(),
}))

vi.mock('@/services/authService', () => ({
  authService: {
    currentUser: hoisted.currentUser,
  },
}))

vi.mock('@/stores/musicLibraryStore', () => ({
  useMusicLibraryStore: () => ({
    reset: hoisted.resetLibrary,
  }),
}))

import { useAuthStore } from '@/stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    hoisted.currentUser.mockReset()
    hoisted.resetLibrary.mockReset()
  })

  it('hydrates authenticated user from backend bootstrap', async () => {
    hoisted.currentUser.mockResolvedValue({
      data: {
        user: {
          id: 7,
          email: 'user@example.com',
          is_admin: 1,
        },
      },
    })

    const store = useAuthStore()
    const result = await store.initializeAuth()

    expect(result).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.email).toBe('user@example.com')
    expect(store.isAdmin).toBe(true)
    expect(store.isInitialized).toBe(true)
  })

  it('clears auth state when bootstrap returns 401', async () => {
    hoisted.currentUser.mockRejectedValue({
      response: { status: 401 },
    })

    const store = useAuthStore()
    store.setUser({ id: 9, email: 'stale@example.com', is_admin: 1 })

    const result = await store.initializeAuth(true)

    expect(result).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBe(null)
    expect(store.isAdmin).toBe(false)
    expect(hoisted.resetLibrary).toHaveBeenCalledTimes(1)
  })
})
