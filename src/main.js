import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import draggable from 'vuedraggable';

import axios from 'axios'
import VueAxios from 'vue-axios'

import { useAuthStore } from './stores/authStore';
import { createPinia } from 'pinia'
const pinia = createPinia();


const app = createApp(App)
app.component('draggable', draggable);
app.use(router);
app.use(VueAxios, axios);
app.use(pinia);


const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');

