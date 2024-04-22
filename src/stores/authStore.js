import { defineStore } from 'pinia';
import { ref, computed } from "vue";

export const useAuthStore = defineStore('auth', {

    state: () => ({
        isAuthenticated: false,
        user: null,
    }),
    actions: {
        initializeAuth() {
            const savedState = localStorage.getItem('auth');
            if (savedState) {
                const { isAuthenticated, user } = JSON.parse(savedState);
                this.isAuthenticated = isAuthenticated;
                this.user = user;
            }
        },
        setUser(user) {
            this.isAuthenticated = true;
            this.user = user;
            localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user }));
        },
        clearUser() {
            this.isAuthenticated = false;
            this.user = null;
            localStorage.removeItem('auth');
        }
    },
});