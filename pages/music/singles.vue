<script setup>
import MusicSinglesView from '~/src/views/MusicSinglesView.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('musicSingles')
</script>

<template>
  <MusicSinglesView />
</template>
