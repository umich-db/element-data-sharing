<script setup>
import { ref, watch } from 'vue';
import SelectButton from 'primevue/selectbutton';

const selectedLanguage = ref('English');
const languages = ref(['English', 'Spanish']);

defineProps({
  isEnglish: Boolean
})

const emit = defineEmits(['update-state'])

watch(selectedLanguage, (newValue) => {
  emit('update-state', newValue === 'English');
});

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
