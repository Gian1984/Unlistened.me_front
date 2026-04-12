import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import draggable from 'vuedraggable';
import { useAuthStore } from './stores/authStore';
import { useMessageStore } from './stores/messageStore'
import { registerUnauthorizedHandler } from './services/sessionHandler'

const pinia = createPinia();

const app = createApp(App)
app.component('draggable', draggable);
app.use(router);
app.use(pinia);

const authStore = useAuthStore();
const messageStore = useMessageStore()

registerUnauthorizedHandler(() => {
  authStore.clearUser()
  messageStore.setMessage('Session expired. Please login again.')
  if (router.currentRoute.value.name !== 'Login') {
    router.push({ name: 'Login' })
  }
})

authStore.initializeAuth();

app.mount('#app');
