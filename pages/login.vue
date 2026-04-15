<script setup>
import LoginView from '~/src/views/LoginView.vue'

definePageMeta({
  middleware: ['guest'],
})
</script>

<template>
  <LoginView />
</template>
