<script setup>
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo('podcasts')

definePageMeta({
  dynamicContentMode: 'client-fetch-static-shell',
})
</script>

<template>
  <div class="bg-gray-950 min-h-screen flex items-center justify-center">
    <div class="text-sm text-gray-400">Loading…</div>
  </div>
</template>
