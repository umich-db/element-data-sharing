<script setup>
import { ref, watch } from 'vue'
import CategoryDropdown from './CategoryDropdown.vue'
import SearchDropdown from './SearchDropdown.vue'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'

const props = defineProps({
  query: String,
  category: String,
})

const emit = defineEmits(['update-state'])

const currentQuery = ref(props.query)
const isToggled = ref(false);

watch(() => props.query, (newQuery) => {
  currentQuery.value = newQuery
})

const search = () => {
  emit('update-state', currentQuery.value)
};

const toggleDropdown = () => {
  isToggled.value = !isToggled.value;
}

console.log(props.category)
</script>

<template>
  <div class="search-bar">
    <InputGroup class="container">
      <InputGroupAddon>
        <CategoryDropdown />
      </InputGroupAddon>
      <InputText type="text" v-model="currentQuery" @keyup.enter="search" placeholder="Search..." />
      <Button type="button" @click="search" label="Search" />
      <Button @click="toggleDropdown" :icon="isToggled ? 'pi pi-angle-up' : 'pi pi-angle-down'" severity="secondary"
        outlined />
    </InputGroup>
    <SearchDropdown :queryType="category" class="dropdown-container" v-if="isToggled"/>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dropdown-container {
  border: solid lightgray 1px;
  margin-top: 0.5rem;
  border-radius: 4px;
}

.p-inputgroupaddon {
  padding: 0;
  border: 0;
}
</style>
