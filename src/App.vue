<script setup>
import PageHeader from './components/PageHeader.vue'
import FilterComponent from './components/FilterComponent.vue'
import SearchComponent from './components/SearchComponent.vue'
import Databasesearch from './components/DatabaseSearch.vue'
</script>

<template>
  <div class="container">
    <header>
      <PageHeader title="School of Public Health ELEMENT Data Search" />
    </header>

    <main>
      <FilterComponent title="Search Filters" />
      <SearchComponent title="Search Bar and Results" />
      <Databasesearch class="custom-database-search"/>
    </main>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

main {
  display: flex;
  justify-content: space-evenly;
}

header {
  padding: 20px;
  text-align: center;
  justify-content: center;
}
.custom-database-search {
  margin-top: 50px;
  padding: 10px;
  background-color: #332076;
}
</style>
