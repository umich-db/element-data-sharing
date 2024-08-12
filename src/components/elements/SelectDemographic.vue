<script setup>
import { ref, watch, inject } from "vue"
import Checkbox from 'primevue/checkbox'

const { filters, updateState } = inject('updateFilter');
const selectedDemographics = ref([...filters.value.demographics]);

const demographics = ref([
  { name: "Mothers", key: "m", value: "MOM" },
  { name: "Children", key: "c", value: "CHILD" }
])

watch(selectedDemographics, (newValue) => {
  updateState('demographics', newValue)
}, {deep: true});
</script>

<template>
  <div class="demographic-outer">
    <h4>Group</h4>
    <div class="demographic-row">
      <div v-for="demographic of demographics" :key="demographic.key">
        <div class="demographic-inner">
          <Checkbox v-model="selectedDemographics" :inputId="demographic.key" name="demographic" :value="demographic.value" />
          <label :for="demographic.key" class="cohort-label">{{ demographic.name }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demographic-outer {
  display: flex;
  flex-direction: column;
  border: none;
}

.demographic-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
}

.demographic-inner {
  display: flex;
  align-items: center;
  margin: 0.25rem 0;
}

.cohort-label {
  margin-left: 0.5rem;
}
</style>