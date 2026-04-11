import './assets/main.css'
import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import draggable from 'vuedraggable'

import { useAuthStore } from './stores/authStore'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
setActivePinia(pinia)

const authStore = useAuthStore()
authStore.initializeAuth()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.component('draggable', draggable)

app.mount('#app')

