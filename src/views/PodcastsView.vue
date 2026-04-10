<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import { StarIcon, ArrowRightIcon, CheckCircleIcon, PlayIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { useHistoryStore } from '@/stores/historyStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { podcastService } from '@/services/podcastService.js'
import { useSeo } from '@/seo/composables/useSeo.js'
import { podcastsSeo } from '@/seo/registry/index.js'

useSeo(podcastsSeo)

const authStore = useAuthStore()
authStore.initializeAuth()
const messageStore = useMessageStore()
messageStore.initializeMessage()
const historyStore = useHistoryStore()
const playerStore = usePlayerStore()
const router = useRouter()

const feeds = ref([])
const categories = ref([])
const loading = ref(true)
const loadingCategories = ref(true)
const show = ref(false)

const visibleCount = ref(12)

const displayedFeeds = computed(() => {
  return feeds.value.slice(0, visibleCount.value)
})

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + 12, feeds.value.length)
}

function selectCategory(catId, catName) {
  router.push({ name: 'SearchResults', query: { s: catId, name: catName } })
}

function resumeEntry(entry) {
  playerStore.play({
    id: entry.episodeId,
    title: entry.title,
    enclosureUrl: entry.enclosureUrl,
    image: entry.image,
    feedTitle: entry.feedTitle,
    feedId: entry.feedId,
  })
}

function entryProgressPercent(entry) {
  if (!entry.duration || entry.duration <= 0) return 0
  return Math.min(100, Math.max(0, (entry.currentTime / entry.duration) * 100))
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
        <p class="text-sm font-semibold text-pink-400">Hello, listener</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your next favourite show is one tap away
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-gray-400">
          Grab a coffee, plug in your headphones and let your ears wander. Trending picks, fresh categories and brand new gems are all waiting below.
        </p>
      </div>

      <!-- Categories -->
      <div class="mb-8 space-y-4">
        <!-- Category pills -->
        <div v-if="!loadingCategories" class="flex flex-wrap gap-2">
          <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-600 text-white">
            Trending
          </span>
          <button
            v-for="cat in categories.slice(0, 16)"
            :key="cat.id"
            @click="selectCategory(cat.id, cat.name)"
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

      <!-- Continue listening -->
      <div v-if="historyStore.continueListening.length" class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-300">Continue listening</h2>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
          <button
            v-for="entry in historyStore.continueListening.slice(0, 10)"
            :key="entry.episodeId"
            @click="resumeEntry(entry)"
            class="snap-start shrink-0 w-64 text-left rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div class="flex items-center gap-3 p-3">
              <!-- Cover -->
              <div class="relative shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-700">
                <img
                  :src="entry.image || '/images/image_not_available_500.webp'"
                  :alt="entry.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayIcon class="h-7 w-7 text-white" />
                </div>
              </div>
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {{ entry.title }}
                </p>
                <p v-if="entry.feedTitle" class="text-xs text-gray-400 truncate mt-0.5">{{ entry.feedTitle }}</p>
                <p class="text-xs text-indigo-400 mt-1">Resume</p>
              </div>
            </div>
            <!-- Progress bar -->
            <div class="h-1 bg-gray-700">
              <div
                class="h-full bg-indigo-500 transition-all"
                :style="{ width: entryProgressPercent(entry) + '%' }"
              />
            </div>
          </button>
        </div>
      </div>

      <!-- Trending podcasts grid -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-300">Trending</h2>
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

        <!-- Load more -->
        <div v-if="!loading && visibleCount < feeds.length" class="mt-6 flex justify-center">
          <button
            @click="loadMore"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors"
          >
            Load more
            <ArrowRightIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
