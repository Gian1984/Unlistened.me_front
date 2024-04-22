import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import { useAuthStore } from './stores/authStore';
import { createPinia } from 'pinia'
const pinia = createPinia();


const app = createApp(App)
app.use(router);
app.use(VueAxios, axios);
app.use(pinia);

const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');

