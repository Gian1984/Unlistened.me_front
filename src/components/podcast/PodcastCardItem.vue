<script setup>
import { StarIcon } from '@heroicons/vue/24/outline'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { stripHtmlTags } from '@/utils/text.js'

defineProps({
  feed: { type: Object, required: true }
})

defineEmits(['favorite'])
</script>

<template>
  <li
    class="rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
  >
    <router-link :to="'/feed/' + feed.id" class="block">
      <div class="flex items-center gap-3 p-4">
        <!-- Cover -->
        <div class="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-700">
          <img
            :src="feed.image || '/images/image_not_available_500.webp'"
            :alt="feed.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
            {{ feed.title }}
          </h3>
          <p class="text-xs text-gray-400 truncate mt-0.5">{{ feed.author }}</p>
          <p class="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {{ stripHtmlTags(feed.description) }}
          </p>
        </div>
      </div>
      <!-- Category badges -->
      <div v-if="feed.categories && Object.keys(feed.categories).length" class="px-4 pb-3 flex flex-wrap gap-1">
        <span
          v-for="(catName, catId) in Object.fromEntries(Object.entries(feed.categories || {}).slice(0, 3))"
          :key="catId"
          class="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
        >
          {{ catName }}
        </span>
      </div>
    </router-link>
    <!-- Action buttons -->
    <div class="flex items-center gap-2 px-4 pb-3">
      <button
        @click.prevent="$emit('favorite', feed.id, feed.title)"
        class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-400 transition-colors"
        title="Add to favourites"
      >
        <StarIcon class="h-4 w-4" />
        <span class="hidden sm:inline">Save</span>
      </button>
      <router-link
        :to="'/feed/' + feed.id"
        class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors ml-auto"
      >
        <span>Episodes</span>
        <ArrowRightIcon class="h-3.5 w-3.5" />
      </router-link>
    </div>
  </li>
</template>