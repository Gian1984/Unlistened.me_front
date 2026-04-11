import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import draggable from 'vuedraggable';

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuthStore } from './stores/authStore'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.component('draggable', draggable)

const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')

