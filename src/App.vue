<script setup>
import PageHeader from './components/PageHeader.vue'
import FilterComponent from './components/FilterComponent.vue'
import SearchComponent from './components/SearchComponent.vue'
</script>

<template>
  <div class="layout">
    <header>
      <PageHeader title="School of Public Health ELEMENT Data Search" />
    </header>
    <main>
      <FilterComponent title="Search Filters" />
      <SearchComponent />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: 1fr auto;
}

main {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 2rem;
}

header {
  padding-bottom: 2rem;
  text-align: center;
  justify-content: center;
}
</style>
