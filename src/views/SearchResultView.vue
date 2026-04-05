<script setup>
import { ref, computed, watch } from 'vue'
import Footer from '../components/Footer.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import EmptyState from '../components/EmptyState.vue'
import {
  ArrowRightIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { podcastService } from '@/services/podcastService.js'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
authStore.initializeAuth()

const messageStore = useMessageStore()
messageStore.initializeMessage()

const route = useRoute()
const router = useRouter()

const feeds = ref([])
const visibleCount = ref(12)
const noResult = ref(false)
const loading = ref(true)
const show = ref(false)

const visibleFeeds = computed(() => feeds.value.slice(0, visibleCount.value))

const pageTitle = computed(() => {
  if (route.query.q) return `Results for "${route.query.q}"`
  if (route.query.s) return 'Category results'
  return 'Search results'
})

const pageDescription = computed(() => {
  if (route.query.q) {
    return 'Here are the podcasts matching your search. Explore, save your favourites, and start listening.'
  }
  if (route.query.s) {
    return 'Browse podcasts from the selected category and discover new episodes to enjoy.'
  }
  return 'Explore podcasts that match your search.'
})

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + 12, feeds.value.length)
}

async function fetchSearchResults(param, value) {
  if (!param || !value) return

  loading.value = true
  noResult.value = false
  feeds.value = []
  visibleCount.value = 12

  try {
    let response

    if (param === 'q') {
      response = await podcastService.searchByTitle(value)
    } else if (param === 's') {
      response = await podcastService.searchByCategory(value)
    }

    if (response && response.data.feeds.length === 0) {
      noResult.value = true
    } else if (response) {
      feeds.value = response.data.feeds
    }
  } catch (err) {
    console.error('Error fetching search results:', err)
    noResult.value = true
  } finally {
    loading.value = false
  }
}

async function addFavourite(feedId, feedTitle) {
  try {
    await podcastService.addFavorite(feedId, feedTitle)
    show.value = true
    setTimeout(() => {
      show.value = false
    }, 3000)
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

watch(
    () => route.query,
    (newQuery) => {
      const queryParam = Object.keys(newQuery)[0]
      fetchSearchResults(queryParam, newQuery[queryParam])
    },
    { immediate: true }
)
</script>

<template>
  <!-- Notification toast -->
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 z-10 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div
            v-if="show"
            class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-2 border-green-500 bg-gray-800 shadow-lg ring-1 ring-gray-700"
        >
          <div class="p-4">
            <div class="flex items-start">
              <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-green-400" aria-hidden="true" />
              <p class="ml-3 text-sm font-medium text-white">Added to favourites!</p>
              <button
                  type="button"
                  @click="show = false"
                  class="ml-auto inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
              >
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
          {{ pageTitle }}
        </h1>
        <p class="text-gray-400 text-lg max-w-3xl">
          {{ pageDescription }}
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="h-6 w-40 rounded animate-shimmer"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <SkeletonCard v-for="n in 6" :key="n" />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="noResult" class="py-10">
        <EmptyState
            :icon="MagnifyingGlassIcon"
            title="No results found"
            description="Sorry, your search returned no results. Try a different search term or browse our categories."
            action-text="Browse podcasts"
            action-link="/"
        />
      </div>

      <!-- Results -->
      <div v-else>
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">
            Podcasts found
          </h2>
          <p class="text-sm text-gray-500">
            {{ feeds.length }} result<span v-if="feeds.length !== 1">s</span>
          </p>
        </div>

        <ul class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <li
              v-for="feed in visibleFeeds"
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
                  <p class="text-xs text-gray-400 truncate mt-0.5">
                    {{ feed.author }}
                  </p>
                  <p class="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {{ stripHtmlTags(feed.description) }}
                  </p>
                </div>
              </div>

              <!-- Category badges -->
              <div
                  v-if="feed.categories && Object.keys(feed.categories).length"
                  class="px-4 pb-3 flex flex-wrap gap-1"
              >
                <span
                    v-for="(catName, catId) in Object.fromEntries(Object.entries(feed.categories || {}).slice(0, 3))"
                    :key="catId"
                    class="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
                >
                  {{ catName }}
                </span>
              </div>
            </router-link>

            <!-- Actions -->
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
        <div v-if="visibleCount < feeds.length" class="mt-6 flex justify-center">
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
