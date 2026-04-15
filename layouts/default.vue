<script setup>
import NavigationView from '~/components/NavigationView.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-950 text-gray-200 font-sans antialiased">
    <NavigationView>
      <slot />
    </NavigationView>
  </div>
</template>
