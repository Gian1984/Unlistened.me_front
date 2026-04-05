<script setup>
import Footer from '../components/Footer.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { ArrowDownTrayIcon, CheckCircleIcon, PlayIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { podcastService } from '@/services/podcastService.js'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
authStore.initializeAuth()
const messageStore = useMessageStore()
messageStore.initializeMessage()
const playerStore = usePlayerStore()
const route = useRoute()
const router = useRouter()

const episode = ref(null)
const error = ref(null)
const loading = ref(true)
const show = ref(false)

function playEpisode(ep) {
  playerStore.play({
    id: ep.id,
    title: ep.title,
    enclosureUrl: ep.enclosureUrl,
    image: ep.image || '',
    feedTitle: ep.feedTitle || '',
    feedId: ep.feedId || null,
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

async function fetchEpisode(podcastId) {
  try {
    const response = await podcastService.getEpisode(podcastId)
    episode.value = response.data.episode
    if (!episode.value || Object.keys(episode.value).length === 0) {
      error.value = 'No podcast information found.'
    }
  } catch (err) {
    error.value = 'Error fetching episode'
  } finally {
    loading.value = false
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

async function deleteBookmark(episodeId) {
  try {
    await podcastService.deleteBookmark(episodeId)
    show.value = true
    setTimeout(() => { show.value = false }, 5000)
  } catch (err) {
    authStore.clearUser()
    messageStore.setMessage('To access this functionality you have to be logged in')
    router.push({ name: 'Login' })
  }
}

onMounted(() => {
  fetchEpisode(route.params.id)
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
                <p class="text-sm font-medium text-white">Successfully removed!</p>
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
      </div>
    </div>
  </div>

  <div v-else>
    <div v-if="episode && !error" class="bg-gray-950 pb-24 sm:pb-32 pt-4 sm:pt-6">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-4xl">
          <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            <article class="relative isolate flex flex-col gap-8 lg:flex-row">
              <div class="relative aspect-square lg:w-64 lg:shrink-0">
                <img :src="episode.image || '/images/image_not_available_500.webp'" alt="" class="absolute inset-0 aspect-square w-full rounded-2xl bg-gray-800 object-cover" />
                <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 aspect-square w-full" />
              </div>
              <div>
                <div class="flex items-center gap-x-4 text-xs">
                  <time :datetime="episode.newestItemPubdate" class="text-gray-500">{{ episode.datePublishedPretty }}</time>
                </div>
                <div class="group relative max-w-xl">
                  <h1 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {{ episode.title }}
                  </h1>
                  <p class="mt-5 text-sm leading-6 text-gray-400">{{ stripHtmlTags(episode.description) }}</p>
                </div>
                <div class="mt-6 flex border-t border-gray-800 pt-6">
                  <div class="relative flex items-center gap-x-4">
                    <img :src="episode.image || '/images/image_not_available_170.webp'" alt="" class="h-10 w-10 rounded-full bg-gray-800" />
                    <div class="text-sm leading-6 flex">
                      <button @click="playEpisode(episode)" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full flex transition-colors">
                        <span class="sr-only">Play</span>
                        <PlayIcon class="h-5 w-5" />
                      </button>
                      <button @click="downloadPodcast(episode.title, episode.enclosureUrl, episode.id)" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full transition-colors">
                        <span class="sr-only">Download</span>
                        <ArrowDownTrayIcon class="h-5 w-5" />
                      </button>
                      <button @click="deleteBookmark(episode.id)" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full transition-colors">
                        <span class="sr-only">Remove bookmark</span>
                        <TrashIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="bg-gray-950 py-32 sm:py-40">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <EmptyState
          :icon="ExclamationTriangleIcon"
          title="Not Found"
          description="We're sorry, but we are unable to find the episode you are looking for. Please use the search to try again."
          action-text="Back to listing"
          action-link="/feed_listing"
        />
      </div>
    </div>
  </div>
  <Footer />
</template>
