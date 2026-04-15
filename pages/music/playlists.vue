<script setup>
import MusicPlaylistsView from '~/src/views/MusicPlaylistsView.vue'

definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <MusicPlaylistsView />
</template>
