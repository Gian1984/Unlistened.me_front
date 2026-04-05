<script setup>
import Footer from '../components/Footer.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { BookmarkIcon, PlayIcon, ArrowDownTrayIcon, StarIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { podcastService } from '@/services/podcastService.js'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
authStore.initializeAuth()
const messageStore = useMessageStore()
messageStore.initializeMessage()
const playerStore = usePlayerStore()
const route = useRoute()
const router = useRouter()

const feedInfo = ref(null)
const episodes = ref([])
const error = ref(null)
const visibleCount = ref(15)
const loading = ref(true)
const show = ref(false)

const visibleEpisodes = computed(() => episodes.value.slice(0, visibleCount.value))

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + 10, episodes.value.length)
}

function playEpisode(episode) {
  playerStore.play({
    id: episode.id,
    title: episode.title,
    enclosureUrl: episode.enclosureUrl,
    image: feedInfo.value?.image || '',
    feedTitle: feedInfo.value?.title || '',
    feedId: feedInfo.value?.id || null,
  })
}

function stripHtmlTags(str) {
  if (!str) return ''
  return str.replace(/<[^>]*>/g, '')
}

function sanitizeFilename(title) {
  let clean = title.replace(/<\/?[^>]+(>|$)/g, '')
  clean = clean.replace(/[?*/\\|:"<>]+/g, '')
  clean = clean.trim().replace(/\s+/g, '_')
  return clean
}

async function fetchFeedInfo(feedId) {
  try {
    const response = await podcastService.getFeedInfo(feedId)
    feedInfo.value = response.data.feed
    if (!feedInfo.value || Object.keys(feedInfo.value).length === 0) {
      error.value = 'No podcast information found.'
    }
  } catch (err) {
    error.value = err
  }
}

async function fetchEpisodes(feedId) {
  try {
    const response = await podcastService.getEpisodes(feedId)
    episodes.value = response.data.items
  } catch (err) {
    console.error('Error fetching episodes:', err)
  } finally {
    loading.value = false
  }
}

async function addFavourite(feedId, feedTitle) {
  try {
    await podcastService.addFavorite(feedId, feedTitle)
    show.value = true
    setTimeout(() => { show.value = false }, 3000)
  } catch (err) {
    authStore.clearUser()
    messageStore.setMessage('To access this functionality you have to be logged in')
    router.push({ name: 'Login' })
  }
}

async function addBookmarks(episodeId, episodeTitle) {
  try {
    await podcastService.addBookmark(episodeId, episodeTitle)
    show.value = true
    setTimeout(() => { show.value = false }, 3000)
  } catch (err) {
    authStore.clearUser()
    messageStore.setMessage('To access this functionality you have to be logged in')
    router.push({ name: 'Login' })
  }
}

async function downloadPodcast(title, url, id) {
  const sanitized = sanitizeFilename(title)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', sanitized + '.mp3')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  podcastService.trackDownload(id, sanitized).catch(() => {})
}

onMounted(() => {
  const feedId = route.params.id
  fetchFeedInfo(feedId)
  fetchEpisodes(feedId)
})
</script>

<template>
  <!-- Notification -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700 border-2 border-green-500">
          <div class="p-4">
            <div class="flex items-start">
              <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-green-400" aria-hidden="true" />
              <p class="ml-3 text-sm font-medium text-white">Successfully added!</p>
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

      <!-- Loading skeleton -->
      <div v-if="loading">
        <div class="mb-8">
          <div class="flex items-start gap-4 p-4 rounded-lg bg-gray-800 border border-gray-700">
            <div class="w-20 h-20 rounded-lg animate-shimmer shrink-0" />
            <div class="flex-1 space-y-3">
              <div class="h-6 w-2/3 rounded animate-shimmer" />
              <div class="h-4 w-1/3 rounded animate-shimmer" />
              <div class="h-3 w-full rounded animate-shimmer" />
              <div class="h-3 w-3/4 rounded animate-shimmer" />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <div v-for="n in 6" :key="n" class="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
            <div class="w-9 h-9 rounded-full animate-shimmer shrink-0" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-3/4 rounded animate-shimmer" />
              <div class="h-3 w-1/3 rounded animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="feedInfo && !error">
        <!-- Podcast header card -->
        <div class="flex items-start gap-4 mb-8 p-4 rounded-lg bg-gray-800 border border-gray-700">
          <img
            :src="feedInfo.image || '/images/image_not_available_500.webp'"
            :alt="feedInfo.title"
            class="w-20 h-20 rounded-lg object-cover shrink-0 bg-gray-700"
          />
          <div class="flex-1 min-w-0">
            <h1 class="text-xl font-semibold text-white sm:text-2xl">{{ feedInfo.title }}</h1>
            <p v-if="feedInfo.author" class="text-sm text-gray-400 mt-0.5">{{ feedInfo.author }}</p>
            <p class="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">{{ stripHtmlTags(feedInfo.description) }}</p>
          </div>
          <button
            @click="addFavourite(feedInfo.id, feedInfo.title)"
            class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-300 transition-colors"
            title="Add to favourites"
          >
            <StarIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Episode count -->
        <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {{ episodes.length }} Episodes
        </h2>

        <!-- Episode list -->
        <div class="space-y-2">
          <div
            v-for="episode in visibleEpisodes"
            :key="episode.id"
            :class="[
              'flex items-center gap-3 p-3 rounded-lg border transition-colors group',
              playerStore.currentEpisode?.id === episode.id
                ? 'bg-indigo-500/10 border-indigo-500/40'
                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
            ]"
          >
            <!-- Play button -->
            <button
              @click="playEpisode(episode)"
              :class="[
                'shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-colors focus:outline-none',
                playerStore.currentEpisode?.id === episode.id
                  ? 'bg-indigo-500 hover:bg-indigo-400'
                  : 'bg-gray-700 hover:bg-indigo-600 group-hover:bg-indigo-600'
              ]"
              :aria-label="'Play ' + episode.title"
            >
              <PlayIcon class="h-4 w-4 text-white ml-0.5" />
            </button>

            <!-- Episode info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ episode.title }}</p>
              <p class="text-xs text-gray-400 mt-0.5 truncate">
                <span v-if="episode.datePublishedPretty">{{ episode.datePublishedPretty }}</span>
                <span v-if="episode.duration"> &middot; {{ Math.round(episode.duration / 60) }} min</span>
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 shrink-0">
              <button
                @click="addBookmarks(episode.id, episode.title)"
                class="flex items-center justify-center w-7 h-7 rounded-full text-gray-500 hover:text-indigo-400 hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                title="Bookmark"
              >
                <BookmarkIcon class="h-4 w-4" />
              </button>
              <button
                @click="downloadPodcast(episode.title, episode.enclosureUrl, episode.id)"
                class="flex items-center justify-center w-7 h-7 rounded-full text-gray-500 hover:text-indigo-400 hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                title="Download"
              >
                <ArrowDownTrayIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Load more -->
        <div v-if="visibleCount < episodes.length" class="mt-6 flex justify-center">
          <button
            @click="loadMore"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
          >
            Load more episodes
          </button>
        </div>
      </div>

      <!-- Error / Not found -->
      <div v-else class="py-20">
        <EmptyState
          :icon="ExclamationTriangleIcon"
          title="Not Found"
          description="We're sorry, but we are unable to find the feed you are looking for. Please use the search to try again."
          action-text="Back to home"
          action-link="/"
        />
      </div>

    </div>
  </div>
  <Footer />
</template>
