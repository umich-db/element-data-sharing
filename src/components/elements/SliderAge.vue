<script setup>
import { ref, watch, inject } from 'vue';
import Slider from 'primevue/slider';

const { filters, updateState } = inject('updateFilter');
const selectedAge = ref([...filters.value.age]);

const minAge = 0;
const maxAge = 100;

watch(selectedAge, (newValue) => {
  updateState('age', newValue)
}, {deep: true});

</script>

<template>
  <div class="slider-container">
    <h4>Age</h4>
    <div>
      <div class="labels">
        <p>{{ selectedAge[0] }}</p>
        <p>{{ selectedAge[1] }}</p>
      </div>
      <Slider 
        v-model="selectedAge"
        range
        :min="minAge"
        :max="maxAge"
        class="slider"
        pt:root:style="height: 1rem; border-radius: 1rem; width: 9rem" />
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  display: flex;
  flex-direction: column;
}

.slider {
  margin: 0 0.5rem;
}

.labels {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}
</style>
