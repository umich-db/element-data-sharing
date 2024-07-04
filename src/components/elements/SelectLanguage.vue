<script setup>
import Button from 'primevue/button'

defineProps({
  isEnglish: Boolean
})

const emit = defineEmits(['update-state'])

const selectEnglish = () => {
  emit('update-state', true)
}

const selectSpanish = () => {
  emit('update-state', false)
}
</script>

<template>
  <div class="button-group">
    <Button label="English" @click="selectEnglish" :disabled="isEnglish" :class="{ selected: isEnglish }" />
    <Button label="Spanish" @click="selectSpanish" :disabled="!isEnglish" :class="{ selected: !isEnglish }" />
  </div>
</template>

<style scoped>
.button-group {
  display: flex;
  gap: 10px;
}

button {
  background-color: lightgray;
  border: none;
}

button.selected {
  background-color: blue;
  color: white;
  cursor: not-allowed;
}

button:not(.selected):hover {
  background-color: gray;
}
</style>
