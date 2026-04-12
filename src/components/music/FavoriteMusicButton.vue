<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { HeartIcon as HeartOutline } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { useMusicLibraryStore } from '@/stores/musicLibraryStore.js'

const props = defineProps({
  /**
   * Either a raw Jamendo track (with .id, .name, .artist_name, ...)
   * or a backend favorite row (with .jamendo_track_id, .title, ...).
   * The store handles both shapes.
   */
  track: { type: Object, required: true },
  size: { type: String, default: 'sm' }, // 'xs' | 'sm' | 'md'
})

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()
const library = useMusicLibraryStore()

const trackId = computed(() =>
  String(props.track?.id ?? props.track?.jamendo_track_id ?? '')
)
const isFav = computed(() => library.isFavorite(trackId.value))
const busy = ref(false)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return { btn: 'h-7 w-7', icon: 'h-3.5 w-3.5' }
    case 'md': return { btn: 'h-9 w-9', icon: 'h-5 w-5' }
    default:   return { btn: 'h-8 w-8', icon: 'h-4 w-4' }
  }
})

async function onClick(e) {
  e?.stopPropagation?.()
  if (!authStore.isAuthenticated) {
    messageStore.setMessage('Sign in to save tracks to your favorites.')
    router.push({ name: 'Login' })
    return
  }
  if (busy.value || !trackId.value) return
  busy.value = true
  try {
    const wasAdded = await library.toggleFavorite(props.track)
    messageStore.setMessage(wasAdded ? 'Added to favorites' : 'Removed from favorites')
  } catch (err) {
    if (err?.response?.status !== 401) {
      messageStore.setMessage('Could not update favorites. Please try again.')
    }
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <button
    type="button"
    @click="onClick"
    :disabled="busy"
    :title="isFav ? 'Remove from favorites' : 'Add to favorites'"
    :aria-label="isFav ? 'Remove from favorites' : 'Add to favorites'"
    :class="[
      'inline-flex shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50',
      sizeClasses.btn,
      isFav
        ? 'text-pink-400 hover:bg-pink-500/10 hover:text-pink-300'
        : 'text-gray-500 hover:bg-gray-700 hover:text-pink-400',
    ]"
  >
    <HeartSolid v-if="isFav" :class="sizeClasses.icon" />
    <HeartOutline v-else :class="sizeClasses.icon" />
  </button>
</template>
