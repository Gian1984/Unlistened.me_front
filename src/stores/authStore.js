import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        loginMessage: '',
    }),
    actions: {
        initializeAuth() {
            const savedState = localStorage.getItem('auth')
            if (savedState) {
                try {
                    const parsed = JSON.parse(savedState)
                    this.isAuthenticated = !!parsed.isAuthenticated
                    this.user = parsed.user || null
                    this.isAdmin = parsed.user?.is_admin === 1
                } catch (e) {
                    localStorage.removeItem('auth')
                }
            }
        },
        setUser(userData) {
            this.isAuthenticated = true
            this.user = userData
            this.isAdmin = userData?.is_admin === 1
            localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: userData }))
        },
        updateUser(updatedData) {
            if (this.user) {
                this.user = { ...this.user, ...updatedData }
                localStorage.setItem('auth', JSON.stringify({ isAuthenticated: this.isAuthenticated, user: this.user }))
            }
        },
        clearUser() {
            this.isAuthenticated = false
            this.isAdmin = false
            this.user = null
            localStorage.removeItem('auth')
        },
    },
})