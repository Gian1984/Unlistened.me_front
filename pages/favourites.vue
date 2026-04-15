<script setup>
import FavouritesView from '~/src/views/FavouritesView.vue'

definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <FavouritesView />
</template>
