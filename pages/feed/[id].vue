<script setup>
import FeedEpisodesView from '~/src/views/FeedEpisodesView.vue'

definePageMeta({
  dynamicContentMode: 'client-fetch-static-shell',
})

defineRouteRules({
  prerender: false,
})
</script>

<template>
  <FeedEpisodesView />
</template>
