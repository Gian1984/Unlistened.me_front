<script setup>
import NavigationView from '~/src/views/NavigationView.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 pb-28">
    <ClientOnly>
      <NavigationView>
        <slot />
      </NavigationView>
      <template #fallback>
        <div class="flex min-h-screen items-center justify-center bg-gray-950">
          <div class="text-gray-400">Loading...</div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
