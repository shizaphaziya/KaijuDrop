<script setup lang="ts">
/**
 * Main Application Component.
 * 
 * Serves as the primary entry point for the Nuxt application.
 * Manages the global layout wrapper and provides the structure for page-level transitions.
 */
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Global transitions if needed */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
