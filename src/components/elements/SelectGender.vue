<script setup>
import { ref, watch } from "vue"
import Checkbox from 'primevue/checkbox'

const props = defineProps({
  gender: Array
})

const selectedGenders = ref(props.gender);
const genders = ref([
  { name: "Female", key: "f", value: "female" },
  { name: "Male", key: "m", value: "male" }
])

const emit = defineEmits(['update-state'])

watch(selectedGenders, (newValue) => {
  emit('update-state', newValue)
});
</script>

<template>
  <div class="gender-outer">
    <h4>Gender</h4>
    <div class="gender-row">
      <div v-for="gender of genders" :key="gender.key">
        <div class="gender-inner">
          <Checkbox v-model="selectedGenders" :inputId="gender.key" name="gender" :value="gender.value" />
          <label :for="gender.key" class="cohort-label">{{ gender.name }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gender-outer {
  display: flex;
  flex-direction: column;
  border: none;
}

.gender-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
}

.gender-inner {
  display: flex;
  align-items: center;
  margin: 0.25rem 0;
}

.cohort-label {
  margin-left: 0.5rem;
}
</style>