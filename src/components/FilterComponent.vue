<script setup>
import { defineProps } from 'vue'
import Divider from 'primevue/divider'
import SelectCohort from './elements/SelectCohort.vue'
import SelectDemographic from './elements/SelectDemographic.vue'
import SliderAge from './elements/SliderAge.vue'

defineProps({
  title: {
    type: String,
    required: true
  }
}) 
const requestDataLink = 'https://docs.google.com/forms/d/e/1FAIpQLSc5SQeDOZv6hBp5gyCF5byiOri6_zCcU5gSk5Wj0PucAB52Dw/viewform';
</script>

<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <SelectCohort />
    <Divider pt:root:style="margin: 0" />
    <h3>Demographics</h3>
    <SelectDemographic />
    <SliderAge />
    <a :href="requestDataLink" target="_blank" rel="noopener noreferrer">
        <Button label="Request Data" icon="pi pi-envelope" size="small" iconPos="right" rounded style="color: var(--text-color);"/>
      </a>
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
