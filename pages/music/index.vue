<script setup>
import MusicHomeView from '~/src/views/MusicHomeView.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('music')
</script>

<template>
  <MusicHomeView />
</template>
