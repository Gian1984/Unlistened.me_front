<script setup>
import { ref, computed, watch } from 'vue'
import Footer from '../components/Footer.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { ArrowRightIcon, StarIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
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
const visibleCount = ref(5)
const noResult = ref(false)
const loading = ref(true)
const show = ref(false)

const visibleFeeds = computed(() => feeds.value.slice(0, visibleCount.value))

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + 5, feeds.value.length)
}

async function fetchSearchResults(param, value) {
  if (!param || !value) return
  loading.value = true
  noResult.value = false
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
    setTimeout(() => { show.value = false }, 5000)
  } catch (error) {
    authStore.clearUser()
    messageStore.setMessage('To access this functionality you have to be logged in')
    router.push({ name: 'Login' })
  }
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

watch(() => route.query, (newQuery) => {
  const queryParam = Object.keys(newQuery)[0]
  fetchSearchResults(queryParam, newQuery[queryParam])
}, { immediate: true })
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
        <div class="h-8 w-2/3 rounded animate-shimmer mb-6" />
        <div class="space-y-3 mb-16">
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
    <div v-if="noResult" class="bg-gray-950 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-4xl">
          <EmptyState
            :icon="MagnifyingGlassIcon"
            title="No results found"
            description="Sorry, your search returned no results. Try a different search term or browse our categories."
            action-text="Browse podcasts"
            action-link="/feed_listing"
          />
        </div>
      </div>
    </div>

    <div v-else class="bg-gray-950 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-4xl">
          <h1 class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">Search result</h1>
          <p class="mt-6 text-lg leading-6 text-gray-400">
            Sit back, relax, and dive into these selections, knowing that they've been handpicked just for you. Happy listening!
          </p>
          <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            <article v-for="feed in visibleFeeds" :key="feed.id" class="relative isolate flex flex-col gap-8 lg:flex-row">
              <div class="relative aspect-square lg:w-64 lg:shrink-0">
                <img :src="feed.image || '/images/image_not_available_500.webp'" alt="" class="absolute inset-0 aspect-square w-full rounded-2xl bg-gray-800 object-cover" />
                <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 aspect-square w-full" />
              </div>
              <div>
                <div class="flex items-center gap-x-4 text-xs">
                  <time :datetime="feed.newestItemPubdate" class="text-gray-500">{{ getReadableDate(feed.newestItemPubdate) }}</time>
                </div>
                <div class="group relative max-w-xl">
                  <h2 class="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-indigo-400">
                    <router-link :to="'/feed/' + feed.id">
                      <span class="absolute inset-0" />
                      {{ feed.title }}
                    </router-link>
                  </h2>
                  <p class="mt-5 text-sm leading-6 text-gray-400">{{ feed.description }}</p>
                </div>
                <div class="mt-6 flex border-t border-gray-800 pt-6">
                  <div class="relative flex items-center gap-x-4">
                    <img :src="feed.image || '/images/image_not_available_170.webp'" alt="" class="h-10 w-10 rounded-full bg-gray-800" />
                    <div class="text-sm leading-6">
                      <p class="font-semibold text-white">{{ feed.author }}</p>
                    </div>
                    <div class="text-sm leading-6 flex">
                      <router-link :to="'/feed/' + feed.id" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full flex transition-colors">
                        <span class="sr-only">Visit feed</span>
                        <ArrowRightIcon class="h-5 w-5" />
                      </router-link>
                      <button @click="addFavourite(feed.id, feed.title)" class="bg-pink-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mx-1 rounded-full transition-colors">
                        <span class="sr-only">Add to favourite</span>
                        <StarIcon class="h-5 w-5"/>
                      </button>
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
