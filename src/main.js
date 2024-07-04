import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core CSS
import "primeicons/primeicons.css"; //icons
import PrimeVue from 'primevue/config';
// Component assets
import Button from 'primevue/button';

const app = createApp(App);
app.use(PrimeVue);
app.component('Button', Button);
app.mount('#app');
