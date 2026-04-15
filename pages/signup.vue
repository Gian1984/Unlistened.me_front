<script setup>
import SignUpView from '~/src/views/SignUpView.vue'

definePageMeta({
  middleware: ['guest'],
})
</script>

<template>
  <SignUpView />
</template>
