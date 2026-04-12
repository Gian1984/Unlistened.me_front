import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import { useMusicLibraryStore } from '@/stores/musicLibraryStore'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        loginMessage: '',
        isInitialized: false,
        isInitializing: false,
    }),
    actions: {
        async initializeAuth(force = false) {
            if (this.isInitialized && !force) return this.isAuthenticated
            if (this.isInitializing && !force) return this.isAuthenticated

            this.isInitializing = true
            try {
                const response = await authService.currentUser()
                this.setUser(response.data?.user ?? response.data)
                return true
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 419) {
                    this.clearUser()
                    return false
                }

                this.clearUser()
                return false
            } finally {
                this.isInitializing = false
                this.isInitialized = true
            }
        },
        setUser(userData) {
            this.isAuthenticated = true
            this.user = userData
            this.isAdmin = userData?.is_admin === 1
            this.isInitialized = true
        },
        updateUser(updatedData) {
            if (this.user) {
                this.user = { ...this.user, ...updatedData }
            }
        },
        clearUser() {
            this.isAuthenticated = false
            this.isAdmin = false
            this.user = null
            this.isInitialized = true

            const musicLibraryStore = useMusicLibraryStore()
            musicLibraryStore.reset()
        },
    },
})
