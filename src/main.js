import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import Aura from '@primevue/themes/aura';
import "primeicons/primeicons.css"; //icons
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DataView from 'primevue/dataview';
import router from './router'
// Component assets
import Button from 'primevue/button';

const app = createApp(App);
app.use(router).use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
});
app.component('DataTable', DataTable);
// eslint-disable-next-line vue/multi-word-component-names
app.component('Column', Column);
app.component('DataView', DataView);
app.component('Button', Button);
app.mount('#app');

document.getElementById('app').style.padding = '0';