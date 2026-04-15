<script setup>
import SettingsView from '~/src/views/SettingsView.vue'

definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <SettingsView />
</template>
