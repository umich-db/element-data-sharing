
<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchStudyData } from '@/api/studyApi'

export default {
  name: 'StudyDescription',
  setup() {
    const route = useRoute()
    const study = ref({})

    onMounted(async () => {
      const id = route.params.id
      study.value = await fetchStudyData(id)
    })

    return {
      study
    }
  }
}
</script>

<!--template>
  <div class="study-description">
    <h1>{{ study.title }}</h1>
    <p>Date: {{ study.date }}</p>
    <p>Cohort: {{ study.cohort }}</p>
    <div class="description">
      <h2>Description</h2>
      <p>{{ study.description }}</p>
    </div>
    <div class="variables">
      <h2>Variables</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variable in study.variables" :key="variable.name">
            <td>{{ variable.name }}</td>
            <td>{{ variable.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template-->

<template>
  <div class="study-description">
    <div class="header">
      <h1>{{ study.title }}</h1>
      <button class="request-data">Request Data</button>
      <button class="view-metadata">View Metadata</button>
    </div>
    <div class="variables">
      <h2>Variables</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variable in study.variables" :key="variable.name">
            <td>{{ variable.name }}</td>
            <td>{{ variable.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>