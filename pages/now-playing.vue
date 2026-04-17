<script setup>
import { computed, ref, watch } from 'vue'
import { usePlayerStore } from '~/src/stores/playerStore.js'
import { podcastService } from '~/src/services/podcastService.js'
import { stripHtmlTags } from '~/src/utils/text.js'
import MusicalNoteIcon from '@heroicons/vue/24/outline/esm/MusicalNoteIcon.js'
import LicenseBadge from '~/src/components/music/LicenseBadge.vue'
import FavoriteMusicButton from '~/src/components/music/FavoriteMusicButton.vue'
import AddToPlaylistMenu from '~/src/components/music/AddToPlaylistMenu.vue'
import { usePageSeo } from '~/composables/usePageSeo'

const router = useRouter()
const playerStore = usePlayerStore()

const ep = computed(() => playerStore.currentEpisode)
const isMusic = computed(() => playerStore.isMusic)
const episodeDetails = ref(null)
const detailsLoading = ref(false)

watch(
  () => playerStore.isVisible,
  (visible) => { if (!visible) router.replace('/') },
  { immediate: true },
)

watch(
  () => (!isMusic.value && ep.value?.id) ? ep.value.id : null,
  async (id) => {
    episodeDetails.value = null
    if (!id) return
    detailsLoading.value = true
    try {
      const response = await podcastService.getEpisode(id)
      episodeDetails.value = response.data.episode || null
    } catch {
      episodeDetails.value = null
    } finally {
      detailsLoading.value = false
    }
  },
  { immediate: true },
)

const podcastDescription = computed(() => {
  const raw = episodeDetails.value?.description
  return raw ? stripHtmlTags(raw) : ''
})

const musicTrack = computed(() => {
  if (!ep.value || ep.value.contentType !== 'music') return null
  return {
    id: ep.value.id,
    name: ep.value.title,
    artist_name: ep.value.feedTitle,
    artist_id: ep.value.artistId,
    album_id: ep.value.albumId,
    album_name: ep.value.albumName,
    album_image: ep.value.image,
    audio: ep.value.enclosureUrl,
    duration: ep.value.duration,
    license_ccurl: ep.value.licenseUrl,
    shareurl: ep.value.shareUrl,
  }
})

usePageSeo('nowPlaying')

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return null
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="bg-gray-950 min-h-screen pb-28">
    <div v-if="ep" class="mx-auto max-w-2xl px-4 pt-8 sm:pt-14">

      <div class="flex justify-center">
        <div class="w-64 sm:w-80 overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
          <img
            v-if="ep.image"
            :src="ep.image"
            :alt="ep.title"
            loading="lazy"
            class="aspect-square w-full object-cover"
            @error="($event.target).style.display = 'none'"
          />
          <div v-else class="aspect-square w-full flex items-center justify-center">
            <MusicalNoteIcon class="h-20 w-20 text-gray-600" />
          </div>
        </div>
      </div>

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

        <div
          v-if="isMusic"
          class="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500"
        >
          <NuxtLink
            v-if="ep.albumId && ep.albumName"
            :to="`/music/album/${ep.albumId}`"
            class="transition-colors hover:text-indigo-300"
          >
            {{ ep.albumName }}
          </NuxtLink>
          <span v-else-if="ep.albumName">{{ ep.albumName }}</span>
          <span v-if="ep.albumName && ep.duration" class="text-gray-700">&middot;</span>
          <span v-if="ep.duration">{{ formatDuration(ep.duration) }}</span>
          <LicenseBadge v-if="ep.licenseUrl" :url="ep.licenseUrl" size="sm" />
        </div>

        <div
          v-if="!isMusic"
          class="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500"
        >
          <span class="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
            Episode
          </span>
          <time
            v-if="episodeDetails?.datePublishedPretty"
            :datetime="episodeDetails.newestItemPubdate"
          >
            {{ episodeDetails.datePublishedPretty }}
          </time>
        </div>
      </div>

      <div
        v-if="!isMusic"
        class="mx-auto mt-8 max-w-2xl"
      >
        <div v-if="detailsLoading && !podcastDescription" class="space-y-3">
          <div class="h-4 w-full rounded animate-shimmer"></div>
          <div class="h-4 w-full rounded animate-shimmer"></div>
          <div class="h-4 w-4/5 rounded animate-shimmer"></div>
        </div>
        <p
          v-else-if="podcastDescription"
          class="whitespace-pre-line text-base leading-8 text-gray-400"
        >
          {{ podcastDescription }}
        </p>
      </div>

      <div
        v-if="isMusic && musicTrack"
        class="mt-8 flex items-center justify-center gap-3"
      >
        <FavoriteMusicButton :track="musicTrack" size="md" />
        <AddToPlaylistMenu :track="musicTrack" size="md" />
      </div>

      <div
        v-if="!isMusic && ep.feedId"
        class="mt-8 flex items-center justify-center gap-3"
      >
        <NuxtLink
          :to="`/feed/${ep.feedId}`"
          class="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500 hover:text-indigo-400"
        >
          View all episodes
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
