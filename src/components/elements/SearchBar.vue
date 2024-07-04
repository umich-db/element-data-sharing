<script setup>
import { ref, watch } from 'vue'
import CategoryDropdown from './CategoryDropdown.vue'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'

const props = defineProps({
  query: String
})

const emit = defineEmits(['update-state'])

const currentQuery = ref(props.query)

watch(() => props.query, (newQuery) => {
  currentQuery.value = newQuery
})

const search = () => {
  emit('update-state', currentQuery.value)
};
</script>

<template>
  <div class="search-bar">
    <InputGroup class="container">
      <InputGroupAddon>
        <CategoryDropdown/>
      </InputGroupAddon>
      <InputText class="input" type="text" v-model="currentQuery" @keyup.enter="search" placeholder="Search..." />
      <InputGroupAddon>
        <Button type="button" @click="search" label="Search"/>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-inputgroup-addon {
  padding: 0;
  border: 0;
}

.input {
  padding: 0 1rem;
}
</style>
