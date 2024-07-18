<script setup>
import { ref, watch } from 'vue'
import Divider from 'primevue/divider'
import SelectLanguage from './elements/SelectLanguage.vue'
import SliderYear from './elements/SliderYear.vue'
import SelectCohort from './elements/SelectCohort.vue'
import SelectGender from './elements/SelectGender.vue'
import SliderAge from './elements/SliderAge.vue'

defineProps({
  title: {
    type: String,
    required: true
  }
})

const state = ref({
  language: true,
  year: [1994, 2024],
  cohorts: [1, 2, 3],
  genders: ['female', 'male'],
  age: [0, 100]
})

const updateState = (key, newState) => {
  state.value[key] = newState
}

watch(state, (newValue) => {
    console.log(`
      ------- New state -------
      Language: ${newValue.language}
      Year Range: [${newValue.year}]
      Cohorts: ${newValue.cohorts}
      Genders: ${newValue.genders}
      Age Range: [${newValue.age}]
    `)
  },
  { deep: true }
)
</script>

<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <SelectLanguage @update-state="newState => updateState('language', newState)" />
    <SliderYear :year="state.year" @update-state="newState => updateState('year', newState)" />
    <SelectCohort :cohort="state.cohorts" @update-state="newState => updateState('cohorts', newState)" />
    <Divider pt:root:style="margin: 0" />
    <h3>Demographics</h3>
    <SelectGender :gender="state.genders" @update-state="newState => updateState('genders', newState)" />
    <SliderAge :age="state.age" @update-state="newState => updateState('age', newState)" />
  </div>
</template>

<style scoped>
.container {
  background-color: #FAFAFA;
  border: solid 2px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: flex-start;
  padding: 0.5rem 1rem 1rem 1rem;
  gap: 1rem;
  height: fit-content;
  width: fit-content;
}

h2, h3 {
  align-self: flex-start;
  font-weight: 500;
}

.button-group {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

button.selected {
  background-color: blue;
  color: white;
  cursor: not-allowed;
}

button:not(.selected):hover {
  background-color: #e0e0e0;
}

button:focus {
  outline: none;
  box-shadow: 0 0 3px 2px rgba(0, 123, 255, 0.25);
}
</style>
