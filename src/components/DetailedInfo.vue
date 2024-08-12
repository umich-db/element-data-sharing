<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { queryVariables } from '../utils/searchUtils';

const route = useRoute();
const id = ref(route.params.id);

const title = ref("");
const year = ref("");
const demographic = ref("");
const variables = ref([]);

const fetchData = async () => {
  console.log(`ID being queried: ${id._value}`);
  const result = await queryVariables(parseInt(id.value, 10));
  if (result !== undefined && result !== null && result.length > 0) {
    title.value = result[0][2];
    year.value = result[0][3];
    demographic.value = result[0][4];
    variables.value = result.map((variable) => {
      return {name: variable[0], description: variable[1]}
    })
  }
}

onMounted(fetchData);

watch(() => route.params.id, (newId) => {
  id.value = newId;
  fetchData();
})

const viewData = () => {
  // maybe download as an excel or spreadsheet file
  console.log("data is viewed.")
}
</script>

<template>
  <div className="container">
    <div className="title-container">
      <h1>{{ title }}</h1>
      <Button label="Request Data" icon="pi pi-envelope" size="small" iconPos="right" rounded />
    </div>
    <div className="desc-container">
      <h3>Year of Visit: {{ year }}</h3>
      <h3>Demographic: {{ demographic == "MOM" ? "Mother" : "Child" }}</h3>
    </div>
    <div className="variables-container">
      <div className="variables-subtitle-container">
        <h2>Variables</h2>
        <Button label="View Metadata" @clicked="viewData" rounded />
      </div>
      <DataTable 
        :value="variables" 
        stripedRows 
        showGridlines 
        paginator 
        :rows="7" 
        :rowsPerPageOptions="[5, 7, 10, 15, 20]"
        tableStyle="min-width: 50rem"
      >
        <Column field="name" header="Name" style="width: 20%"></Column>
        <Column field="description" header="Description" style="width: 80%"></Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.title-container {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 1rem;
}

.desc-container {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 1rem;
}

.variables-container {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.variables-subtitle-container {
  display: flex;
  justify-content: space-between;
}

:deep(.p-datatable) {
  width: 100%;
  border: 1px solid black;
}
</style>