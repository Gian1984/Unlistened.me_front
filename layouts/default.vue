<script setup>
import NavigationView from '~/src/views/NavigationView.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 pb-28">
    <NavigationView>
      <slot />
    </NavigationView>
  </div>
</template>
