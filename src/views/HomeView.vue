<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import { StarIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { podcastService } from '@/services/podcastService.js'

const authStore = useAuthStore()
authStore.initializeAuth()
const messageStore = useMessageStore()
messageStore.initializeMessage()
const router = useRouter()

const feeds = ref([])
const categories = ref([])
const loading = ref(true)
const loadingCategories = ref(true)
const show = ref(false)
const searchQuery = ref('')
const activeCategory = ref(null)

const displayedFeeds = computed(() => {
  return feeds.value.slice(0, 12)
})

function onSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', query: { q: searchQuery.value } })
    searchQuery.value = ''
  }
}

function clearSearch() {
  searchQuery.value = ''
}

function selectCategory(catId) {
  router.push({ name: 'SearchResults', query: { s: catId } })
}

async function fetchTrending() {
  try {
    const response = await podcastService.getTrending()
    feeds.value = response.data.feeds
  } catch (err) {
    console.error('Error fetching feeds:', err)
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const response = await podcastService.getCategories()
    categories.value = response.data.feeds
  } catch (err) {
    console.error('Error fetching categories:', err)
  } finally {
    loadingCategories.value = false
  }
}

async function addFavourite(feedId, feedTitle) {
  try {
    await podcastService.addFavorite(feedId, feedTitle)
    show.value = true
    setTimeout(() => { show.value = false }, 3000)
  } catch (error) {
    authStore.clearUser()
    messageStore.setMessage('To access this functionality you have to be logged in')
    router.push({ name: 'Login' })
  }
}

function stripHtmlTags(str) {
  if (!str) return ''
  return str.replace(/<[^>]*>/g, '')
}

onMounted(() => {
  fetchTrending()
  fetchCategories()
})
</script>

<template>
  <!-- Notification toast -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700 border-2 border-green-500">
          <div class="p-4">
            <div class="flex items-start">
              <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-green-400" aria-hidden="true" />
              <p class="ml-3 text-sm font-medium text-white">Added to favourites!</p>
              <button type="button" @click="show = false" class="ml-auto inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300">
                <XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-5xl mb-3">
          Discover Podcasts
        </h1>
        <p class="text-gray-400 text-lg max-w-3xl">
          Browse trending shows, explore by category, and start listening. Free, private, no tracking.
        </p>
      </div>

      <!-- Search input -->
      <div class="mb-8 space-y-4">
        <div class="relative max-w-lg">
          <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search podcasts..."
            class="w-full rounded-lg bg-gray-800 border-2 border-gray-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            @keyup.enter="onSearch"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label="Clear search"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>

        <!-- Category pills -->
        <div v-if="!loadingCategories" class="flex flex-wrap gap-2">
          <router-link
            to="/feed_listing"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-indigo-600 text-white"
          >
            Trending
          </router-link>
          <button
            v-for="cat in categories.slice(0, 16)"
            :key="cat.id"
            @click="selectCategory(cat.id)"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
          >
            {{ cat.name }}
          </button>
          <router-link
            to="/categories"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-gray-800 text-indigo-400 hover:bg-gray-700 border border-gray-700"
          >
            All categories &rarr;
          </router-link>
        </div>
        <!-- Category pills skeleton -->
        <div v-else class="flex flex-wrap gap-2">
          <div v-for="n in 10" :key="n" class="h-7 rounded-full animate-shimmer" :style="{ width: (60 + Math.random() * 40) + 'px' }" />
        </div>
      </div>

      <!-- Trending podcasts grid -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-300">Trending</h2>
          <router-link to="/feed_listing" class="text-sm text-indigo-400 hover:text-pink-400 transition-colors">
            View all &rarr;
          </router-link>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <!-- Podcast grid -->
        <ul v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <li
            v-for="feed in displayedFeeds"
            :key="feed.id"
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
                @click.prevent="addFavourite(feed.id, feed.title)"
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
        </ul>

        <!-- Load more link -->
        <div v-if="!loading && feeds.length > 12" class="mt-6 flex justify-center">
          <router-link
            to="/feed_listing"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors"
          >
            Browse all podcasts
            <ArrowRightIcon class="h-4 w-4" />
          </router-link>
        </div>
      </div>

      <!-- Quick links -->
      <div class="mt-12 pt-8 border-t border-gray-800">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <router-link to="/feed_listing" class="flex items-center gap-3 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-colors group">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <ArrowRightIcon class="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">All Podcasts</p>
              <p class="text-xs text-gray-500">Browse the full catalogue</p>
            </div>
          </router-link>
          <router-link to="/categories" class="flex items-center gap-3 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-colors group">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">Categories</p>
              <p class="text-xs text-gray-500">Explore by genre</p>
            </div>
          </router-link>
          <router-link to="/favourites" class="flex items-center gap-3 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-colors group">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600/10">
              <StarIcon class="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">Favourites</p>
              <p class="text-xs text-gray-500">Your saved podcasts</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
