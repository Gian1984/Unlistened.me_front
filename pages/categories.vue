<script setup>
import { ref, computed, onMounted } from 'vue'
import Footer from '~/src/components/Footer.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { MusicalNoteIcon } from '@heroicons/vue/24/outline'
import { podcastService } from '~/src/services/podcastService.js'
import { useMusicGenres } from '~/src/composables/useMusicGenres.js'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('categories')

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
  return categories.value.filter((category) => category.name.toLowerCase().includes(q))
})

const filteredGenres = computed(() => {
  if (!searchFilter.value) return musicGenres.value
  const q = searchFilter.value.toLowerCase()
  return musicGenres.value.filter((genre) => genre.label.toLowerCase().includes(q))
})

async function fetchSearchCategories() {
  try {
    const response = await podcastService.getCategories()
    categories.value = response.data.feeds
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

function onPodcastCategoryClick(id, name) {
  router.push({ path: '/search-results', query: { s: id, name } })
}

function onGenreClick(tag) {
  router.push({ path: '/music/singles', query: { genre: tag } })
}

function switchTab(tab) {
  activeTab.value = tab
  searchFilter.value = ''
  router.replace({ path: '/categories', query: tab === 'music' ? { tab: 'music' } : {} })
}

onMounted(() => {
  fetchSearchCategories()
  loadGenres()
})
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mb-8">
        <h1 class="mb-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Categories</h1>
        <p class="max-w-3xl text-base leading-7 text-gray-400">
          Browse podcasts by genre or explore music styles.
        </p>
      </div>

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

      <div class="mb-8">
        <div class="relative max-w-sm">
          <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchFilter"
            type="text"
            :placeholder="activeTab === 'music' ? 'Filter genres...' : 'Filter categories...'"
            class="w-full rounded-lg border-2 border-gray-700 bg-gray-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <template v-if="activeTab === 'podcasts'">
        <div v-if="loading" class="flex flex-wrap gap-2">
          <div v-for="n in 24" :key="n" class="h-9 rounded-full animate-shimmer" :style="{ width: (70 + Math.random() * 50) + 'px' }" />
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <button
            v-for="category in filteredCategories"
            :key="category.id"
            @click="onPodcastCategoryClick(category.id, category.name)"
            class="group flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
          >
            <MagnifyingGlassIcon class="h-3.5 w-3.5 text-gray-500 transition-colors group-hover:text-white" />
            {{ category.name }}
          </button>
        </div>

        <div v-if="!loading && filteredCategories.length === 0" class="py-12 text-center">
          <p class="text-sm text-gray-500">No categories matching "{{ searchFilter }}"</p>
        </div>
      </template>

      <template v-else>
        <div v-if="musicGenresLoading" class="flex flex-wrap gap-2">
          <div v-for="n in 12" :key="n" class="h-10 rounded-full animate-shimmer bg-gray-800/70" :style="{ width: (88 + Math.random() * 42) + 'px' }" />
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <button
            v-for="genre in filteredGenres"
            :key="genre.tag"
            @click="onGenreClick(genre.tag)"
            class="group flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
          >
            <MusicalNoteIcon class="h-3.5 w-3.5 text-gray-500 transition-colors group-hover:text-white" />
            {{ genre.label }}
          </button>
        </div>

        <div v-if="filteredGenres.length === 0" class="py-12 text-center">
          <p class="text-sm text-gray-500">No genres matching "{{ searchFilter }}"</p>
        </div>
      </template>
    </div>
  </div>
  <Footer />
</template>
