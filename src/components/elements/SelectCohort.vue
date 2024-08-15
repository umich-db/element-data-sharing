<script setup>
import { ref, watch, inject } from "vue"
import Checkbox from 'primevue/checkbox';

const { filters, updateState } = inject('updateFilter');
const selectedCohorts = ref([...filters.value.cohorts]);
const cohorts = ref([
  {name: "Cohort 1 (1994 - 1997)", key: "1", value: 1},
  {name: "Cohort 2 (1997 - 2000)", key: "2", value: 2},
  {name: "Cohort 3 (2001 - 2005)", key: "3", value: 3},
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