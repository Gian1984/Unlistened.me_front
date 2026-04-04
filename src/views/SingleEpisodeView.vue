<script setup>
import Footer from '../components/Footer.vue'
import { ArrowDownTrayIcon, CheckCircleIcon, PlayIcon, TrashIcon } from '@heroicons/vue/24/outline'
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
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">Successfully removed!</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="show = false" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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

  <div v-if="loading">
    <div class="grid h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm pb-8 sm:pb-24">
        <img class="mx-auto h-24 sm:h-48 w-auto" src="/images/unlistened.me_white_300.png" alt="Unlistened.me logo" />
      </div>
      <div class="text-center">
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Hang tight!</h1>
        <p class="mt-6 text-base leading-7 text-gray-900">We're getting the latest updates to bring you the freshest podcast</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <button type="button" class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-indigo-700 bg-white hover:bg-white transition ease-in-out duration-150 cursor-not-allowed" disabled="">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            loading...
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <div v-if="episode && !error" class="bg-white pb-24 sm:pb-32 pt-4 sm:pt-6">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-4xl">
          <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            <article class="relative isolate flex flex-col gap-8 lg:flex-row">
              <div class="relative aspect-square lg:w-64 lg:shrink-0">
                <img :src="episode.image || '/images/image_not_available_500.webp'" alt="" class="absolute inset-0 aspect-square w-full rounded-2xl bg-gray-50 object-cover" />
                <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10 aspect-square w-full" />
              </div>
              <div>
                <div class="flex items-center gap-x-4 text-xs">
                  <time :datetime="episode.newestItemPubdate" class="text-gray-500">{{ episode.datePublishedPretty }}</time>
                </div>
                <div class="group relative max-w-xl">
                  <h1 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {{ episode.title }}
                  </h1>
                  <p class="mt-5 text-sm leading-6 text-gray-600">{{ stripHtmlTags(episode.description) }}</p>
                </div>
                <div class="mt-6 flex border-t border-gray-900/5 pt-6">
                  <div class="relative flex items-center gap-x-4">
                    <img :src="episode.image || '/images/image_not_available_170.webp'" alt="" class="h-10 w-10 rounded-full bg-gray-50" />
                    <div class="text-sm leading-6 flex">
                      <button @click="playEpisode(episode)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full flex">
                        <span class="sr-only">Play</span>
                        <PlayIcon class="h-5 w-5" />
                      </button>
                      <button @click="downloadPodcast(episode.title, episode.enclosureUrl, episode.id)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                        <span class="sr-only">Download</span>
                        <ArrowDownTrayIcon class="h-5 w-5" />
                      </button>
                      <button @click="deleteBookmark(episode.id)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                        <span class="sr-only">Dismiss</span>
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
    <div v-else class="bg-white py-32 sm:py-40">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="text-center grid min-h-full place-items-center bg-white pb-24 sm:pb-32">
          <p class="text-base font-semibold text-indigo-600">404</p>
          <h1 class="my-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Not Found</h1>
          <p class="mt-6 text-base leading-7 text-gray-600">
            We're sorry, but we are unable to find the episode you are looking for. Please use the search to try again.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <router-link to="/feed_listing" class="bg-pink-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 mx-1 rounded-full">Back to listing <span aria-hidden="true">&rarr;</span></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
