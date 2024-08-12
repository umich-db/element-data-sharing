<script setup>
import { ref, watch, inject } from 'vue';
import SelectButton from 'primevue/selectbutton';

const { filters, updateState } = inject('updateFilter');
const selectedLanguage = ref(filters.value.language ?? 'English');
const languages = ref(['English', 'Spanish']);

watch(selectedLanguage, (newValue) => {
  updateState('language', newValue)
}, {deep: true});
</script>

<template>
  <div class="button-group">
    <h4>Displayed Language</h4>
    <SelectButton v-model="selectedLanguage" :options="languages" />
  </div>
</template>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
}
</style>
