<script setup>
import { ref, watch } from 'vue';
import Slider from 'primevue/slider';

const props = defineProps({
  year: Array
})

const selectedRange = ref(props.year)
const minYear = 1994;
const maxYear = 2024;

const emit = defineEmits(['update-state'])

watch(selectedRange, (newValue) => {
  emit('update-state', newValue);
});

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
      pt:root:style="height: 1rem; border-radius: 1rem; width: 10rem" />
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  display: flex;
  flex-direction: column;
}

.slider {
  width: 100%;
}

.labels {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}
</style>
