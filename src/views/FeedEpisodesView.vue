<script setup>
import Footer from '../components/Footer.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import SkeletonRow from '../components/SkeletonRow.vue'
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
const visibleCount = ref(10)
const loading = ref(true)
const show = ref(false)

const visibleEpisodes = computed(() => episodes.value.slice(0, visibleCount.value))

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + 5, episodes.value.length)
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
    setTimeout(() => { show.value = false }, 5000)
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
    setTimeout(() => { show.value = false }, 5000)
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
  <!--  Notification  -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700 border-2 border-green-500">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-white">Successfully added!</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="show = false" class="inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

  <div v-if="loading" class="bg-gray-950 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-4xl">
        <div class="mt-16 lg:mt-20">
          <SkeletonCard />
        </div>
        <div class="mt-16 space-y-16 lg:mt-20">
          <SkeletonRow v-for="n in 4" :key="n" />
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <div v-if="feedInfo && !error" class="bg-gray-950 pb-24 sm:pb-32 pt-4 sm:pt-6">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-4xl">
          <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            <article class="relative isolate flex flex-col gap-8 lg:flex-row">
              <div class="relative aspect-square lg:w-64 lg:shrink-0">
                <img :src="feedInfo.image || '/images/image_not_available_500.webp'" alt="" class="absolute inset-0 w-full aspect-square rounded-2xl bg-gray-800 object-cover" />
                <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 aspect-square w-full" />
              </div>
              <div>
                <div class="flex items-center gap-x-4 text-xs">
                  <time :datetime="feedInfo.newestItemPubdate" class="text-gray-500">{{ feedInfo.datePublishedPretty }}</time>
                </div>
                <div class="group relative max-w-xl">
                  <h1 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {{ feedInfo.title }}
                  </h1>
                  <p class="mt-5 text-sm leading-6 text-gray-400">{{ stripHtmlTags(feedInfo.description) }}</p>
                </div>
                <div class="mt-6 flex border-t border-gray-800 pt-6">
                  <div class="relative flex items-center gap-x-4">
                    <img :src="feedInfo.image || '/images/image_not_available_170.webp'" alt="" class="h-10 w-10 rounded-full bg-gray-800" />
                    <div class="text-sm leading-6 flex">
                      <button @click="addFavourite(feedInfo.id, feedInfo.title)" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full transition-colors">
                        <StarIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            <article v-for="episode in visibleEpisodes" :key="episode.id" class="relative isolate flex flex-col gap-8 lg:flex-row">
              <div>
                <div class="flex items-center gap-x-4 text-xs">
                  <time :datetime="episode.datePublishedPretty" class="text-gray-500">{{ episode.datePublishedPretty }}</time>
                </div>
                <div class="group relative max-w-xl">
                  <h2 class="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                    <span class="text-white font-bold">{{ episode.title }}</span>
                  </h2>
                  <p class="mt-5 text-sm leading-6 text-gray-400">{{ stripHtmlTags(episode.description) }}</p>
                </div>
                <div class="mt-6 flex border-b border-gray-800 pt-3 pb-6">
                  <div class="relative flex items-center gap-x-4">
                    <div class="text-sm leading-6 flex">
                      <button @click="playEpisode(episode)" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full flex transition-colors">
                        <span class="sr-only">Play</span>
                        <PlayIcon class="h-5 w-5" />
                      </button>
                      <button @click="addBookmarks(episode.id, episode.title)" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full transition-colors">
                        <span class="sr-only">Add bookmark</span>
                        <BookmarkIcon class="h-5 w-5" />
                      </button>
                      <button @click="downloadPodcast(episode.title, episode.enclosureUrl, episode.id)" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full transition-colors">
                        <span class="sr-only">Download</span>
                        <ArrowDownTrayIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <button class="bg-indigo-600 hover:bg-pink-500 text-white font-bold py-2 px-4 mx-1 rounded-full flex transition-colors" v-if="visibleCount < episodes.length" @click="loadMore">Load More ...</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-gray-950 py-32 sm:py-40">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <EmptyState
          :icon="ExclamationTriangleIcon"
          title="Not Found"
          description="We're sorry, but we are unable to find the feed you are looking for. Please use the search to try again."
          action-text="Back to listing"
          action-link="/feed_listing"
        />
      </div>
    </div>
  </div>

  <Footer />
</template>
