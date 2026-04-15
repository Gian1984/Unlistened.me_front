<script setup>
import ForgotPasswordView from '~/src/views/ForgotPasswordView.vue'

definePageMeta({
  middleware: ['guest'],
})
</script>

<template>
  <ForgotPasswordView />
</template>
