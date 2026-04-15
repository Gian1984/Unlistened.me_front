<script setup>
import SingleEpisodeView from '~/src/views/SingleEpisodeView.vue'

definePageMeta({
  dynamicContentMode: 'client-fetch-static-shell',
})

defineRouteRules({
  prerender: false,
})
</script>

<template>
  <SingleEpisodeView />
</template>
