<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import SkeletonRow from '../components/SkeletonRow.vue'
import { StarIcon, ArrowRightIcon, PlayIcon } from '@heroicons/vue/24/outline'
import { MusicalNoteIcon, PlayIcon as PlaySolid, PauseIcon } from '@heroicons/vue/24/solid'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { useHistoryStore } from '@/stores/historyStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useQueueStore } from '@/stores/queueStore.js'
import { podcastService } from '@/services/podcastService.js'
import { musicService } from '@/services/musicService.js'
import { useSeo } from '@/seo/composables/useSeo.js'
import { homeSeo } from '@/seo/registry/index.js'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import { jamendoToPlayerPayload } from '@/utils/musicTrackPayload.js'

useSeo(homeSeo)

const authStore = useAuthStore()
authStore.initializeAuth()
const messageStore = useMessageStore()
messageStore.initializeMessage()
const historyStore = useHistoryStore()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const router = useRouter()

const feeds = ref([])
const musicTracks = ref([])
const loadingPodcasts = ref(true)
const loadingMusic = ref(true)
const show = ref(false)

function resumeEntry(entry) {
  playerStore.play({
    contentType: entry.type === 'music' ? 'music' : 'podcast',
    id: entry.episodeId,
    title: entry.title,
    enclosureUrl: entry.enclosureUrl,
    image: entry.image,
    feedTitle: entry.feedTitle,
    feedId: entry.feedId,
    duration: entry.duration,
  })
}

function entryProgressPercent(entry) {
  if (!entry.duration || entry.duration <= 0) return 0
  return Math.min(100, Math.max(0, (entry.currentTime / entry.duration) * 100))
}

function playTrack(track) {
  if (playerStore.isCurrent(track.id)) {
    playerStore.togglePlay()
    return
  }
  const allTracks = musicTracks.value.map(jamendoToPlayerPayload)
  const index = allTracks.findIndex(t => String(t.id) === String(track.id))
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

function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

async function fetchTrending() {
  try {
    const response = await podcastService.getTrending()
    feeds.value = response.data.feeds
  } catch (err) {
    console.error('Error fetching feeds:', err)
  } finally {
    loadingPodcasts.value = false
  }
}

async function fetchMusic() {
  try {
    const response = await musicService.getTrending(10)
    musicTracks.value = response.data?.results || []
  } catch (err) {
    console.error('Error fetching music:', err)
  } finally {
    loadingMusic.value = false
  }
}

async function addFavourite(feedId, feedTitle) {
  try {
    await podcastService.addFavorite(feedId, feedTitle)
    show.value = true
    setTimeout(() => { show.value = false }, 3000)
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

onMounted(() => {
  fetchTrending()
  fetchMusic()
})
</script>

<template>
  <!-- Notification toast -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700 border-2 border-green-500">
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
      <!-- Header -->
      <div class="mb-10">
        <p class="text-sm font-semibold text-pink-400">Hello, listener</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Podcasts and music, all in one place
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-gray-400">
          Discover trending podcasts or explore free Creative Commons music from independent artists. No tracking, no ads &mdash; just great audio.
        </p>
      </div>

      <!-- Continue listening -->
      <div v-if="historyStore.continueListening.length" class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-300">Continue listening</h2>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
          <button
            v-for="entry in historyStore.continueListening.slice(0, 10)"
            :key="entry.episodeId"
            @click="resumeEntry(entry)"
            class="snap-start shrink-0 w-64 text-left rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div class="flex items-center gap-3 p-3">
              <div class="relative shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-700">
                <img
                  :src="entry.image || '/images/image_not_available_500.webp'"
                  :alt="entry.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayIcon class="h-7 w-7 text-white" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {{ entry.title }}
                </p>
                <p v-if="entry.feedTitle" class="text-xs text-gray-400 truncate mt-0.5">{{ entry.feedTitle }}</p>
                <p class="text-xs text-indigo-400 mt-1">Resume</p>
              </div>
            </div>
            <div class="h-1 bg-gray-700">
              <div
                class="h-full bg-indigo-500 transition-all"
                :style="{ width: entryProgressPercent(entry) + '%' }"
              />
            </div>
          </button>
        </div>
      </div>

      <!-- Trending Podcasts -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-300">Trending podcasts</h2>
          <router-link
            to="/podcasts"
            class="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            See all
            <ArrowRightIcon class="h-4 w-4" />
          </router-link>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loadingPodcasts" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <!-- Podcast grid (first 6) -->
        <ul v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <li
            v-for="feed in feeds.slice(0, 6)"
            :key="feed.id"
            class="rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
          >
            <router-link :to="'/feed/' + feed.id" class="block">
              <div class="flex items-center gap-3 p-4">
                <div class="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-700">
                  <img
                    :src="feed.image || '/images/image_not_available_500.webp'"
                    :alt="feed.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {{ feed.title }}
                  </h3>
                  <p class="text-xs text-gray-400 truncate mt-0.5">{{ feed.author }}</p>
                  <p class="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {{ stripHtmlTags(feed.description) }}
                  </p>
                </div>
              </div>
              <div v-if="feed.categories && Object.keys(feed.categories).length" class="px-4 pb-3 flex flex-wrap gap-1">
                <span
                  v-for="(catName, catId) in Object.fromEntries(Object.entries(feed.categories || {}).slice(0, 3))"
                  :key="catId"
                  class="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
                >
                  {{ catName }}
                </span>
              </div>
            </router-link>
            <div class="flex items-center gap-2 px-4 pb-3">
              <button
                @click.prevent="addFavourite(feed.id, feed.title)"
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-400 transition-colors"
                title="Add to favourites"
              >
                <StarIcon class="h-4 w-4" />
                <span class="hidden sm:inline">Save</span>
              </button>
              <router-link
                :to="'/feed/' + feed.id"
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors ml-auto"
              >
                <span>Episodes</span>
                <ArrowRightIcon class="h-3.5 w-3.5" />
              </router-link>
            </div>
          </li>
        </ul>
      </section>

      <!-- Trending Music -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-300">Trending music</h2>
          <router-link
            to="/music"
            class="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            See all
            <ArrowRightIcon class="h-4 w-4" />
          </router-link>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loadingMusic" class="space-y-2">
          <SkeletonRow v-for="n in 5" :key="n" />
        </div>

        <!-- Empty -->
        <div
          v-else-if="!musicTracks.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MusicalNoteIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">No music available right now.</p>
        </div>

        <!-- Music rows -->
        <ul v-else class="space-y-2">
          <li
            v-for="(track, idx) in musicTracks"
            :key="track.id"
            class="group flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-2 sm:p-3 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60"
          >
            <span class="hidden w-5 shrink-0 text-center text-xs text-gray-500 sm:block tabular-nums">
              {{ idx + 1 }}
            </span>

            <div
              class="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-gray-700 cursor-pointer"
              @click="playTrack(track)"
            >
              <img
                v-if="track.album_image"
                :src="track.album_image"
                :alt="track.album_name || track.name"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity flex items-center justify-center">
                <PauseIcon v-if="isCurrentTrack(track)" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <PlaySolid v-else class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-semibold truncate transition-colors cursor-pointer"
                :class="isCurrentTrack(track) ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
                @click="playTrack(track)"
              >
                {{ track.name }}
              </p>
              <div class="flex flex-wrap items-center gap-1 text-xs text-gray-400">
                <span class="truncate">{{ track.artist_name }}</span>
                <LicenseBadge :url="track.license_ccurl" size="xs" />
              </div>
            </div>

            <span class="hidden sm:block shrink-0 text-xs text-gray-500 tabular-nums">
              {{ formatDuration(track.duration) }}
            </span>
          </li>
        </ul>
      </section>

      <!-- Quick links -->
      <div class="pt-8 border-t border-gray-800">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link to="/podcasts" class="flex items-center gap-3 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-colors group">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">Podcasts</p>
              <p class="text-xs text-gray-500">Browse all trending shows</p>
            </div>
          </router-link>
          <router-link to="/music" class="flex items-center gap-3 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-colors group">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <MusicalNoteIcon class="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">Music</p>
              <p class="text-xs text-gray-500">Free Creative Commons tracks</p>
            </div>
          </router-link>
          <router-link to="/categories" class="flex items-center gap-3 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-colors group">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">Categories</p>
              <p class="text-xs text-gray-500">Explore podcasts by genre</p>
            </div>
          </router-link>
          <router-link to="/about" class="flex items-center gap-3 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-colors group">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <ArrowRightIcon class="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">About</p>
              <p class="text-xs text-gray-500">Learn about Unlistened.me</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
