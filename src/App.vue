<!-- Legacy Vite root kept only as migration reference. Nuxt uses /app.vue instead. -->
<script setup>
import Navigation from '@/views/NavigationView.vue'
import OffcanvasPlayer from '@/components/OffcanvasPlayer.vue'
import CookieConsent from '@/components/CookieConsent.vue'
</script>
<template>
  <Navigation />
  <OffcanvasPlayer />
  <CookieConsent />
</template>
