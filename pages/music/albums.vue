<script setup>
import MusicAlbumsView from '~/src/views/MusicAlbumsView.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('musicAlbums')
</script>

<template>
  <MusicAlbumsView />
</template>
