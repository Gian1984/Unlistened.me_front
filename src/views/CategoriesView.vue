<script setup>
import { ref, computed, onMounted } from 'vue'
import Footer from '../components/Footer.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { MusicalNoteIcon } from '@heroicons/vue/24/outline'
import { podcastService } from '@/services/podcastService.js'
import { useRoute, useRouter } from 'vue-router'
import { useSeo } from '@/seo/composables/useSeo.js'
import { categoriesSeo } from '@/seo/registry/index.js'
import { useMusicGenres } from '@/composables/useMusicGenres.js'

useSeo(categoriesSeo)

const router = useRouter()
const route = useRoute()
const activeTab = ref(route.query.tab === 'music' ? 'music' : 'podcasts')
const categories = ref([])
const loading = ref(true)
const searchFilter = ref('')
const { genres: musicGenres, loadGenres, loading: musicGenresLoading } = useMusicGenres()

const filteredCategories = computed(() => {
  if (!searchFilter.value) return categories.value
  const q = searchFilter.value.toLowerCase()
  return categories.value.filter(c => c.name.toLowerCase().includes(q))
})

const filteredGenres = computed(() => {
  if (!searchFilter.value) return musicGenres.value
  const q = searchFilter.value.toLowerCase()
  return musicGenres.value.filter(g => g.label.toLowerCase().includes(q))
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

function onPodcastCatClick(id, name) {
  router.push({ name: 'SearchResults', query: { s: id, name } })
}

function onGenreClick(tag) {
  router.push({ path: '/music', query: { genre: tag } })
}

function switchTab(tab) {
  activeTab.value = tab
  searchFilter.value = ''
}

onMounted(() => {
  fetchSearchCat()
  loadGenres()
})
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl mb-3">Categories</h1>
        <p class="text-base leading-7 text-gray-400 max-w-3xl">
          Browse podcasts by genre or explore music styles.
        </p>
      </div>

      <!-- Tab toggle -->
      <div class="mb-6 flex items-center gap-4">
        <div class="flex rounded-full bg-gray-800 p-0.5">
          <button
            type="button"
            @click="switchTab('podcasts')"
            class="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="activeTab === 'podcasts' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Podcasts
          </button>
          <button
            type="button"
            @click="switchTab('music')"
            class="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="activeTab === 'music' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'"
          >
            <MusicalNoteIcon class="h-4 w-4" />
            Music
          </button>
        </div>
      </div>

      <!-- Filter input -->
      <div class="mb-8">
        <div class="relative max-w-sm">
          <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchFilter"
            type="text"
            :placeholder="activeTab === 'music' ? 'Filter genres...' : 'Filter categories...'"
            class="w-full rounded-lg bg-gray-800 border-2 border-gray-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      <!-- Podcast categories -->
      <template v-if="activeTab === 'podcasts'">
        <!-- Loading skeleton -->
        <div v-if="loading" class="flex flex-wrap gap-2">
          <div v-for="n in 24" :key="n" class="h-9 rounded-full animate-shimmer" :style="{ width: (70 + Math.random() * 50) + 'px' }" />
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <button
            v-for="cat in filteredCategories"
            :key="cat.id"
            @click="onPodcastCatClick(cat.id, cat.name)"
            class="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-sm font-medium text-gray-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-colors"
          >
            <MagnifyingGlassIcon class="h-3.5 w-3.5 text-gray-500 group-hover:text-white transition-colors" />
            {{ cat.name }}
          </button>
        </div>

        <div v-if="!loading && filteredCategories.length === 0" class="py-12 text-center">
          <p class="text-gray-500 text-sm">No categories matching "{{ searchFilter }}"</p>
        </div>
      </template>

      <!-- Music genres -->
      <template v-else>
        <div v-if="musicGenresLoading" class="flex flex-wrap gap-2">
          <div v-for="n in 12" :key="n" class="h-10 rounded-full animate-shimmer bg-gray-800/70" :style="{ width: (88 + Math.random() * 42) + 'px' }" />
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <button
            v-for="g in filteredGenres"
            :key="g.tag"
            @click="onGenreClick(g.tag)"
            class="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-sm font-medium text-gray-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-colors"
          >
            <MusicalNoteIcon class="h-3.5 w-3.5 text-gray-500 group-hover:text-white transition-colors" />
            {{ g.label }}
          </button>
        </div>

        <div v-if="filteredGenres.length === 0" class="py-12 text-center">
          <p class="text-gray-500 text-sm">No genres matching "{{ searchFilter }}"</p>
        </div>
      </template>
    </div>
  </div>
  <Footer />
</template>
