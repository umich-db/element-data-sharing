import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import Aura from '@primevue/themes/aura';
import "primeicons/primeicons.css"; //icons
import PrimeVue from 'primevue/config';
// Component assets
import Button from 'primevue/button';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
});
app.component('Button', Button);
app.mount('#app');
