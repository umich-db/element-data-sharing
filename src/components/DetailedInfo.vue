<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = ref(route.params.id);

onMounted(() => {
  console.log('DetailedInfo ID:', id.value);
});

const title = "Lorem ipsum dolor study";
const variables = [
  { name: "Night", description: "Order of day in the 7 day wear sequence" },
  { name: "Total Wake", description: "Total time awake calculated not using sleep diary" },
  { name: "Total Sleep", description: "Total time asleep calculated not using sleep diary" },
  { name: "Night", description: "Order of day in the 7 day wear sequence" },
  { name: "Total Wake", description: "Total time awake calculated not using sleep diary" },
  { name: "Total Sleep", description: "Total time asleep calculated not using sleep diary" },
  { name: "Night", description: "Order of day in the 7 day wear sequence" },
  { name: "Total Wake", description: "Total time awake calculated not using sleep diary" },
  { name: "Total Sleep", description: "Total time asleep calculated not using sleep diary" },
  { name: "Night", description: "Order of day in the 7 day wear sequence" },
  { name: "Total Wake", description: "Total time awake calculated not using sleep diary" },
  { name: "Total Sleep", description: "Total time asleep calculated not using sleep diary" },
]

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