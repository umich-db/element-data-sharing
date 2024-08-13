<script setup>
import { ref, provide } from 'vue'
import PageHeader from './components/PageHeader.vue'
import FilterComponent from './components/FilterComponent.vue'

const filters = ref({
  year: [1994, 2024],
  cohorts: [1, 2, 3],
  demographics: ['MOM', 'CHILD'],
  age: [0, 100]
})

const updateState = (key, newState) => {
  filters.value[key] = newState
}

provide('updateFilter', { filters, updateState })

</script>

<template>
  <div class="layout">
    <header>
      <PageHeader title="School of Public Health ELEMENT Data Search" />
    </header>
    <main>
      <FilterComponent title="Search Filters"/>
      <RouterView />
    </main>
  </div>
</template>

<style>
.layout {
  display: grid;
  grid-template-rows: 1fr 6fr;
  height: 100vh;
}

main {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 2rem;
}

header {
  padding-bottom: 2rem;
  text-align: center;
  justify-content: center;
}

a {
  text-decoration: none;
  color: black;
}
</style>
