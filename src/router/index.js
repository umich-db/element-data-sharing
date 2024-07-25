import { createRouter, createWebHistory } from 'vue-router';
import DetailedInfo from '@/components/DetailedInfo.vue';
import SearchComponent from '@/components/SearchComponent.vue';

const routes = [
  {
    path: '/',
    name: 'SearchComponent',
    component: SearchComponent
  },
  {
    path: '/detail/:id',
    name: 'DetailedInfo',
    component: DetailedInfo
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
