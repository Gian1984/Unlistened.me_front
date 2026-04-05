<script setup>
import { ref, computed, onMounted } from 'vue'
import Footer from '../components/Footer.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import { StarIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { podcastService } from '@/services/podcastService.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
authStore.initializeAuth()
const messageStore = useMessageStore()
messageStore.initializeMessage()
const router = useRouter()

const feeds = ref([])
const visibleCount = ref(5)
const loading = ref(true)
const show = ref(false)

const visiblePodcasts = computed(() => feeds.value.slice(0, visibleCount.value))

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + 5, feeds.value.length)
}

async function fetchPodcasts() {
  try {
    const response = await podcastService.getTrending()
    feeds.value = response.data.feeds
  } catch (err) {
    console.error('Error fetching feeds:', err)
  } finally {
    loading.value = false
  }
}

async function addFavourite(feedId, feedTitle) {
  try {
    await podcastService.addFavorite(feedId, feedTitle)
    show.value = true
    setTimeout(() => { show.value = false }, 5000)
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

function getReadableDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchPodcasts()
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
        <div class="h-4 w-20 rounded animate-shimmer mb-4" />
        <div class="h-8 w-2/3 rounded animate-shimmer mb-6" />
        <div class="space-y-3 mb-16">
          <div class="h-3 w-full rounded animate-shimmer" />
          <div class="h-3 w-full rounded animate-shimmer" />
          <div class="h-3 w-3/4 rounded animate-shimmer" />
        </div>
        <div class="space-y-20">
          <SkeletonCard v-for="n in 3" :key="n" />
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <div class="bg-gray-950 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-4xl">
          <p class="text-base font-semibold leading-7 text-indigo-400">Welcome!</p>
          <h1 class="mt-2 mb-6 text-3xl font-bold tracking-tight text-white sm:text-5xl">Dive into the podcast world</h1>
          <p class="mt-2 text-lg leading-6 text-gray-400">
            Here, you can browse through our comprehensive list of podcast feeds,
            featuring a variety of genres that cater to all tastes and interests.
            <br><br>
            Whether you're in the mood for thrilling mysteries, educational content, or light-hearted comedy,
            our expansive library has something for everyone.
            Dive in, explore at your leisure, and uncover new favorites that resonate with your unique preferences.
            Happy listening!
          </p>
          <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            <article v-for="(feed, index) in visiblePodcasts" :key="index" class="relative isolate flex flex-col gap-8 lg:flex-row">
              <div class="relative aspect-square lg:w-64 lg:shrink-0">
                <img :src="feed.image || '/images/image_not_available_500.webp'" alt="" class="absolute inset-0 aspect-square w-full rounded-2xl bg-gray-800 object-cover" />
                <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 aspect-square w-full" />
              </div>
              <div>
                <div class="flex items-center gap-x-4 text-xs">
                  <time :datetime="feed.newestItemPubdate" class="text-gray-500">{{ getReadableDate(feed.newestItemPublishTime) }}</time>
                </div>
                <div class="group relative max-w-xl">
                  <h2 class="mt-3 text-lg font-bold leading-6 text-white group-hover:text-indigo-400">
                    <router-link :to="'/feed/' + feed.id">
                      <span class="text-white font-bold hover:text-indigo-400">{{ feed.title }}</span>
                    </router-link>
                  </h2>
                  <p class="mt-5 text-sm leading-6 text-gray-400 text-ellipsis overflow-hidden">{{ stripHtmlTags(feed.description) }}</p>
                  <div class="mt-5">
                    <span class="font-semibold text-gray-300">Categories:</span>
                  </div>
                  <div class="flex items-center gap-x-1" v-for="category in feed.categories">
                    <span class="text-gray-400">{{ category }}</span>
                  </div>
                </div>
                <div class="mt-6 flex border-t border-gray-800 pt-6">
                  <div class="relative flex items-center gap-x-6">
                    <img :src="feed.artwork || '/images/image_not_available_170.webp'" alt="" class="h-10 w-10 rounded-full bg-gray-800" />
                    <div class="text-sm leading-6">
                      <div>
                        <span class="text-gray-500">Author:</span>
                      </div>
                      <p class="font-semibold text-white">{{ feed.author }}</p>
                    </div>
                    <div class="text-sm leading-6 flex">
                      <button @click="addFavourite(feed.id, feed.title)" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full transition-colors">
                        <span class="sr-only">Add favourite</span>
                        <StarIcon class="h-5 w-5" />
                      </button>
                      <router-link :to="'/feed/' + feed.id" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full flex transition-colors">
                        <span class="sr-only">Visit feed</span>
                        <ArrowRightIcon class="h-5 w-5" />
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <button class="bg-indigo-600 hover:bg-pink-500 text-white font-bold py-2 px-4 mx-1 rounded-full flex transition-colors" v-if="visibleCount < feeds.length" @click="loadMore">
              Load More ...
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
