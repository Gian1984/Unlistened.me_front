<script setup>
import { ref } from 'vue'
import PageHero from '@/components/PageHero.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import { StarIcon, ArrowRightIcon, PlayIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { MusicalNoteIcon, PlayIcon as PlaySolid, PauseIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { podcastService } from '@/services/podcastService'
import { musicService } from '@/services/musicService'
import { jamendoToPlayerPayload } from '@/utils/musicTrackPayload.js'
import { formatDuration } from '@/utils/formatTime.js'
import { stripHtmlTags } from '@/utils/text.js'
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo('home')

const authStore = useAuthStore()
const messageStore = useMessageStore()
messageStore.initializeMessage()
const historyStore = useHistoryStore()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const router = useRouter()
const { redirectToLogin } = useAuthIntent()

const show = ref(false)

const HOME_PODCAST_POOL_SIZE = 18
const HOME_PODCAST_VISIBLE_COUNT = 6
const HOME_MUSIC_POOL_SIZE = 30
const HOME_MUSIC_VISIBLE_COUNT = 10
const HOME_ALBUMS_POOL_SIZE = 18
const HOME_ALBUMS_VISIBLE_COUNT = 6

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

function homeTrackAlbumLabel(track) {
  return track.album_name || 'Single'
}

function getDailySeed() {
  const now = new Date()
  return Number(`${now.getUTCFullYear()}${now.getUTCMonth() + 1}${now.getUTCDate()}`)
}

function seededShuffle(items, seed) {
  const result = [...items]
  let state = seed || 1

  function nextRandom() {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

// Client-only fetches: the daily seed must be evaluated at runtime so the rotation
// stays fresh between deploys. SSG would freeze the seed at build time.
const { data: feeds, pending: loadingPodcasts } = useAsyncData(
  'home-podcasts',
  async () => {
    const response = await podcastService.getTrending()
    const podcastFeeds = response.data?.feeds || []
    return seededShuffle(podcastFeeds, getDailySeed() ^ 101).slice(0, HOME_PODCAST_VISIBLE_COUNT)
  },
  { server: false, default: () => [] }
)

const { data: musicTracks, pending: loadingMusic } = useAsyncData(
  'home-music',
  async () => {
    const response = await musicService.getTrending(HOME_MUSIC_POOL_SIZE)
    const tracks = response.data?.results || []
    return seededShuffle(tracks, getDailySeed()).slice(0, HOME_MUSIC_VISIBLE_COUNT)
  },
  { server: false, default: () => [] }
)

const { data: albums, pending: loadingAlbums } = useAsyncData(
  'home-albums',
  async () => {
    const response = await musicService.getAlbums({ limit: HOME_ALBUMS_POOL_SIZE })
    const albumRows = response.data?.results || []
    return seededShuffle(albumRows, getDailySeed() ^ 202).slice(0, HOME_ALBUMS_VISIBLE_COUNT)
  },
  { server: false, default: () => [] }
)

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
    setTimeout(() => {
      show.value = false
    }, 3000)
  } catch (error) {
    if (error.response?.status !== 401) {
      messageStore.setMessage('There was an error while saving the favorite. Please try again.')
    }
  }
}

</script>

<template>
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 z-10 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-2 border-green-500 bg-gray-800 shadow-lg ring-1 ring-gray-700">
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
      <PageHero
        eyebrow="Hello, listener"
        title="Podcasts and music, all in one place"
        description="Discover trending podcasts or explore free Creative Commons music from independent artists. No tracking, no ads, just great audio."
        :breadcrumbs="[{ label: 'Home' }]"
      />

      <div v-if="historyStore.continueListening.length" class="mb-10">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">Continue listening</h2>
        </div>
        <div class="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2">
          <button
            v-for="entry in historyStore.continueListening.slice(0, 10)"
            :key="entry.episodeId"
            @click="resumeEntry(entry)"
            class="group w-64 shrink-0 snap-start overflow-hidden rounded-lg border border-gray-700 bg-gray-800 text-left transition-all hover:border-indigo-500 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div class="flex items-center gap-3 p-3">
              <div class="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-700">
                <img
                  :src="entry.image || '/images/image_not_available_500.webp'"
                  :alt="entry.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlayIcon class="h-7 w-7 text-white" />
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                  {{ entry.title }}
                </p>
                <p v-if="entry.feedTitle" class="mt-0.5 truncate text-xs text-gray-400">{{ entry.feedTitle }}</p>
                <p class="mt-1 text-xs text-indigo-400">Resume</p>
              </div>
            </div>
            <div class="h-1 bg-gray-700">
              <div class="h-full bg-indigo-500 transition-all" :style="{ width: entryProgressPercent(entry) + '%' }" />
            </div>
          </button>
        </div>
      </div>

      <section class="mb-12">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">Trending podcasts</h2>
          <NuxtLink
            to="/podcasts"
            class="flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            See all
            <ArrowRightIcon class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div v-if="loadingPodcasts" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <li
            v-for="feed in feeds"
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
      </section>

      <section class="mb-12">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">Trending music</h2>
          <NuxtLink
            to="/music"
            class="flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            See all
            <ArrowRightIcon class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div v-if="loadingMusic" class="space-y-2">
          <SkeletonRow v-for="n in 5" :key="n" />
        </div>

        <div
          v-else-if="!musicTracks.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MusicalNoteIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">No music available right now.</p>
        </div>

        <ul v-else class="space-y-2">
          <li
            v-for="(track, idx) in musicTracks"
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
                <PlaySolid v-else class="h-5 w-5 text-white sm:h-6 sm:w-6" />
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
              <NuxtLink
                v-if="track.album_id && track.album_name"
                :to="`/music/album/${track.album_id}`"
                class="mt-1 inline-flex max-w-full text-xs text-gray-500 transition-colors hover:text-indigo-300"
              >
                <span class="truncate">{{ homeTrackAlbumLabel(track) }}</span>
              </NuxtLink>
              <p v-else class="mt-1 truncate text-xs text-gray-500">{{ homeTrackAlbumLabel(track) }}</p>
            </div>

            <span class="hidden shrink-0 text-xs tabular-nums text-gray-500 sm:block">
              {{ formatDuration(track.duration) }}
            </span>
          </li>
        </ul>
      </section>

      <section class="mb-12">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-300">Trending albums</h2>
          <NuxtLink
            to="/music/albums"
            class="flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            See all
            <ArrowRightIcon class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div v-if="loadingAlbums" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <div
          v-else-if="!albums.length"
          class="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 p-10 text-center"
        >
          <MusicalNoteIcon class="mx-auto h-10 w-10 text-gray-600" />
          <p class="mt-3 text-sm text-gray-400">No albums available right now.</p>
        </div>

        <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <li
            v-for="album in albums"
            :key="album.id"
            class="group overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-all hover:border-indigo-500 hover:shadow-lg"
          >
            <NuxtLink :to="`/music/album/${album.id}`" class="block">
              <div class="flex items-center gap-3 p-4">
                <div class="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-700">
                  <img
                    v-if="album.image"
                    :src="album.image"
                    :alt="album.name"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center">
                    <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                    {{ album.name }}
                  </h3>
                  <p class="mt-0.5 truncate text-xs text-gray-400">{{ album.artist_name }}</p>
                  <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    Released {{ album.releasedate || 'recently' }}<span v-if="album.zip_allowed"> • Download available</span>
                  </p>
                </div>
              </div>
            </NuxtLink>
            <div class="flex items-center gap-2 px-4 pb-3">
              <span class="text-xs text-gray-500">{{ album.zip_allowed ? 'Downloadable' : 'Streaming' }}</span>
              <NuxtLink
                :to="`/music/album/${album.id}`"
                class="ml-auto flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-indigo-400"
              >
                <span>Album</span>
                <ArrowRightIcon class="h-3.5 w-3.5" />
              </NuxtLink>
            </div>
          </li>
        </ul>
      </section>

      <div class="border-t border-gray-800 pt-8">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink to="/podcasts" class="group flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-indigo-500">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">Podcasts</p>
              <p class="text-xs text-gray-500">Browse all trending shows</p>
            </div>
          </NuxtLink>
          <NuxtLink to="/music" class="group flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-indigo-500">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <MusicalNoteIcon class="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">Music</p>
              <p class="text-xs text-gray-500">Free Creative Commons tracks</p>
            </div>
          </NuxtLink>
          <NuxtLink to="/categories" class="group flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-indigo-500">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">Categories</p>
              <p class="text-xs text-gray-500">Explore podcasts by genre</p>
            </div>
          </NuxtLink>
          <NuxtLink to="/about" class="group flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-indigo-500">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
              <ArrowRightIcon class="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">About</p>
              <p class="text-xs text-gray-500">Learn about Unlistened.me</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
