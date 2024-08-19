<script setup>
</script>

<template>
  <div class="container">
    <img class="image-size" src="../assets/michigan_logo.png"/>
    <div class="content">
      <div class="content-item" style="font-weight: bold;">
        School of Public Health <span style="color: yellow;">&nbsp;|&nbsp;</span> 734-764-5425
      </div>
      <div class="content-item">
        1415 Washington Heights, Ann Arbor, MI 48109-2029
      </div>
      <div>&nbsp;</div>
      <div class="content-item">
        <span style="color: yellow;">&#169;&nbsp;</span> 2024 The Regents of the University of Michigan
        <span style="color: yellow;">&nbsp;|&nbsp;</span> Privacy Policy
        <span style="color: yellow;">&nbsp;|&nbsp;</span> Diversity, Equity, and Inclusion
        <span style="color: yellow;">&nbsp;|&nbsp;</span> Campus Safety
        <span style="color: yellow;">&nbsp;|&nbsp;</span> U-M HOME
      </div>
    </div>
  </div>
</template>


<style scoped>
.content {
  color: white;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.content-item {
  display: flex;
  justify-content: start;
}

.container {
  display: grid;
  grid-template-columns: 1fr 4fr;
  align-items: center;
  background-color: #00274c;
  padding: 1rem 2rem;
}

.image-size {
  width: 25%;
}
</style>
