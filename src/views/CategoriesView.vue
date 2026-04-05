<script setup>
import { ref, onMounted } from 'vue'
import Footer from '../components/Footer.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { podcastService } from '@/services/podcastService.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref([])
const loading = ref(true)

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
  <div class="bg-gray-950 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-4xl">
        <h1 class="mt-2 mb-6 text-3xl font-bold tracking-tight text-white sm:text-5xl">Explore Our Podcast Categories</h1>
        <p class="mt-2 text-lg leading-6 text-gray-400">
          Discover a wide range of podcast categories tailored to your interests. Whether you're into technology, health,
          entertainment, or education, we have something for everyone. Browse through our categories to find your next favorite podcast and dive into a world of engaging content.
        </p>
      </div>

      <div v-if="loading" class="mx-auto max-w-2xl lg:max-w-4xl pt-24">
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="n in 12" :key="n" class="h-9 rounded-lg animate-shimmer" />
        </div>
      </div>

      <div v-else class="mx-auto grid max-w-2xl lg:max-w-4xl grid-cols-1 gap-2 px-1 sm:grid-cols-2 sm:gap-x-1 sm:gap-y-0 sm:pt-24 lg:grid-cols-4 lg:gap-1 lg:px-3 xl:gap-1 pt-24">
        <div v-for="item in categories" :key="item.name" class="group relative -mx-1 flex gap-1 rounded-lg p-1 text-sm sm:flex-col sm:p-1">
          <div class="flex items-center justify-center rounded-lg bg-gray-800 group-hover:bg-pink-500 px-1 w-full transition-colors">
            <MagnifyingGlassIcon class="h-3 w-3 text-gray-400 mr-2"/>
            <button @click="onClick(item.id)" class="font-semibold text-gray-300 py-1">
              {{ item.name }}
              <span class="absolute inset-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
