<script setup>
import MusicFavoritesView from '~/src/views/MusicFavoritesView.vue'

definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <MusicFavoritesView />
</template>
