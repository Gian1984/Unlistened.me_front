<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore.js'
import { MusicalNoteIcon } from '@heroicons/vue/24/outline'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import FavoriteMusicButton from '@/components/music/FavoriteMusicButton.vue'
import AddToPlaylistMenu from '@/components/music/AddToPlaylistMenu.vue'
import { useSeo } from '@/seo/composables/useSeo.js'

const router = useRouter()
const playerStore = usePlayerStore()

const ep = computed(() => playerStore.currentEpisode)
const isMusic = computed(() => playerStore.isMusic)

// Redirect to home if nothing is playing
watch(
  () => playerStore.isVisible,
  (visible) => { if (!visible) router.replace('/') },
  { immediate: true },
)

// Build a track object in the shape FavoriteMusicButton / AddToPlaylistMenu expect
const musicTrack = computed(() => {
  if (!ep.value || ep.value.contentType !== 'music') return null
  return {
    id: ep.value.id,
    name: ep.value.title,
    artist_name: ep.value.feedTitle,
    artist_id: ep.value.artistId,
    album_name: ep.value.albumName,
    album_image: ep.value.image,
    audio: ep.value.enclosureUrl,
    duration: ep.value.duration,
    license_ccurl: ep.value.licenseUrl,
    shareurl: ep.value.shareUrl,
  }
})

const seoConfig = computed(() => {
  if (!ep.value) return { title: 'Now Playing | Unlistened.me', robots: 'noindex' }
  return {
    title: `${ep.value.title} | Unlistened.me`,
    description: isMusic.value
      ? `Listening to ${ep.value.title} by ${ep.value.feedTitle} on Unlistened.me`
      : `Listening to ${ep.value.title} from ${ep.value.feedTitle || 'Unlistened.me'}`,
    ogImage: ep.value.image,
    robots: 'noindex',
  }
})

useSeo(seoConfig)

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return null
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="bg-gray-900 min-h-screen pb-28">
    <div v-if="ep" class="mx-auto max-w-2xl px-4 pt-8 sm:pt-14">

      <!-- Cover art -->
      <div class="flex justify-center">
        <div class="w-64 sm:w-80 overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
          <img
            v-if="ep.image"
            :src="ep.image"
            :alt="ep.title"
            class="aspect-square w-full object-cover"
            @error="($event.target).style.display = 'none'"
          />
          <div v-else class="aspect-square w-full flex items-center justify-center">
            <MusicalNoteIcon class="h-20 w-20 text-gray-600" />
          </div>
        </div>
      </div>

      <!-- Track info -->
      <div class="mt-8 text-center">
        <h1 class="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {{ ep.title }}
        </h1>

        <p
          v-if="ep.feedTitle"
          class="mt-2 text-base text-gray-400"
        >
          {{ ep.feedTitle }}
        </p>

        <!-- Music: album + duration + license -->
        <div
          v-if="isMusic"
          class="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500"
        >
          <span v-if="ep.albumName">{{ ep.albumName }}</span>
          <span v-if="ep.albumName && ep.duration" class="text-gray-700">&middot;</span>
          <span v-if="ep.duration">{{ formatDuration(ep.duration) }}</span>
          <LicenseBadge v-if="ep.licenseUrl" :url="ep.licenseUrl" size="sm" />
        </div>

        <!-- Podcast: link to feed -->
        <div
          v-if="!isMusic && ep.feedId"
          class="mt-3"
        >
          <router-link
            :to="`/feed/${ep.feedId}`"
            class="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all episodes
          </router-link>
        </div>
      </div>

      <!-- Music actions: favorite + add to playlist + Jamendo link -->
      <div
        v-if="isMusic && musicTrack"
        class="mt-8 flex items-center justify-center gap-3"
      >
        <FavoriteMusicButton :track="musicTrack" size="md" />
        <AddToPlaylistMenu :track="musicTrack" size="md" />
        <a
          v-if="ep.shareUrl"
          :href="ep.shareUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500 hover:text-indigo-400"
        >
          Open on Jamendo
        </a>
      </div>

      <!-- Podcast actions: episode page + bookmark -->
      <div
        v-if="!isMusic"
        class="mt-8 flex items-center justify-center gap-3"
      >
        <router-link
          v-if="ep.id"
          :to="`/episode/${ep.id}`"
          class="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500 hover:text-indigo-400"
        >
          Episode details
        </router-link>
        <router-link
          v-if="ep.feedId"
          :to="`/feed/${ep.feedId}`"
          class="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500 hover:text-indigo-400"
        >
          Open podcast
        </router-link>
      </div>

    </div>
  </div>
</template>
