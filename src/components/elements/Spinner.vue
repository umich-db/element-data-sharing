<script setup>
import ProgressSpinner from 'primevue/progressspinner';
</script>

<template>
  <div class="card flex justify-center">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
      aria-label="Custom ProgressSpinner" />
  </div>
</template>

<style scoped></style>