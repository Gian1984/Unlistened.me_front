<script setup>
import MusicAlbumView from '~/src/views/MusicAlbumView.vue'

definePageMeta({
  dynamicContentMode: 'client-fetch-static-shell',
})

defineRouteRules({
  prerender: false,
})
</script>

<template>
  <MusicAlbumView />
</template>
