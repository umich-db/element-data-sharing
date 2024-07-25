<script setup>
import PageHeader from './components/PageHeader.vue'
import FilterComponent from './components/FilterComponent.vue'
</script>

<template>
  <div class="layout">
    <header>
      <PageHeader title="School of Public Health ELEMENT Data Search" />
    </header>
    <main>
      <FilterComponent title="Search Filters" />
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
