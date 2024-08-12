<script setup>
import { ref, watch, inject } from 'vue';
import Slider from 'primevue/slider';

const { filters, updateState } = inject('updateFilter');
const selectedRange = ref([...filters.value.year]);

const minYear = 1994;
const maxYear = 2024;

watch(selectedRange, (newValue) => {
  updateState('year', newValue)
}, {deep: true});

</script>

<template>
  <div class="slider-container">
    <h4>Year of Visit</h4>
    <div>
      <div class="labels">
        <p>
          {{ selectedRange[0] }}
        </p>
        <p>
          {{ selectedRange[1] }}
        </p>
      </div>
      <Slider 
      v-model="selectedRange"
      range
      :min="minYear"
      :max="maxYear"
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
  margin: 0 1.25rem;
}

.labels {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0.25rem;
}
</style>
