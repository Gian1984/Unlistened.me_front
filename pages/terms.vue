<script setup>
import TermsView from '~/src/views/TermsView.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('terms')
</script>

<template>
  <TermsView />
</template>
