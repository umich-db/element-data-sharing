<script setup>
import { ref, watch } from 'vue'
import CategoryDropdown from './CategoryDropdown.vue'
import SearchDropdown from './SearchDropdown.vue'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Popover from 'primevue/popover';
import InputText from 'primevue/inputtext';

const props = defineProps({
  query: String,
  category: String,
})

const emit = defineEmits(['update-state', 'display-dropdown', 'display-all'])

const currentQuery = ref(props.query)
const isToggled = ref();
const loading = ref(false);

watch(() => props.query, (newQuery) => {
  currentQuery.value = newQuery
})

let timeout;
watch(currentQuery, (newValue) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    search(newValue);
  }, 500);
});

// TODO: Add a toggle so when user presses search, will display general view below
const search = () => {
  emit('update-state', currentQuery.value)
};
const clickedGeneral = () => {
  search();
  emit('display-all', currentQuery.value);
}
const clickedGeneralToggleDropdown = (event) => {
  isToggled.value.toggle(event);
  search();
  emit('display-all', currentQuery.value);
}

const toggleDropdown = (event) => {
  isToggled.value.toggle(event);
  search();
  emit('display-dropdown', currentQuery.value);
}
</script>

<template>
  <div>
    <div class="search-bar">
      <InputGroup class="container">
        <InputGroupAddon>
          <CategoryDropdown />
        </InputGroupAddon>
        <InputText type="text" v-model="currentQuery" @keyup.enter="clickedGeneralToggleDropdown" @click="toggleDropdown"
          placeholder="Search..." />
        <Button type="button" @click="clickedGeneral" label="Search" />
      </InputGroup>
    </div>
    <Popover ref="isToggled" append-to="self">
      <SearchDropdown :queryType="category" :query="currentQuery" class="dropdown-container" />
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
