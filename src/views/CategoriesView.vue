<script setup>
import { ref, computed, onMounted } from 'vue'
import Footer from '../components/Footer.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { podcastService } from '@/services/podcastService.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref([])
const loading = ref(true)
const searchFilter = ref('')

const filteredCategories = computed(() => {
  if (!searchFilter.value) return categories.value
  const q = searchFilter.value.toLowerCase()
  return categories.value.filter(c => c.name.toLowerCase().includes(q))
})

async function fetchSearchCat() {
  try {
    const response = await podcastService.getCategories()
    categories.value = response.data.feeds
  } catch (err) {
    console.error('Error fetching categories:', err)
  } finally {
    loading.value = false
  }
}

function onClick(id) {
  router.push({ name: 'SearchResults', query: { s: id } })
}

onMounted(() => {
  fetchSearchCat()
})
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-5xl mb-3">Categories</h1>
        <p class="text-gray-400 text-lg max-w-3xl">
          Browse podcast genres and find shows that match your interests.
        </p>
      </div>

      <!-- Filter input -->
      <div class="mb-8">
        <div class="relative max-w-sm">
          <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchFilter"
            type="text"
            placeholder="Filter categories..."
            class="w-full rounded-lg bg-gray-800 border-2 border-gray-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="flex flex-wrap gap-2">
        <div v-for="n in 24" :key="n" class="h-9 rounded-full animate-shimmer" :style="{ width: (70 + Math.random() * 50) + 'px' }" />
      </div>

      <!-- Categories grid -->
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="cat in filteredCategories"
          :key="cat.id"
          @click="onClick(cat.id)"
          class="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-sm font-medium text-gray-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-colors"
        >
          <MagnifyingGlassIcon class="h-3.5 w-3.5 text-gray-500 group-hover:text-white transition-colors" />
          {{ cat.name }}
        </button>
      </div>

      <!-- Empty filter state -->
      <div v-if="!loading && filteredCategories.length === 0" class="py-12 text-center">
        <p class="text-gray-500 text-sm">No categories matching "{{ searchFilter }}"</p>
      </div>
    </div>
  </div>
  <Footer />
</template>
