import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import './assets/main.css';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(Toast);

// Quand la session expire (refresh KO), on force le retour au login
window.addEventListener('auth:expired', () => {
  useAuthStore(pinia).forceLogout();
});

app.mount('#app');