<script setup>
import HomeView from '~/src/views/HomeView.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('home')
</script>

<template>
  <HomeView />
</template>
