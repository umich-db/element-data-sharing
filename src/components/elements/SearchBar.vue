<script>
export default {
  data() {
    return {
      query: ''
    };
  },
  methods: {
    search() {
      console.log('Searching for:', this.query);
      // You can add your search logic here
    }
  }
};
</script>

<template>
  <div class="search-bar">
    <input 
      type="text" 
      v-model="query" 
      @keyup.enter="search" 
      placeholder="Search..." 
    />
    <button @click="search">Search</button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
}

input {
  margin-right: 10px;
  padding: 5px;
  font-size: 16px;
}

button {
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
