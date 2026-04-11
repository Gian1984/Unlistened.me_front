import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false)
    const isAdmin = ref(false)
    const user = ref(null)
    const loginMessage = ref('')

    function initializeAuth() {
        const savedState = localStorage.getItem('auth')
        if (savedState) {
            try {
                const { isAuthenticated: isAuth, user: savedUser } = JSON.parse(savedState)
                isAuthenticated.value = isAuth
                user.value = savedUser
                isAdmin.value = savedUser?.is_admin === 1
            } catch (e) {
                localStorage.removeItem('auth')
            }
        }
    }

    function setUser(userData) {
        isAuthenticated.value = true
        user.value = userData
        isAdmin.value = userData?.is_admin === 1
        localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: userData }))
    }

    function updateUser(updatedData) {
        if (user.value) {
            user.value = { ...user.value, ...updatedData }
            localStorage.setItem('auth', JSON.stringify({ isAuthenticated: isAuthenticated.value, user: user.value }))
        }
    }

    function clearUser() {
        isAuthenticated.value = false
        isAdmin.value = false
        user.value = null
        localStorage.removeItem('auth')
    }

    return {
        isAuthenticated,
        isAdmin,
        user,
        loginMessage,
        initializeAuth,
        setUser,
        updateUser,
        clearUser,
    }
})