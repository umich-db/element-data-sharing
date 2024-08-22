import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import "primeicons/primeicons.css"; //icons
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DataView from 'primevue/dataview';
import router from './router'
// Component assets
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e0e6eb',
      100: '#e0e6eb',
      200: '#b3c2cd',
      300: '#8095a9',
      400: '#4d6785',
      500: '#284665',
      600: '#00274C',   // michigan blue
      700: '#002142',
      800: '#001937',
      900: '#00112d',
      950: '#00081f',
    }
  },
});

const app = createApp(App);
app.use(router).use(PrimeVue, {
  theme: {
    preset: MyPreset,
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
app.directive('tooltip', Tooltip);
app.mount('#app');

document.getElementById('app').style.padding = '0';

