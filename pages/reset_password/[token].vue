<script setup>
import ResetPasswordView from '~/src/views/ResetPasswordView.vue'

definePageMeta({
  middleware: ['guest'],
})
</script>

<template>
  <ResetPasswordView />
</template>
