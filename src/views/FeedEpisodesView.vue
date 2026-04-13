<script setup>
import Footer from '../components/Footer.vue'
import SkeletonRow from '../components/SkeletonRow.vue'
import EmptyState from '../components/EmptyState.vue'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { BookmarkIcon, StarIcon, CheckCircleIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useQueueStore } from '@/stores/queueStore.js'
import { useHistoryStore } from '@/stores/historyStore.js'
import { podcastService } from '@/services/podcastService.js'
import { stripHtmlTags } from '@/utils/text.js'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSeo } from '@/seo/composables/useSeo.js'
import { buildPodcastSchema } from '@/seo/schemas/podcast.js'
import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'

const authStore = useAuthStore()
const messageStore = useMessageStore()
messageStore.initializeMessage()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const historyStore = useHistoryStore()
const route = useRoute()
const router = useRouter()

function episodeProgress(episodeId) {
  return historyStore.getProgress(episodeId)
}

const feedInfo = ref(null)
const episodes = ref([])
const error = ref(null)

const seoConfig = computed(() => {
  const fallbackCanonical = `https://www.unlistened.me/feed/${route.params.id}`

  if (error.value) {
    return {
      title: 'Podcast Not Found | Unlistened.me',
      description: 'The podcast you are looking for could not be found.',
      canonical: fallbackCanonical,
      robots: 'noindex,nofollow',
    }
  }

  if (!feedInfo.value) {
    return {
      title: 'Podcast Episodes | Unlistened.me',
      description: 'Browse podcast episodes on Unlistened.me.',
      canonical: fallbackCanonical,
    }
  }
  return {
    title: `${feedInfo.value.title} — Episodes | Unlistened.me`,
    description: feedInfo.value.description,
    canonical: `https://www.unlistened.me/feed/${feedInfo.value.id}`,
    ogType: 'website',
    ogImage: feedInfo.value.image,
    jsonLd: [
      buildPodcastSchema(feedInfo.value),
      buildBreadcrumbSchema([
        { name: 'Home', url: 'https://www.unlistened.me/' },
        { name: feedInfo.value.title, url: `https://www.unlistened.me/feed/${feedInfo.value.id}` },
      ]),
    ].filter(Boolean),
  }
})

useSeo(seoConfig)
const visibleCount = ref(15)
const loading = ref(true)
const show = ref(false)

const visibleEpisodes = computed(() => episodes.value.slice(0, visibleCount.value))
const cleanDescription = computed(() => stripHtmlTags(feedInfo.value?.description || ''))
const categoryEntries = computed(() => {
  if (!feedInfo.value?.categories || typeof feedInfo.value.categories !== 'object') return []
  return Object.entries(feedInfo.value.categories).slice(0, 6)
})
const headerMeta = computed(() => {
  if (!feedInfo.value) return []

  const items = []
  if (feedInfo.value.author) items.push(feedInfo.value.author)
  if (feedInfo.value.language) items.push(String(feedInfo.value.language).toUpperCase())
  if (episodes.value.length) items.push(`${episodes.value.length} episodes`)

  return items
})

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + 10, episodes.value.length)
}

function playEpisode(episode, index = null) {
  // Toggle pause/resume when clicking the already-active episode
  if (playerStore.isCurrent(episode.id)) {
    playerStore.togglePlay()
    return
  }
  const episodeList = visibleEpisodes.value.map(ep => ({
    contentType: 'podcast',
    id: ep.id,
    title: ep.title,
    enclosureUrl: ep.enclosureUrl,
    image: feedInfo.value?.image || '',
    feedTitle: feedInfo.value?.title || '',
    feedId: feedInfo.value?.id || null,
    duration: ep.duration,
  }))
  if (index !== null) {
    queueStore.setQueue(episodeList, index)
  }
  playerStore.play({
    id: episode.id,
    title: episode.title,
    enclosureUrl: episode.enclosureUrl,
    image: feedInfo.value?.image || '',
    feedTitle: feedInfo.value?.title || '',
    feedId: feedInfo.value?.id || null,
  })
}

function isPlayingEpisode(episode) {
  return playerStore.isPlayingTrack(episode.id)
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
  if (!authStore.isAuthenticated) {
    messageStore.setMessage('To access this functionality you have to be logged in')
    router.push({ name: 'Login' })
    return
  }

  try {
    await podcastService.addFavorite(feedId, feedTitle)
    show.value = true
    setTimeout(() => { show.value = false }, 3000)
  } catch (err) {
    if (err.response?.status !== 401) {
      messageStore.setMessage('There was an error while saving the favorite. Please try again.')
    }
  }
}

async function addBookmarks(episodeId, episodeTitle) {
  if (!authStore.isAuthenticated) {
    messageStore.setMessage('To access this functionality you have to be logged in')
    router.push({ name: 'Login' })
    return
  }

  try {
    await podcastService.addBookmark(episodeId, episodeTitle)
    show.value = true
    setTimeout(() => { show.value = false }, 3000)
  } catch (err) {
    if (err.response?.status !== 401) {
      messageStore.setMessage('There was an error while saving the bookmark. Please try again.')
    }
  }
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
          <SkeletonRow v-for="n in 6" :key="n" />
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="feedInfo && !error">
        <nav aria-label="Breadcrumb" class="mb-4">
          <ol class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <li>
              <router-link to="/" class="transition-colors hover:text-gray-300">Home</router-link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <router-link to="/podcasts" class="transition-colors hover:text-gray-300">Podcasts</router-link>
            </li>
            <li aria-hidden="true">/</li>
            <li class="truncate text-gray-400">{{ feedInfo.title }}</li>
          </ol>
        </nav>

        <!-- Podcast header card -->
        <section class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/60 p-5 sm:p-6">
          <div class="flex items-start gap-4">
          <img
            :src="feedInfo.image || '/images/image_not_available_500.webp'"
            :alt="feedInfo.title"
            class="h-20 w-20 shrink-0 rounded-xl object-cover bg-gray-700 sm:h-24 sm:w-24"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-indigo-400">Podcast</p>
            <h1 class="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{{ feedInfo.title }}</h1>
            <div v-if="headerMeta.length" class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-400">
              <template v-for="(item, index) in headerMeta" :key="item">
                <span>{{ item }}</span>
                <span v-if="index < headerMeta.length - 1" class="text-gray-600">&middot;</span>
              </template>
            </div>
            <p class="mt-4 max-w-4xl text-sm leading-7 text-gray-400 sm:text-base">
              {{ cleanDescription || 'Listen to the latest episodes from this podcast on Unlistened.me.' }}
            </p>
          </div>
          <button
            @click="addFavourite(feedInfo.id, feedInfo.title)"
            class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-300 transition-colors"
            title="Add to favourites"
          >
            <StarIcon class="h-5 w-5" />
          </button>
          </div>

          <div v-if="categoryEntries.length" class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="([catId, catName]) in categoryEntries"
              :key="catId"
              class="rounded-full border border-gray-700 bg-gray-800/80 px-3 py-1 text-xs font-medium text-gray-300"
            >
              {{ catName }}
            </span>
          </div>
        </section>

        <!-- Episode count -->
        <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {{ episodes.length }} Episodes
        </h2>

        <!-- Episode list -->
        <ul class="space-y-2">
          <li
            v-for="(episode, idx) in visibleEpisodes"
            :key="episode.id"
            class="relative group flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-2 sm:p-3 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60 overflow-hidden"
          >
            <!-- Index (desktop) -->
            <span class="hidden w-5 shrink-0 text-center text-xs text-gray-500 sm:block tabular-nums">
              {{ idx + 1 }}
            </span>

            <!-- Cover with play/pause overlay -->
            <div
              class="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-gray-700 cursor-pointer"
              @click="playEpisode(episode, idx)"
            >
              <img
                v-if="feedInfo.image"
                :src="feedInfo.image"
                :alt="episode.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity flex items-center justify-center">
                <PauseIcon v-if="isPlayingEpisode(episode)" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <PlayIcon v-else class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <!-- Title + info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <router-link
                  :to="`/episode/${episode.id}`"
                  class="truncate text-sm font-semibold transition-colors"
                  :class="isPlayingEpisode(episode) ? 'text-indigo-300' : (episodeProgress(episode.id)?.completed ? 'text-gray-400' : 'text-white group-hover:text-indigo-300')"
                >
                  {{ episode.title }}
                </router-link>
                <CheckCircleIcon
                  v-if="episodeProgress(episode.id)?.completed"
                  class="h-4 w-4 shrink-0 text-green-500"
                  title="Played"
                />
              </div>
              <div class="flex flex-wrap items-center gap-1 text-xs text-gray-400">
                <span v-if="episode.datePublishedPretty">{{ episode.datePublishedPretty }}</span>
                <span v-if="episode.duration"> &middot; {{ Math.round(episode.duration / 60) }} min</span>
                <span
                  v-if="episodeProgress(episode.id) && !episodeProgress(episode.id).completed && episodeProgress(episode.id).percent > 0"
                  class="text-indigo-400"
                >
                  &middot; {{ Math.round(episodeProgress(episode.id).percent) }}% played
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex shrink-0 items-center gap-0.5">
              <button
                @click="addBookmarks(episode.id, episode.title)"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-indigo-400"
                title="Bookmark"
              >
                <BookmarkIcon class="h-4 w-4" />
              </button>
            </div>

            <!-- Progress bar overlay -->
            <div
              v-if="episodeProgress(episode.id) && !episodeProgress(episode.id).completed && episodeProgress(episode.id).percent > 0"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700/50"
            >
              <div
                class="h-full bg-indigo-500"
                :style="{ width: episodeProgress(episode.id).percent + '%' }"
              />
            </div>
          </li>
        </ul>

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
