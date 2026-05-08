<script setup>
import { onMounted } from 'vue'
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo('podcasts')

const router = useRouter()

// Apache rewrites /episode/:id → /episode/index.html for non-bots,
// so on refresh we land on this shell. Forward to the real path so
// Nuxt loads pages/episode/[id].vue.
onMounted(() => {
  const path = window.location.pathname
  if (/^\/episode\/.+/.test(path)) router.replace(path + window.location.search)
})
</script>

<template>
  <div class="bg-gray-950 min-h-screen flex items-center justify-center">
    <div class="text-sm text-gray-400">Loading…</div>
  </div>
</template>
