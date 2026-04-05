<script setup>
defineProps({
  icon: { type: [Object, Function], default: null },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  actionText: { type: String, default: '' },
  actionLink: { type: String, default: '/feed_listing' },
})
</script>

<template>
  <div class="text-center py-16 px-6">
    <component :is="icon" v-if="icon" class="mx-auto h-12 w-12 text-gray-600" />
    <h3 class="mt-4 text-lg font-semibold text-white">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm text-gray-400 max-w-md mx-auto">{{ description }}</p>
    <div v-if="actionText" class="mt-6">
      <router-link
        :to="actionLink"
        class="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-full text-sm transition-colors"
      >
        {{ actionText }} <span class="ml-1" aria-hidden="true">&rarr;</span>
      </router-link>
    </div>
  </div>
</template>
