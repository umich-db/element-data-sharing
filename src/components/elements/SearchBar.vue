<script setup>
import { ref, watch } from 'vue'
import CategoryDropdown from './CategoryDropdown.vue'
import SearchDropdown from './SearchDropdown.vue'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Popover from 'primevue/popover'


const props = defineProps({
  query: String
})

const emit = defineEmits(['update-state'])

const currentQuery = ref(props.query)
const isToggled = ref(false);
const open = ref();

watch(() => props.query, (newQuery) => {
  currentQuery.value = newQuery
})

const search = () => {
  emit('update-state', currentQuery.value)
};

const toggleDropdown = (event) => {
  isToggled.value = !isToggled.value;
  open.value.toggle(event);
}
</script>

<template>
  <div class="search-bar">
    <InputGroup class="container">
      <InputGroupAddon>
        <CategoryDropdown />
      </InputGroupAddon>
      <InputText class="input" type="text" v-model="currentQuery" @keyup.enter="search" placeholder="Search..." />
      <Button type="button" @click="search" label="Search" />
      <Button @click="toggleDropdown" :icon="isToggled ? 'pi pi-angle-up' : 'pi pi-angle-down'" severity="secondary"
        outlined />
    </InputGroup>
    <Popover ref="open" :dismissable="false" class="container-dropdown">
      <SearchDropdown />
    </Popover>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container-dropdown {
  max-width: 50%;
}

.p-inputgroup-addon {
  padding: 0;
  border: 0;
}

.input {
  padding: 0 1rem;
}
</style>
