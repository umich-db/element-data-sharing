<script setup>
import { ref } from "vue"
import SelectLanguage from "./elements/SelectLanguage.vue"

defineProps({
  title: {
    type: String,
    required: true
  }
})
const language = ref(true)

const updateState = (newState) => {
  language.value = newState
}
</script>

<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <SelectLanguage :isEnglish="language" @update-state="updateState"/>
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
}

h2 {
  align-self: flex-start;
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
