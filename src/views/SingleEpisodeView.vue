<script setup>
import Footer from '../components/Footer.vue'
import EmptyState from '../components/EmptyState.vue'
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  PlayIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { podcastService } from '@/services/podcastService.js'
import { ref, onMounted, computed } from 'vue'
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

const isCurrentEpisode = computed(() => {
  return playerStore.currentEpisode?.id === episode.value?.id
})

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
    setTimeout(() => {
      show.value = false
    }, 3000)
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
  <!-- Notification -->
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
              <p class="ml-3 text-sm font-medium text-white">Bookmark removed successfully.</p>
              <button
                  type="button"
                  @click="show = false"
                  class="ml-auto inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
              >
                <span class="sr-only">Close</span>
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
      <!-- Loading -->
      <div v-if="loading" class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div class="aspect-square rounded-2xl bg-gray-800 animate-shimmer border border-gray-700"></div>

          <div class="space-y-4">
            <div class="h-4 w-40 rounded animate-shimmer"></div>
            <div class="h-10 w-5/6 rounded animate-shimmer"></div>
            <div class="h-4 w-full rounded animate-shimmer"></div>
            <div class="h-4 w-full rounded animate-shimmer"></div>
            <div class="h-4 w-4/5 rounded animate-shimmer"></div>

            <div class="pt-4 border-t border-gray-800 flex gap-3">
              <div class="h-10 w-10 rounded-full animate-shimmer"></div>
              <div class="h-10 w-10 rounded-full animate-shimmer"></div>
              <div class="h-10 w-10 rounded-full animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="episode && !error" class="mx-auto max-w-6xl">
        <!-- Episode hero -->
        <section class="rounded-3xl border border-gray-800 bg-gray-900/30 p-5 sm:p-6 lg:p-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
            <!-- Cover -->
            <div>
              <div class="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-lg">
                <img
                    :src="episode.image || '/images/image_not_available_500.webp'"
                    :alt="episode.title"
                    class="aspect-square w-full object-cover"
                />
              </div>
            </div>

            <!-- Content -->
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <span class="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                  Episode
                </span>
                <time
                    v-if="episode.datePublishedPretty"
                    :datetime="episode.newestItemPubdate"
                    class="text-sm text-gray-500"
                >
                  {{ episode.datePublishedPretty }}
                </time>
              </div>

              <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-5xl leading-tight">
                {{ episode.title }}
              </h1>

              <p
                  v-if="episode.feedTitle"
                  class="mt-3 text-sm text-gray-400"
              >
                From
                <span class="font-medium text-gray-300">{{ episode.feedTitle }}</span>
              </p>

              <p class="mt-6 max-w-4xl text-base leading-8 text-gray-400">
                {{ stripHtmlTags(episode.description) }}
              </p>

              <!-- Actions -->
              <div class="mt-8 border-t border-gray-800 pt-6">
                <div class="flex flex-wrap items-center gap-3">
                  <button
                      @click="playEpisode(episode)"
                      :class="[
                      'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
                      isCurrentEpisode
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                        : 'bg-pink-500 text-white hover:bg-indigo-600'
                    ]"
                  >
                    <PlayIcon class="h-4 w-4" />
                    <span>{{ isCurrentEpisode ? 'Playing now' : 'Play episode' }}</span>
                  </button>

                  <button
                      @click="downloadPodcast(episode.title, episode.enclosureUrl, episode.id)"
                      class="inline-flex items-center gap-2 rounded-full bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
                  >
                    <ArrowDownTrayIcon class="h-4 w-4" />
                    <span>Download</span>
                  </button>

                  <button
                      @click="deleteBookmark(episode.id)"
                      class="inline-flex items-center gap-2 rounded-full bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-red-500 hover:text-red-400"
                  >
                    <TrashIcon class="h-4 w-4" />
                    <span>Remove bookmark</span>
                  </button>

                  <router-link
                      v-if="episode.feedId"
                      :to="'/feed/' + episode.feedId"
                      class="inline-flex items-center gap-2 rounded-full bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500 hover:text-indigo-400"
                  >
                    <span>Open podcast</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Extra details -->
        <section class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Type</p>
            <p class="mt-2 text-sm font-semibold text-white">Saved episode</p>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Status</p>
            <p class="mt-2 text-sm font-semibold text-white">
              {{ isCurrentEpisode ? 'Currently playing' : 'Ready to play' }}
            </p>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Actions</p>
            <p class="mt-2 text-sm font-semibold text-white">Play, download, or remove</p>
          </div>
        </section>
      </div>

      <!-- Error -->
      <div v-else class="mx-auto max-w-5xl py-16">
        <EmptyState
            :icon="ExclamationTriangleIcon"
            title="Not found"
            description="We could not find the episode you are looking for. Please go back and try again."
            action-text="Back to listing"
            action-link="/"
        />
      </div>
    </div>
  </div>

  <Footer />
</template>