<script setup>
import SkeletonRow from '@/components/SkeletonRow.vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHero from '@/components/PageHero.vue'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { BookmarkIcon, StarIcon, CheckCircleIcon, MusicalNoteIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { podcastService } from '@/services/podcastService.js'
import { stripHtmlTags } from '@/utils/text.js'
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  dynamicContentMode: 'client-fetch-static-shell',
})

const authStore = useAuthStore()
const messageStore = useMessageStore()
messageStore.initializeMessage()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const historyStore = useHistoryStore()
const route = useRoute()
const router = useRouter()
const { redirectToLogin } = useAuthIntent()

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
      ogImage: '',
    }
  }

  if (!feedInfo.value) {
    return {
      title: 'Podcast Episodes | Unlistened.me',
      description: 'Browse podcast episodes on Unlistened.me.',
      canonical: fallbackCanonical,
      robots: 'index,follow',
      ogImage: '',
    }
  }

  return {
    title: `${feedInfo.value.title} — Episodes | Unlistened.me`,
    description: stripHtmlTags(feedInfo.value.description || ''),
    canonical: `https://www.unlistened.me/feed/${feedInfo.value.id}`,
    ogType: 'website',
    ogImage: feedInfo.value.image || '',
    robots: 'index,follow',
  }
})

useSeoMeta({
  title: () => seoConfig.value.title,
  description: () => seoConfig.value.description,
  ogTitle: () => seoConfig.value.title,
  ogDescription: () => seoConfig.value.description,
  ogImage: () => seoConfig.value.ogImage,
  ogType: () => seoConfig.value.ogType || 'website',
  twitterTitle: () => seoConfig.value.title,
  twitterDescription: () => seoConfig.value.description,
  twitterImage: () => seoConfig.value.ogImage,
  robots: () => seoConfig.value.robots,
})

useHead({
  link: [{ rel: 'canonical', href: () => seoConfig.value.canonical }],
})

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
  if (playerStore.isCurrent(episode.id)) {
    playerStore.togglePlay()
    return
  }

  const episodeList = visibleEpisodes.value.map((entry) => ({
    contentType: 'podcast',
    id: entry.id,
    title: entry.title,
    enclosureUrl: entry.enclosureUrl,
    image: feedInfo.value?.image || '',
    feedTitle: feedInfo.value?.title || '',
    feedId: feedInfo.value?.id || null,
    duration: entry.duration,
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
  } catch {
    // Falls back to empty state.
  } finally {
    loading.value = false
  }
}

async function addFavourite(feedId, feedTitle) {
  if (!authStore.isAuthenticated) {
    redirectToLogin({
      message: 'Sign in to save this podcast — we\'ll add it after you log in.',
      intent: buildIntent('fav', feedId, feedTitle),
    })
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
    redirectToLogin({
      message: 'Sign in to bookmark this episode — we\'ll save it after you log in.',
      intent: buildIntent('bm', episodeId, episodeTitle),
    })
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
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 z-10 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-2 border-green-500 bg-gray-800 shadow-lg ring-1 ring-gray-700">
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
      <div v-if="loading">
        <div class="mb-8">
          <div class="rounded-lg border border-gray-700 bg-gray-800 p-4">
            <div class="flex items-start gap-4">
              <div class="h-20 w-20 shrink-0 rounded-lg animate-shimmer" />
              <div class="flex-1 space-y-3">
                <div class="h-6 w-2/3 rounded animate-shimmer" />
                <div class="h-4 w-1/3 rounded animate-shimmer" />
                <div class="h-3 w-full rounded animate-shimmer" />
                <div class="h-3 w-3/4 rounded animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <SkeletonRow v-for="n in 6" :key="n" />
        </div>
      </div>

      <div v-else-if="feedInfo && !error">
        <PageHero
          eyebrow="Podcast"
          :title="feedInfo.title"
          :description="cleanDescription || 'Listen to the latest episodes from this podcast on Unlistened.me.'"
          :breadcrumbs="[
            { label: 'Home', to: '/' },
            { label: 'Podcasts', to: '/podcasts' },
            { label: feedInfo.title },
          ]"
          max-width-class="max-w-4xl"
        />

        <section class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/60 p-5 sm:p-6">
          <div class="flex items-start gap-4">
            <img
              :src="feedInfo.image || '/images/image_not_available_500.webp'"
              :alt="feedInfo.title"
              class="h-20 w-20 shrink-0 rounded-xl bg-gray-700 object-cover sm:h-24 sm:w-24"
            />
            <div class="min-w-0 flex-1">
              <div v-if="headerMeta.length" class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-400">
                <template v-for="(item, index) in headerMeta" :key="item">
                  <span>{{ item }}</span>
                  <span v-if="index < headerMeta.length - 1" class="text-gray-600">&middot;</span>
                </template>
              </div>
            </div>
            <button
              @click="addFavourite(feedInfo.id, feedInfo.title)"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-400 transition-colors hover:bg-pink-500/20 hover:text-pink-300"
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

        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
          {{ episodes.length }} Episodes
        </h2>

        <ul class="space-y-2">
          <li
            v-for="(episode, idx) in visibleEpisodes"
            :key="episode.id"
            class="group relative flex items-center gap-2 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/40 p-2 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60 sm:gap-3 sm:p-3"
          >
            <span class="hidden w-5 shrink-0 text-center text-xs tabular-nums text-gray-500 sm:block">
              {{ idx + 1 }}
            </span>

            <div
              class="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-700 sm:h-12 sm:w-12"
              @click="playEpisode(episode, idx)"
            >
              <img
                v-if="feedInfo.image"
                :src="feedInfo.image"
                :alt="episode.title"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
              </div>
              <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                <PauseIcon v-if="isPlayingEpisode(episode)" class="h-5 w-5 text-white sm:h-6 sm:w-6" />
                <PlayIcon v-else class="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/episode/${episode.id}`"
                  class="truncate text-sm font-semibold transition-colors"
                  :class="isPlayingEpisode(episode) ? 'text-indigo-300' : (episodeProgress(episode.id)?.completed ? 'text-gray-400' : 'text-white group-hover:text-indigo-300')"
                >
                  {{ episode.title }}
                </NuxtLink>
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

            <div class="flex shrink-0 items-center gap-0.5">
              <button
                @click="addBookmarks(episode.id, episode.title)"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-indigo-400"
                title="Bookmark"
              >
                <BookmarkIcon class="h-4 w-4" />
              </button>
            </div>

            <div
              v-if="episodeProgress(episode.id) && !episodeProgress(episode.id).completed && episodeProgress(episode.id).percent > 0"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700/50"
            >
              <div class="h-full bg-indigo-500" :style="{ width: episodeProgress(episode.id).percent + '%' }" />
            </div>
          </li>
        </ul>

        <div v-if="visibleCount < episodes.length" class="mt-6 flex justify-center">
          <button
            @click="loadMore"
            class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300"
          >
            Show more
          </button>
        </div>
      </div>

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
</template>
