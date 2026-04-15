<script setup>
import DashboardView from '~/src/views/DashboardView.vue'

definePageMeta({
  middleware: ['admin'],
})
</script>

<template>
  <DashboardView />
</template>
