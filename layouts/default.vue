<script setup>
import NavigationView from '~/src/views/NavigationView.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-950 text-gray-200">
    <ClientOnly>
      <NavigationView>
        <main class="flex-1 pb-28">
          <slot />
        </main>
      </NavigationView>
      <template #fallback>
        <div class="flex min-h-screen flex-1 items-center justify-center bg-gray-950">
          <div class="text-gray-400">Loading...</div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>