<script setup>
import { ref, watch, inject } from "vue"
import Checkbox from 'primevue/checkbox';

const { filters, updateState } = inject('updateFilter');
const selectedCohorts = ref([...filters.value.cohorts]);
const cohorts = ref([
  {name: "Cholesterol", key: "1", value: 1},
  {name: "E3G-F0-Gen", key: "2", value: 2},
  {name: "E3G-F0Gen-CovidCall", key: "3", value: 3},
  {name: "E3G-F1-Gen", key: "4", value: 4},
  {name: "FattyLiverData", key: "5", value: 5},
  {name: "Historical", key: "6", value: 6},
  {name: "P01", key: "7", value: 7},
  {name: "P20", key: "8", value: 8},
]);


watch(selectedCohorts, (newValue) => {
  updateState('cohorts', newValue)
}, {deep: true});

</script>

<template>
  <div class="cohort-outer">
    <h4>Cohort</h4>
    <div v-for="cohort of cohorts" :key="cohort.key">
      <div class="cohort-inner">
        <Checkbox v-model="selectedCohorts" :inputId="cohort.key" name="cohort" :value="cohort.value" />
        <label :for="cohort.key" class="cohort-label">{{ cohort.name }}</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cohort-outer {
  display: flex;
  flex-direction: column;
  border: none;
}

.cohort-inner {
  display: flex;
  align-items: center;
  margin: 0.25rem 0;
}

.cohort-label {
  margin-left: 0.5rem;
}
</style>