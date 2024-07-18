<script setup>
import { ref, watch } from "vue"
import Checkbox from 'primevue/checkbox';

const props = defineProps({
  cohort: Array
})

const selectedCohorts = ref(props.cohort);
const cohorts = ref([
  {name: "Cohort 1 (1994 - 1997)", key: "1", value: 1},
  {name: "Cohort 2 (1997 - 2000)", key: "2", value: 2},
  {name: "Cohort 3 (2001 - 2005)", key: "3", value: 3},
]);

const emit = defineEmits(['update-state'])

watch(selectedCohorts, (newValue) => {
  emit('update-state', newValue);
});

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