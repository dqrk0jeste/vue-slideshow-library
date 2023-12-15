<script setup lang="ts">
  const props = defineProps(['title'])
</script>

<template>
  <div>
    {{ title }}
  </div>
</template>

<style scoped>
  div {
    width: 100%;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 3rem;
  }
</style>