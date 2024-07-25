  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    setup() {
      const route = useRoute();
      const id = ref(route.params.id);
  
      onMounted(() => {
        console.log('DetailedInfo ID:', id.value);
      });
  
      return {
        id
      };
    }
  };
  </script>
  
  <template>
    <div>
      <h1>Detailed Information</h1>
      <p>ID: {{ id }}</p>
    </div>
  </template>
  