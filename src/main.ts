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

window.addEventListener('auth:expired', () => {
  useAuthStore(pinia).forceLogout();
});

window.addEventListener('auth:refreshed', (event) => {
  const store = useAuthStore(pinia);
  const { accessToken, refreshToken } = (
    event as CustomEvent<{
      accessToken: string;
      refreshToken: string;
    }>
  ).detail;
  store.accessToken = accessToken;
  store.refreshToken = refreshToken;
});

app.mount('#app');
