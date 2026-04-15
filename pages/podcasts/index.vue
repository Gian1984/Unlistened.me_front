<script setup>
import PodcastsView from '~/src/views/PodcastsView.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('podcasts')
</script>

<template>
  <PodcastsView />
</template>
