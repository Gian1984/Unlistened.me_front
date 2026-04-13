<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MagnifyingGlassIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import Footer from '@/components/Footer.vue'
import PageHero from '@/components/PageHero.vue'
import EmptyState from '@/components/EmptyState.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { musicService } from '@/services/musicService.js'
import { useSeo } from '@/seo/composables/useSeo.js'
import { musicAlbumsSeo } from '@/seo/registry/index.js'

useSeo(musicAlbumsSeo)

const route = useRoute()

const albums = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const query = ref(String(route.query.q || ''))
const offset = ref(0)
const hasMore = ref(true)

const PAGE_SIZE = 20

const pageTitle = computed(() => (
  query.value.trim()
    ? `Album results for "${query.value.trim()}"`
    : 'Browse full albums'
))

function normalizeAlbums(payload) {
  return Array.isArray(payload?.results) ? payload.results : []
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

      <div
        v-else-if="!albums.length"
        class="mx-auto max-w-4xl py-10"
      >
        <EmptyState
          :icon="MusicalNoteIcon"
          title="No albums found"
          description="Try a different search or come back later for new independent releases."
          action-text="Back to music"
          action-link="/music"
        />
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <router-link
          v-for="album in albums"
          :key="album.id"
          :to="{ name: 'MusicAlbum', params: { id: album.id } }"
          class="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60"
        >
          <div class="relative aspect-square overflow-hidden rounded-xl bg-gray-800">
            <img
              v-if="album.image"
              :src="album.image"
              :alt="album.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div v-else class="flex h-full w-full items-center justify-center">
              <MusicalNoteIcon class="h-12 w-12 text-gray-600" />
            </div>
          </div>

          <div class="mt-4">
            <h3 class="line-clamp-2 text-base font-semibold text-white transition-colors group-hover:text-indigo-300">
              {{ album.name }}
            </h3>
            <p class="mt-1 truncate text-sm text-gray-400">
              {{ album.artist_name }}
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span v-if="album.releasedate">{{ album.releasedate }}</span>
              <span v-if="album.releasedate && album.zip_allowed" class="text-gray-700">&middot;</span>
              <span v-if="album.zip_allowed">Downloadable</span>
            </div>
          </div>
        </router-link>
      </div>

      <div v-if="hasMore && albums.length" class="mt-8 flex justify-center">
        <button
          type="button"
          class="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
          :disabled="loadingMore"
          @click="loadMore"
        >
          {{ loadingMore ? 'Loading…' : 'Load more albums' }}
        </button>
      </div>
    </div>
  </div>
  <Footer />
</template>
