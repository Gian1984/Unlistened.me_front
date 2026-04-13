<script setup>
import { computed } from 'vue'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { MusicalNoteIcon } from '@heroicons/vue/24/outline'
import LicenseBadge from '@/components/music/LicenseBadge.vue'
import FavoriteMusicButton from '@/components/music/FavoriteMusicButton.vue'
import AddToPlaylistMenu from '@/components/music/AddToPlaylistMenu.vue'
import { formatDuration } from '@/utils/formatTime.js'

const props = defineProps({
  track: { type: Object, required: true },
  index: { type: Number, default: null },
  isPlaying: { type: Boolean, default: false },
  showIndex: { type: Boolean, default: true },
  showDuration: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  showCover: { type: Boolean, default: true },
  showAlbumLink: { type: Boolean, default: true },
  compact: { type: Boolean, default: false }
})

const emit = defineEmits(['play'])

const isCurrent = computed(() => props.isPlaying)
const coverImage = computed(() => props.track?.album_image || props.track?.image || '')

function handlePlay() {
  emit('play', props.track)
}
</script>

<template>
  <li
    class="group flex items-center rounded-lg border border-gray-800 bg-gray-900/40 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60"
    :class="compact ? 'gap-2 p-2' : 'gap-2 p-2 sm:gap-3 sm:p-3'"
  >
    <!-- Index -->
    <span
      v-if="showIndex"
      class="hidden w-5 shrink-0 text-center text-xs text-gray-500 sm:block tabular-nums"
    >
      {{ index + 1 }}
    </span>

    <!-- Cover with hover play overlay -->
    <div
      class="relative shrink-0 rounded-md overflow-hidden bg-gray-700 cursor-pointer"
      :class="compact ? 'h-10 w-10' : 'h-10 w-10 sm:h-12 sm:w-12'"
      @click="handlePlay"
    >
      <template v-if="showCover">
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="track.album_name || track.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <MusicalNoteIcon class="h-5 w-5 text-gray-500" />
      </div>
      </template>
      <div v-else class="w-full h-full flex items-center justify-center">
        <PauseIcon v-if="isCurrent" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        <PlayIcon v-else class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>
      <div
        v-if="showCover"
        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity flex items-center justify-center"
      >
        <PauseIcon v-if="isCurrent" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        <PlayIcon v-else class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>
    </div>

    <!-- Title + artist + license badge -->
    <div class="flex-1 min-w-0">
      <p
        class="text-sm font-semibold truncate transition-colors cursor-pointer"
        :class="isCurrent ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'"
        @click="handlePlay"
      >
        {{ track.name }}
      </p>
      <div class="flex flex-wrap items-center gap-1 text-xs text-gray-400">
        <span class="truncate">{{ track.artist_name }}</span>
        <LicenseBadge :url="track.license_ccurl" size="xs" />
      </div>
      <router-link
        v-if="showAlbumLink && track.album_id && track.album_name"
        :to="{ name: 'MusicAlbum', params: { id: track.album_id } }"
        class="mt-0.5 inline-flex max-w-full text-xs text-gray-500 transition-colors hover:text-indigo-300"
        @click.stop
      >
        <span class="truncate">{{ track.album_name }}</span>
      </router-link>
    </div>

    <!-- Duration -->
    <span
      v-if="showDuration"
      class="hidden sm:block shrink-0 text-xs text-gray-500 tabular-nums"
    >
      {{ formatDuration(track.duration) }}
    </span>

    <!-- Library actions: favorite + add to playlist -->
    <div v-if="showActions" class="flex shrink-0 items-center gap-0.5">
      <FavoriteMusicButton :track="track" size="sm" />
      <AddToPlaylistMenu :track="track" size="sm" />
    </div>
  </li>
</template>
