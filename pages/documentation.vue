<script setup>
import DocumentationView from '~/src/views/DocumentationView.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('documentation')
</script>

<template>
  <DocumentationView />
</template>
