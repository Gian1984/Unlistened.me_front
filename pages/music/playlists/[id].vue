<script setup>
import MusicPlaylistDetailView from '~/src/views/MusicPlaylistDetailView.vue'

definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <MusicPlaylistDetailView />
</template>
