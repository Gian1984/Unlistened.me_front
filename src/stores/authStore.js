import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {

    state: () => ({
        isAuthenticated: false,
        user: null,
        loginMessage: '',
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
        updateUser(updatedData) {
            if (this.user) {
                this.user = { ...this.user, ...updatedData };
                localStorage.setItem('auth', JSON.stringify({ isAuthenticated: this.isAuthenticated, user: this.user }));
            }
        },
        clearUser() {
            this.isAuthenticated = false;
            this.user = null;
            localStorage.removeItem('auth');
        },
        setLoginMessage(loginMessage) {
            this.loginMessage = loginMessage;
        },
        clearLoginMessage() {
            this.loginMessage = null;
        }
    },
});