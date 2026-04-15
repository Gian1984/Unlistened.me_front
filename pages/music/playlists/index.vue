<script setup>
import { onMounted, ref } from 'vue'
import { ArrowRightIcon, ListBulletIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import EmptyState from '~/src/components/EmptyState.vue'
import { useMusicLibraryStore } from '~/src/stores/musicLibraryStore.js'
import { useMessageStore } from '~/src/stores/messageStore.js'
import { useSeo } from '~/src/seo/composables/useSeo.js'
import { musicPlaylistsSeo } from '~/src/seo/registry/index.js'

definePageMeta({
  middleware: ['auth'],
})

useSeo(musicPlaylistsSeo)

const router = useRouter()
const library = useMusicLibraryStore()
const messageStore = useMessageStore()

const newName = ref('')
const creating = ref(false)

onMounted(() => library.loadPlaylists())

async function onCreate() {
  const name = newName.value.trim()
  if (!name || creating.value) return
  creating.value = true
  try {
    const playlist = await library.createPlaylist(name)
    newName.value = ''
    messageStore.setMessage(`Created "${playlist.name}"`)
    router.push(`/music/playlists/${playlist.id}`)
  } catch {
    messageStore.setMessage('Could not create the playlist. Please try again.')
  } finally {
    creating.value = false
  }
}

async function onDelete(playlist) {
  if (!confirm(`Delete "${playlist.name}"? This cannot be undone.`)) return
  try {
    await library.deletePlaylist(playlist.id)
    messageStore.setMessage('Playlist deleted')
  } catch {
    messageStore.setMessage('Could not delete. Please try again.')
  }
}
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mb-8">
        <p class="text-sm font-semibold text-pink-400">Your library</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Music playlists
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-gray-400">
          Build your own collections of Creative Commons music. Group tracks by mood, project, season — whatever you like.
        </p>
      </div>

      <div class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
        <h2 class="text-lg font-semibold text-white">Create a new playlist</h2>
        <p class="mt-1 text-sm text-gray-400">Give it a name now. You can add tracks from any music page.</p>
        <div class="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            v-model="newName"
            type="text"
            placeholder="e.g. Focus, Sunday morning, Workout"
            class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            @keyup.enter="onCreate"
          />
          <button
            type="button"
            :disabled="!newName.trim() || creating"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
            @click="onCreate"
          >
            <PlusIcon class="h-4 w-4" />
            Create playlist
          </button>
        </div>
      </div>

      <div v-if="library.playlistsLoading && !library.playlists.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="h-24 animate-shimmer rounded-xl border border-gray-800 bg-gray-900/40" />
      </div>

      <div v-else-if="!library.playlists.length" class="mx-auto max-w-4xl py-8">
        <EmptyState
          :icon="ListBulletIcon"
          title="No playlists yet"
          description="Create your first playlist above, then add tracks from the music page."
          action-text="Discover music"
          action-link="/music"
        />
      </div>

      <ul v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="p in library.playlists"
          :key="p.id"
          class="group flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/40 p-4 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
            <ListBulletIcon class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
              {{ p.name }}
            </p>
            <p v-if="p.description" class="mt-0.5 truncate text-xs text-gray-400">{{ p.description }}</p>
            <p v-if="p.tracks_count != null" class="mt-0.5 text-xs text-gray-500">
              {{ p.tracks_count }} {{ p.tracks_count === 1 ? 'track' : 'tracks' }}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-0.5">
            <NuxtLink
              :to="`/music/playlists/${p.id}`"
              class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-indigo-300"
              :title="'Open playlist'"
            >
              <ArrowRightIcon class="h-4 w-4" />
            </NuxtLink>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-red-400"
              :title="'Delete playlist'"
              @click="onDelete(p)"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
