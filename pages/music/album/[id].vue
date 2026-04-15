<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ArrowLeftIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import { PlayIcon } from '@heroicons/vue/24/solid'
import { musicService } from '~/src/services/musicService.js'
import { usePlayerStore } from '~/src/stores/playerStore.js'
import { useQueueStore } from '~/src/stores/queueStore.js'
import { useMessageStore } from '~/src/stores/messageStore.js'
import MusicTrackRow from '~/src/components/music/MusicTrackRow.vue'
import LicenseBadge from '~/src/components/music/LicenseBadge.vue'
import SkeletonRow from '~/src/components/SkeletonRow.vue'
import EmptyState from '~/src/components/EmptyState.vue'
import { jamendoToPlayerPayload } from '~/src/utils/musicTrackPayload.js'
import { useSeo } from '~/src/seo/composables/useSeo.js'
import { buildBreadcrumbSchema } from '~/src/seo/schemas/breadcrumb.js'

definePageMeta({
  dynamicContentMode: 'client-fetch-static-shell',
})

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const queueStore = useQueueStore()
const messageStore = useMessageStore()

const loading = ref(true)
const album = ref(null)
const tracks = ref([])

const albumId = computed(() => route.params.id)
const primaryLicenseUrl = computed(() => tracks.value.find((track) => track?.license_ccurl)?.license_ccurl || '')
const albumDownloadUrl = computed(() => album.value?.zip || '')

const seoConfig = computed(() => {
  const albumValue = album.value
  const title = albumValue?.name
    ? `${albumValue.name} | Album | Unlistened.me`
    : 'Music album | Unlistened.me'
  const description = albumValue?.name
    ? `Listen to ${albumValue.name} by ${albumValue.artist_name || 'an independent artist'} on Unlistened.me. Free Creative Commons music, no tracking.`
    : 'Discover Creative Commons music albums on Unlistened.me.'
  const canonical = `https://www.unlistened.me/music/album/${albumId.value}`

  return {
    title,
    description,
    canonical,
    ogType: 'music.album',
    ogImage: albumValue?.image || albumValue?.album_image,
    jsonLd: [
      buildBreadcrumbSchema([
        { name: 'Home', url: 'https://www.unlistened.me/' },
        { name: 'Music', url: 'https://www.unlistened.me/music' },
        { name: albumValue?.name || 'Album', url: canonical },
      ]),
    ],
  }
})

useSeo(seoConfig)

function normalizeAlbumResponse(data) {
  const candidate = data?.results?.[0] ?? data?.result ?? data?.data ?? data
  if (!candidate || typeof candidate !== 'object') {
    return { album: null, tracks: [] }
  }

  const albumTracks = candidate.tracks
    ?? candidate.tracklist
    ?? candidate.results
    ?? []

  return {
    album: candidate,
    tracks: Array.isArray(albumTracks) ? albumTracks : [],
  }
}

function dedupeTracks(rows) {
  const seen = new Set()
  return rows.filter((track) => {
    const key = String(track?.id || '')
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function decorateAlbumTracks(rows, albumData) {
  const albumImage = albumData?.image || albumData?.album_image || ''
  const albumName = albumData?.name || ''
  const albumTrackId = albumData?.id || ''

  return rows.map((track) => ({
    ...track,
    album_id: track?.album_id || albumTrackId,
    album_name: track?.album_name || albumName,
    album_image: track?.album_image || track?.image || albumImage,
    image: track?.image || track?.album_image || albumImage,
  }))
}

async function fetchAlbumTracksFallback(albumData) {
  const albumName = String(albumData?.name || '').trim()
  if (!albumName) return []

  try {
    const { data } = await musicService.search(albumName, '', 0)
    const searchResults = Array.isArray(data?.results) ? data.results : []

    const sameAlbum = searchResults.filter((track) => {
      if (albumData?.id && String(track?.album_id) === String(albumData.id)) return true

      const sameName = String(track?.album_name || '').trim().toLowerCase() === albumName.toLowerCase()
      if (!sameName) return false

      if (!albumData?.artist_name) return true
      return String(track?.artist_name || '').trim().toLowerCase() === String(albumData.artist_name).trim().toLowerCase()
    })

    return dedupeTracks(sameAlbum)
  } catch {
    return []
  }
}

async function fetchAlbum() {
  loading.value = true
  try {
    const { data } = await musicService.getAlbum(albumId.value)
    const normalized = normalizeAlbumResponse(data)
    album.value = normalized.album
    tracks.value = decorateAlbumTracks(dedupeTracks(normalized.tracks), album.value)

    if (album.value && tracks.value.length === 0) {
      tracks.value = decorateAlbumTracks(await fetchAlbumTracksFallback(album.value), album.value)
    }

    if (!album.value) {
      messageStore.setMessage('Album not found.')
      router.push('/music')
    }
  } catch (error) {
    if (error?.response?.status === 404) {
      messageStore.setMessage('Album not found.')
    } else {
      messageStore.setMessage('Could not load the album.')
    }
    router.push('/music')
  } finally {
    loading.value = false
  }
}

function playTrack(track, index) {
  if (playerStore.isCurrent(track.id)) {
    playerStore.togglePlay()
    return
  }

  const allTracks = tracks.value.map(jamendoToPlayerPayload)
  const safeIndex = allTracks.findIndex((item) => String(item.id) === String(track.id))
  const targetIndex = safeIndex >= 0 ? safeIndex : index

  queueStore.setQueue(allTracks, targetIndex)
  playerStore.play(allTracks[targetIndex])
}

function isCurrentTrack(track) {
  return playerStore.isPlayingTrack(track.id)
}

function playAlbum() {
  if (!tracks.value.length) return
  playTrack(tracks.value[0], 0)
}

function goBack() {
  const previousPath = window.history.state?.back
  if (typeof previousPath === 'string' && previousPath.startsWith('/')) {
    router.back()
    return
  }

  router.push('/music')
}

const trackCountLabel = computed(() => {
  const count = tracks.value.length
  return `${count} ${count === 1 ? 'track' : 'tracks'}`
})

onMounted(fetchAlbum)
watch(albumId, fetchAlbum)
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <button
        type="button"
        @click="goBack"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-indigo-300"
      >
        <ArrowLeftIcon class="h-3.5 w-3.5" />
        Back to music
      </button>

      <div v-if="loading" class="mt-6 space-y-2">
        <SkeletonRow v-for="n in 6" :key="n" />
      </div>

      <template v-else-if="album">
        <div class="mb-8 mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div class="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 sm:h-40 sm:w-40">
            <img
              v-if="album.image || album.album_image"
              :src="album.image || album.album_image"
              :alt="album.name || 'Album cover'"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div v-else class="flex h-full w-full items-center justify-center">
              <MusicalNoteIcon class="h-10 w-10 text-gray-600" />
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-pink-400">Album</p>
            <h1 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {{ album.name || 'Untitled album' }}
            </h1>
            <p v-if="album.artist_name" class="mt-3 text-base text-gray-300">
              {{ album.artist_name }}
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span>{{ trackCountLabel }}</span>
              <span v-if="album.releasedate" class="text-gray-700">&middot;</span>
              <span v-if="album.releasedate">{{ album.releasedate }}</span>
              <span v-if="primaryLicenseUrl" class="text-gray-700">&middot;</span>
              <LicenseBadge v-if="primaryLicenseUrl" :url="primaryLicenseUrl" size="sm" />
            </div>
            <p v-if="album.zip || album.shareurl" class="mt-2 text-xs text-gray-500">
              Creative Commons music via Jamendo.
            </p>

            <div class="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="playAlbum"
                :disabled="!tracks.length"
                class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
              >
                <PlayIcon class="h-4 w-4" />
                Play album
              </button>
              <a
                v-if="albumDownloadUrl"
                :href="albumDownloadUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:text-indigo-300"
              >
                Download album
              </a>
              <a
                v-if="album.shareurl"
                :href="album.shareurl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:text-indigo-300"
              >
                Open on Jamendo
              </a>
            </div>
          </div>
        </div>

        <div v-if="tracks.length" class="space-y-2">
          <MusicTrackRow
            v-for="(track, idx) in tracks"
            :key="track.id"
            :track="track"
            :index="idx"
            :is-playing="isCurrentTrack(track)"
            :show-cover="true"
            :show-album-link="false"
            compact
            @play="playTrack(track, idx)"
          />
        </div>

        <div v-else class="mx-auto max-w-4xl py-8">
          <EmptyState
            :icon="MusicalNoteIcon"
            title="No tracks available for this album"
            description="This album exists, but Jamendo did not return a playable track list right now."
            action-text="Back to music"
            action-link="/music"
          />
        </div>
      </template>
    </div>
  </div>
</template>
