<script setup>
defineProps({
  related: Array,
  updateQuery: Function
});
</script>

<template>
  <div class="container">
    <div class="title">
      Related Searches
    </div>
    <div class="grid">
      <div class="item" 
        v-for="(similar, idx) in related" 
        :key="`${similar.word}-${similar.similarity}-${idx}`"
        @click="updateQuery(similar.word)"
      >
        <i class="pi pi-search" style="font-size: 1rem; color: black;"></i>
        <div class="content">
          {{ similar.word }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.item {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: solid gray 1px;
  border-radius: 6px;
  background-color: #FAFAFA;
}

.item:hover {
  cursor: pointer;
  color: rgb(17, 176, 118);
  text-decoration: underline;
}
</style>