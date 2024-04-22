<script setup>
import Footer from '../components/Footer.vue'
</script>
<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Is user in</h2>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  }
};
</script>

