<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { MagnifyingGlassIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import PageHero from '~/src/components/PageHero.vue'
import EmptyState from '~/src/components/EmptyState.vue'
import SkeletonCard from '~/src/components/SkeletonCard.vue'
import { musicService } from '~/src/services/musicService.js'
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo('musicAlbums')

const route = useRoute()

const albums = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const query = ref(String(route.query.q || ''))
const offset = ref(0)
const hasMore = ref(true)

const PAGE_SIZE = 20
const STORAGE_KEY = 'unlistened:music-albums-view'

const pageTitle = computed(() => (
  query.value.trim()
    ? `Album results for "${query.value.trim()}"`
    : 'Browse full albums'
))

function normalizeAlbums(payload) {
  return Array.isArray(payload?.results) ? payload.results : []
}

function restoreState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return false

    const saved = JSON.parse(raw)
    const currentQuery = String(route.query.q || '')

    if (String(saved?.query || '') !== currentQuery) return false
    if (!Array.isArray(saved?.albums)) return false

    query.value = currentQuery
    albums.value = saved.albums
    offset.value = Number(saved.offset || saved.albums.length || 0)
    hasMore.value = Boolean(saved.hasMore)
    loading.value = false
    loadingMore.value = false
    return true
  } catch {
    return false
  }
}

function persistState() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      query: query.value.trim(),
      albums: albums.value,
      offset: offset.value,
      hasMore: hasMore.value,
    }))
  } catch {
    // Ignore storage failures.
  }
}

async function fetchAlbums(reset = true) {
  if (reset) {
    loading.value = true
    offset.value = 0
    hasMore.value = true
    albums.value = []
  } else {
    loadingMore.value = true
  }

  try {
    const { data } = await musicService.getAlbums({
      q: query.value.trim(),
      limit: PAGE_SIZE,
      offset: offset.value,
    })

    const batch = normalizeAlbums(data)
    albums.value = reset ? batch : [...albums.value, ...batch]
    hasMore.value = batch.length === PAGE_SIZE
    offset.value += batch.length
    persistState()
  } catch (error) {
    console.error('Error loading albums:', error)
    if (reset) albums.value = []
    hasMore.value = false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function submitSearch() {
  fetchAlbums(true)
}

function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  fetchAlbums(false)
}

onMounted(() => {
  if (restoreState()) return
  fetchAlbums(true)
})

watch(
  () => route.query.q,
  (value) => {
    const next = String(value || '')
    if (next === query.value) return
    query.value = next
    fetchAlbums(true)
  }
)

watch([albums, offset, hasMore], persistState, { deep: true })
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <PageHero
        eyebrow="Albums"
        title="Full releases, not just singles"
        description="Browse Creative Commons albums from Jamendo, open album pages with track lists, and discover entire releases from independent artists."
        :breadcrumbs="[
          { label: 'Home', to: '/' },
          { label: 'Music', to: '/music' },
          { label: 'Albums' },
        ]"
      />

      <div class="mb-8 flex max-w-md items-center gap-3">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            v-model="query"
            type="search"
            placeholder="Search albums..."
            class="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            @keyup.enter="submitSearch"
          />
        </div>
        <button
          type="button"
          class="inline-flex shrink-0 items-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          @click="submitSearch"
        >
          Search
        </button>
      </div>

      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-300">{{ pageTitle }}</h2>
        <p v-if="!loading" class="text-sm text-gray-500">
          {{ albums.length }} album<span v-if="albums.length !== 1">s</span>
        </p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SkeletonCard v-for="n in 6" :key="n" />
      </div>

      <div v-else-if="!albums.length" class="mx-auto max-w-4xl py-10">
        <EmptyState
          :icon="MusicalNoteIcon"
          title="No albums found"
          description="Try a different search or come back later for new independent releases."
          action-text="Back to music"
          action-link="/music"
        />
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
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.75L21 12m0 0l-3.75 3.25M21 12H3" />
              </svg>
            </NuxtLink>
          </div>
        </li>
      </ul>

      <div v-if="hasMore && albums.length" class="mt-8 flex justify-center">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loadingMore"
          @click="loadMore"
        >
          {{ loadingMore ? 'Loading…' : 'Show more' }}
        </button>
      </div>
    </div>
  </div>
</template>
