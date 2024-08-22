<script setup>
import { ref, provide } from 'vue'
import PageHeader from './components/PageHeader.vue'
import FooterComponent from './components/Footer.vue'
import FilterComponent from './components/FilterComponent.vue'

const filters = ref({
  year: [1994, 2024],
  cohorts: [1, 2, 3],
  demographics: ['MOM', 'CHILD'],
  age: [0, 100]
})

let updateTimeout;
const updateState = (key, newState) => {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    filters.value[key] = newState;
  }, 1000);
};

provide('updateFilter', { filters, updateState })
</script>

<template>
  <div class="layout">
    <header>
      <PageHeader title="ELEMENT Data Search" />
    </header>
    <main>
      <FilterComponent title="Search Filters" />
      <RouterView />
    </main>
    <footer>
      <FooterComponent />
    </footer>
  </div>
</template>

<style>
@font-face {
  font-family: 'CustomFont';
  src: url('@/assets/Roboto-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.layout {
  display: grid;
  grid-template-rows: 1fr 6fr 1fr;
  gap: 2rem;
  height: 120vh;
  --michigan-maize: #FFCB05;
  --michigan-blue: #00274C;
  --text-color: var(--michigan-maize);
  font-family: 'CustomFont', sans-serif;
}

main {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 2rem;
  padding: 0 4rem;
}

header {
  text-align: center;
  justify-content: center;
}

footer {
  text-align: center;
  justify-content: center;
}

a {
  text-decoration: none;
  color: black;
}
</style>
