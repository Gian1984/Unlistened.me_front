import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import draggable from 'vuedraggable';


import { useAuthStore } from './stores/authStore';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


const app = createApp(App)
app.component('draggable', draggable);
app.use(router);
app.use(pinia);


const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');

