<script setup>
import AboutView from '~/src/views/AboutView.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('about')
</script>

<template>
  <AboutView />
</template>
