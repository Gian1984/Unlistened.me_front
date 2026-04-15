<script setup>
import BookmarksView from '~/src/views/BookmarksView.vue'

definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <BookmarksView />
</template>
