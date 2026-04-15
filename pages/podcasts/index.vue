<script setup>
import { ref, computed, onMounted } from 'vue'
import PageHero from '~/src/components/PageHero.vue'
import SkeletonCard from '~/src/components/SkeletonCard.vue'
import { StarIcon, CheckCircleIcon, PlayIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '~/src/stores/authStore.js'
import { useMessageStore } from '~/src/stores/messageStore.js'
import { useHistoryStore } from '~/src/stores/historyStore.js'
import { usePlayerStore } from '~/src/stores/playerStore.js'
import { podcastService } from '~/src/services/podcastService.js'
import { stripHtmlTags } from '~/src/utils/text.js'
import { usePagination } from '~/src/composables/usePagination.js'
import PodcastCardItem from '~/src/components/podcast/PodcastCardItem.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('podcasts')

const authStore = useAuthStore()
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

const { visibleItems, hasMore, loadMore } = usePagination(feeds, 12)

function selectCategory(catId, catName) {
  router.push({ path: '/search-results', query: { s: catId, name: catName } })
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
  } catch (error) {
    console.error('Error fetching feeds:', error)
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const response = await podcastService.getCategories()
    categories.value = response.data.feeds
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loadingCategories.value = false
  }
}

async function addFavourite(feedId, feedTitle) {
  if (!authStore.isAuthenticated) {
    messageStore.setMessage('To access this functionality you have to be logged in')
    router.push('/login')
    return
  }

  try {
    await podcastService.addFavorite(feedId, feedTitle)
    show.value = true
    setTimeout(() => {
      show.value = false
    }, 3000)
  } catch (error) {
    if (error.response?.status !== 401) {
      messageStore.setMessage('There was an error while saving the favorite. Please try again.')
    }
  }
}

onMounted(() => {
  fetchTrending()
  fetchCategories()
})
</script>

<template>
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 z-10 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-2 border-green-500 bg-gray-800 shadow-lg ring-1 ring-gray-700">
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
      <PageHero
        eyebrow="Hello, listener"
        title="Your next favorite show is one tap away"
        description="Grab a coffee, plug in your headphones and let your ears wander. Trending picks, fresh categories and brand new gems are all waiting below."
        :breadcrumbs="[
          { label: 'Home', to: '/' },
          { label: 'Podcasts' },
        ]"
      />

      <div class="mb-8 space-y-4">
        <div v-if="!loadingCategories" class="flex flex-wrap gap-2">
          <span class="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white">
            Trending
          </span>
          <button
            v-for="category in categories.slice(0, 16)"
            :key="category.id"
            @click="selectCategory(category.id, category.name)"
            class="rounded-full border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            {{ category.name }}
          </button>
          <NuxtLink
            to="/categories"
            class="rounded-full border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-indigo-400 transition-colors hover:bg-gray-700"
          >
            All categories &rarr;
          </NuxtLink>
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <div v-for="n in 10" :key="n" class="h-7 rounded-full animate-shimmer" :style="{ width: (60 + Math.random() * 40) + 'px' }" />
        </div>
      </div>

      <div v-if="historyStore.continueListening.length" class="mb-10">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">Continue listening</h2>
        </div>
        <div class="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2">
          <button
            v-for="entry in historyStore.continueListening.slice(0, 10)"
            :key="entry.episodeId"
            @click="resumeEntry(entry)"
            class="group w-64 shrink-0 snap-start overflow-hidden rounded-lg border border-gray-700 bg-gray-800 text-left transition-all hover:border-indigo-500 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div class="flex items-center gap-3 p-3">
              <div class="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-700">
                <img
                  :src="entry.image || '/images/image_not_available_500.webp'"
                  :alt="entry.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlayIcon class="h-7 w-7 text-white" />
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                  {{ entry.title }}
                </p>
                <p v-if="entry.feedTitle" class="mt-0.5 truncate text-xs text-gray-400">{{ entry.feedTitle }}</p>
                <p class="mt-1 text-xs text-indigo-400">Resume</p>
              </div>
            </div>
            <div class="h-1 bg-gray-700">
              <div class="h-full bg-indigo-500 transition-all" :style="{ width: entryProgressPercent(entry) + '%' }" />
            </div>
          </button>
        </div>
      </div>

      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">Trending</h2>
        </div>

        <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <PodcastCardItem
            v-for="feed in visibleItems"
            :key="feed.id"
            :feed="feed"
            @favorite="addFavourite"
          />
        </ul>
      </div>

      <div v-if="!loading && hasMore" class="flex justify-center">
        <button
          type="button"
          @click="loadMore"
          class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-indigo-500 hover:text-white"
        >
          Load more
        </button>
      </div>

      <div v-if="!loading && !feeds.length" class="py-16 text-center">
        <StarIcon class="mx-auto h-10 w-10 text-gray-600" />
        <p class="mt-4 text-sm text-gray-400">No podcasts available right now.</p>
      </div>
    </div>
  </div>
</template>
