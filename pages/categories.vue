<script setup>
import CategoriesView from '~/src/views/CategoriesView.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('categories')
</script>

<template>
  <CategoriesView />
</template>
