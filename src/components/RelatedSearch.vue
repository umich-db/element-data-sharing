<script setup>
import { inject } from 'vue';

const emit = defineEmits(['update-state', 'display-all'])
const { handleClickGeneralUpdate } = inject('clickedGeneral');

const props = defineProps({
  related: Array,
  updateQuery: Function
});

const search = (queryValue) => {
  props.updateQuery(queryValue);
  handleClickGeneralUpdate();
};
</script>

<template>
  <div class="container">
    <div class="title">
      Related Searches
    </div>
    <div class="grid">
      <div class="item" 
        v-for="(similar, idx) in props.related" 
        :key="`${similar.word}-${similar.similarity}-${idx}`"
        @click="search(similar.word)"
      >
        <div class="no-hover">
          <i class="pi pi-search" style="font-size: 1rem; color: black;"></i>
        </div>
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

.no-hover:hover {
  text-decoration: none;
}
</style>