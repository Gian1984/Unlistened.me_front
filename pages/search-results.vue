<script setup>
import { ref, computed, watch } from 'vue'
import Footer from '~/src/components/Footer.vue'
import SkeletonCard from '~/src/components/SkeletonCard.vue'
import EmptyState from '~/src/components/EmptyState.vue'
import PageHero from '~/src/components/PageHero.vue'
import FavoriteMusicButton from '~/src/components/music/FavoriteMusicButton.vue'
import AddToPlaylistMenu from '~/src/components/music/AddToPlaylistMenu.vue'
import LicenseBadge from '~/src/components/music/LicenseBadge.vue'
import PlayIcon from '@heroicons/vue/24/solid/esm/PlayIcon.js'
import PauseIcon from '@heroicons/vue/24/solid/esm/PauseIcon.js'
import ArrowRightIcon from '@heroicons/vue/24/outline/esm/ArrowRightIcon.js'
import StarIcon from '@heroicons/vue/24/outline/esm/StarIcon.js'
import CheckCircleIcon from '@heroicons/vue/24/outline/esm/CheckCircleIcon.js'
import MusicalNoteIcon from '@heroicons/vue/24/outline/esm/MusicalNoteIcon.js'
import XMarkIcon from '@heroicons/vue/20/solid/esm/XMarkIcon.js'
import MagnifyingGlassIcon from '@heroicons/vue/24/outline/esm/MagnifyingGlassIcon.js'
import { useAuthStore } from '~/src/stores/authStore.js'
import { useMessageStore } from '~/src/stores/messageStore.js'
import { usePlayerStore } from '~/src/stores/playerStore.js'
import { useQueueStore } from '~/src/stores/queueStore.js'
import { podcastService } from '~/src/services/podcastService.js'
import { musicService } from '~/src/services/musicService.js'
import { useSeo } from '~/src/seo/composables/useSeo.js'
import { jamendoToPlayerPayload } from '~/src/utils/musicTrackPayload.js'
import { stripHtmlTags } from '~/src/utils/text.js'

const authStore = useAuthStore()

const messageStore = useMessageStore()
messageStore.initializeMessage()

const playerStore = usePlayerStore()
const queueStore = useQueueStore()

const route = useRoute()
const router = useRouter()

const feeds = ref([])
const musicTracks = ref([])
const visibleCount = ref(12)
const noResult = ref(false)
const loading = ref(true)
const show = ref(false)

const searchType = computed(() => route.query.type || 'podcasts')
const isMusic = computed(() => searchType.value === 'music')

const visibleFeeds = computed(() => feeds.value.slice(0, visibleCount.value))
const visibleMusic = computed(() => musicTracks.value.slice(0, visibleCount.value))

const pageEyebrow = computed(() => {
  if (route.query.q) return 'Search'
  if (route.query.s) return 'Category'
  return 'Browse'
})

const pageTitle = computed(() => {
  if (route.query.q) return `Results for "${route.query.q}"`
  if (route.query.s) return route.query.name || 'Category results'
  return 'Search results'
})

const pageDescription = computed(() => {
  if (route.query.q) {
    return 'Here are the podcasts matching your search. Explore, save your favourites, and start listening.'
  }
  if (route.query.s) {
    return `Browse podcasts in ${route.query.name || 'this category'}. Explore new shows and start listening.`
  }
  return 'Explore podcasts that match your search.'
})

const seoConfig = computed(() => ({
  title: route.query.q
    ? `"${route.query.q}" — Podcast Search | Unlistened.me`
    : route.query.name
      ? `${route.query.name} Podcasts | Unlistened.me`
      : 'Search Results | Unlistened.me',
  description: pageDescription.value,
}))

useSeo(seoConfig.value)

const musicSeoConfig = computed(() => ({
  title: route.query.q
    ? `"${route.query.q}" — Music Search | Unlistened.me`
    : 'Music Search | Unlistened.me',
  description: 'Search results for Creative Commons music from independent artists.',
}))

watch(searchType, (type) => {
  if (type === 'music') {
    useSeo(musicSeoConfig.value)
  } else {
    useSeo(seoConfig.value)
  }
}, { immediate: true })

async function fetchPodcastResults() {
  if (!route.query.q && !route.query.s) {
    loading.value = false
    return
  }

  try {
    let response
    if (route.query.q) {
      response = await podcastService.search(route.query.q)
    } else if (route.query.s) {
      response = await podcastService.getByCategory(route.query.s)
    }
    const results = response.data?.feeds || []
    feeds.value = results
    noResult.value = results.length === 0
  } catch (error) {
    console.error('Error fetching search results:', error)
    feeds.value = []
    noResult.value = true
  } finally {
    loading.value = false
  }
}

async function fetchMusicResults() {
  if (!route.query.q) {
    loading.value = false
    return
  }

  try {
    const response = await musicService.searchTracks(route.query.q)
    const results = response.data?.results || []
    musicTracks.value = results
    noResult.value = results.length === 0
  } catch (error) {
    console.error('Error fetching music search results:', error)
    musicTracks.value = []
    noResult.value = true
  } finally {
    loading.value = false
  }
}

function loadMore() {
  visibleCount.value += 12
}

function resetVisibleCount() {
  visibleCount.value = 12
}

watch(
  () => [route.query.q, route.query.s, route.query.type],
  ([newQ, newS, newType]) => {
    loading.value = true
    noResult.value = false
    resetVisibleCount()
    if (newType === 'music') {
      fetchMusicResults()
    } else {
      fetchPodcastResults()
    }
  },
  { immediate: true }
)

function playTrack(track) {
  if (playerStore.isCurrent(track.id)) {
    playerStore.togglePlay()
    return
  }

  const allTracks = musicTracks.value.map(jamendoToPlayerPayload)
  const index = allTracks.findIndex((item) => String(item.id) === String(track.id))
  if (index === -1) {
    playerStore.play(jamendoToPlayerPayload(track))
    return
  }

  queueStore.setQueue(allTracks, index)
  playerStore.play(allTracks[index])
}

function isCurrentTrack(track) {
  return playerStore.isPlayingTrack(track.id)
}

function playFeed(feed) {
  if (!feed.episodes || feed.episodes.length === 0) return
  const episode = feed.episodes[0]
  playerStore.play({
    contentType: 'podcast',
    id: episode.id,
    title: episode.title,
    enclosureUrl: episode.enclosureUrl,
    image: feed.image,
    feedTitle: feed.title,
    feedId: feed.id,
    duration: episode.duration,
  })
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

function closeCategoryFilter() {
  router.replace({ path: route.path })
}
</script>

<template>
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
                class="ml-auto inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
                @click="show = false"
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
      <PageHero
        :eyebrow="pageEyebrow"
        :title="pageTitle"
        :description="pageDescription"
        :breadcrumbs="[
          { label: 'Home', to: '/' },
          { label: 'Search' },
        ]"
      />

      <div v-if="searchType === 'music'" class="mb-6 flex items-center gap-4">
        <button
          type="button"
          class="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white"
        >
          Music
        </button>
        <button
          type="button"
          class="rounded-full bg-gray-800 px-4 py-1.5 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
          @click="router.push({ path: '/search-results', query: { q: route.query.q, type: 'podcasts' } })"
        >
          Podcasts
        </button>
      </div>

      <div v-else class="mb-6 flex items-center gap-4">
        <button
          type="button"
          class="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white"
        >
          Podcasts
        </button>
        <button
          type="button"
          class="rounded-full bg-gray-800 px-4 py-1.5 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
          @click="router.push({ path: '/search-results', query: { q: route.query.q, type: 'music' } })"
        >
          Music
        </button>
      </div>

      <div v-if="route.query.s" class="mb-6 flex items-center gap-2">
        <span class="text-sm text-gray-400">Filtering by:</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
          {{ route.query.name || route.query.s }}
          <button
            type="button"
            class="ml-1 text-indigo-300 hover:text-white"
            @click="closeCategoryFilter"
          >
            <XMarkIcon class="h-3 w-3" />
          </button>
        </span>
      </div>

      <template v-if="isMusic">
        <div v-if="loading" class="space-y-2">
          <SkeletonRow v-for="n in 5" :key="n" />
        </div>

        <div
          v-else-if="noResult || !musicTracks.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MusicalNoteIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">No music found for "{{ route.query.q }}"</p>
        </div>

        <ul v-else class="space-y-2">
          <li
            v-for="(track, idx) in visibleMusic"
            :key="track.id"
            class="group flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/40 p-2 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60 sm:gap-3 sm:p-3"
          >
            <span class="hidden w-5 shrink-0 text-center text-xs tabular-nums text-gray-500 sm:block">
              {{ idx + 1 }}
            </span>

            <div
              class="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-700 sm:h-12 sm:w-12"
              @click="playTrack(track)"
            >
              <img
                v-if="track.album_image"
                :src="track.album_image"
                :alt="track.album_name || track.name"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
              </div>
              <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                <PauseIcon v-if="isCurrentTrack(track)" class="h-5 w-5 text-white sm:h-6 sm:w-6" />
                <PlayIcon v-else class="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <p
                class="cursor-pointer truncate text-sm font-semibold transition-colors"
                :class="isCurrentTrack(track) ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
                @click="playTrack(track)"
              >
                {{ track.name }}
              </p>
              <p class="mt-1 truncate text-xs text-gray-400">{{ track.artist_name }}</p>
              <div class="mt-1 min-h-5 text-xs text-gray-400">
                <LicenseBadge v-if="track.license_ccurl" :url="track.license_ccurl" size="xs" />
                <span v-else class="truncate">Creative Commons</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <FavoriteMusicButton :track="track" size="sm" />
              <AddToPlaylistMenu :track="track" size="sm" />
            </div>

            <span class="hidden shrink-0 text-xs tabular-nums text-gray-500 sm:block">
              {{ track.duration ? Math.floor(track.duration / 60) + ':' + String(track.duration % 60).padStart(2, '0') : '--:--' }}
            </span>
          </li>
        </ul>

        <div v-if="musicTracks.length > visibleCount" class="mt-8 text-center">
          <button
            type="button"
            class="rounded-lg border border-gray-700 bg-gray-800 px-6 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:bg-gray-700/80 hover:text-white"
            @click="loadMore"
          >
            Load more
          </button>
        </div>
      </template>

      <template v-else>
        <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <div
          v-else-if="noResult || !feeds.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MagnifyingGlassIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">
            {{ route.query.q ? `No podcasts found for "${route.query.q}"` : 'Start typing to search for podcasts' }}
          </p>
        </div>

        <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <li
            v-for="feed in visibleFeeds"
            :key="feed.id"
            class="group overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-all hover:border-indigo-500 hover:shadow-lg"
          >
            <NuxtLink :to="'/feed/' + feed.id" class="block">
              <div class="flex items-center gap-3 p-4">
                <div class="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-700">
                  <img
                    :src="feed.image || '/images/image_not_available_500.webp'"
                    :alt="feed.title"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                    {{ feed.title }}
                  </h3>
                  <p class="mt-0.5 truncate text-xs text-gray-400">{{ feed.author }}</p>
                  <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {{ stripHtmlTags(feed.description) }}
                  </p>
                </div>
              </div>
              <div v-if="feed.categories && Object.keys(feed.categories).length" class="flex flex-wrap gap-1 px-4 pb-3">
                <span
                  v-for="(catName, catId) in Object.fromEntries(Object.entries(feed.categories || {}).slice(0, 3))"
                  :key="catId"
                  class="inline-block rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300"
                >
                  {{ catName }}
                </span>
              </div>
            </NuxtLink>
            <div class="flex items-center gap-2 px-4 pb-3">
              <button
                @click.prevent="addFavourite(feed.id, feed.title)"
                class="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-pink-400"
                title="Add to favourites"
              >
                <StarIcon class="h-4 w-4" />
                <span class="hidden sm:inline">Save</span>
              </button>
              <button
                @click.prevent="playFeed(feed)"
                class="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-indigo-400"
                title="Play latest episode"
              >
                <PlayIcon class="h-4 w-4" />
                <span class="hidden sm:inline">Play</span>
              </button>
              <NuxtLink
                :to="'/feed/' + feed.id"
                class="ml-auto flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-indigo-400"
              >
                <span>Episodes</span>
                <ArrowRightIcon class="h-3.5 w-3.5" />
              </NuxtLink>
            </div>
          </li>
        </ul>

        <div v-if="feeds.length > visibleCount" class="mt-8 text-center">
          <button
            type="button"
            class="rounded-lg border border-gray-700 bg-gray-800 px-6 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:bg-gray-700/80 hover:text-white"
            @click="loadMore"
          >
            Load more
          </button>
        </div>
      </template>
    </div>
  </div>

  <Footer />
</template>