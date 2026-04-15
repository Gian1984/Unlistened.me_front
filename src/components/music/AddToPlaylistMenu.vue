<script setup>
import { ref, computed, onMounted } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { PlusIcon, ListBulletIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { useMusicLibraryStore } from '@/stores/musicLibraryStore.js'

const props = defineProps({
  track: { type: Object, required: true },
  size: { type: String, default: 'sm' }, // 'xs' | 'sm' | 'md'
})

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()
const library = useMusicLibraryStore()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return { btn: 'h-7 w-7', icon: 'h-3.5 w-3.5' }
    case 'md': return { btn: 'h-9 w-9', icon: 'h-5 w-5' }
    default:   return { btn: 'h-8 w-8', icon: 'h-4 w-4' }
  }
})

const showCreate = ref(false)
const newName = ref('')
const busy = ref(false)

function ensureLoaded() {
  if (authStore.isAuthenticated && !library.playlistsLoaded) {
    library.loadPlaylists()
  }
}
onMounted(ensureLoaded)

async function onAddTo(playlist, close) {
  if (busy.value) return
  busy.value = true
  try {
    await library.addTrackToPlaylist(playlist.id, props.track)
    messageStore.setMessage(`Added to "${playlist.name}"`)
    close?.()
  } catch (err) {
    if (err?.response?.status !== 401) {
      messageStore.setMessage('Could not add the track. Please try again.')
    }
  } finally {
    busy.value = false
  }
}

async function onCreateAndAdd(close) {
  const name = newName.value.trim()
  if (!name || busy.value) return
  busy.value = true
  try {
    const playlist = await library.createPlaylist(name)
    await library.addTrackToPlaylist(playlist.id, props.track)
    messageStore.setMessage(`Created "${name}" and added the track`)
    newName.value = ''
    showCreate.value = false
    close?.()
  } catch (err) {
    if (err?.response?.status !== 401) {
      messageStore.setMessage('Could not create the playlist. Please try again.')
    }
  } finally {
    busy.value = false
  }
}

function onTriggerClick(e) {
  e?.stopPropagation?.()
  if (!authStore.isAuthenticated) {
    messageStore.setMessage('Sign in to create playlists.')
    router.push('/login')
    return
  }
  ensureLoaded()
}
</script>

<template>
  <Menu as="div" class="relative shrink-0" @click.stop>
    <MenuButton
      :title="'Add to playlist'"
      :aria-label="'Add to playlist'"
      @click="onTriggerClick"
      :class="[
        'inline-flex items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-indigo-300',
        sizeClasses.btn
      ]"
    >
      <PlusIcon :class="sizeClasses.icon" />
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-xl focus:outline-none"
      >
        <div class="border-b border-gray-800 px-4 py-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Add to playlist
          </p>
          <p class="mt-1 truncate text-xs text-gray-400">
            {{ props.track?.name ?? props.track?.title }}
          </p>
        </div>

        <!-- Existing playlists -->
        <div class="max-h-56 overflow-y-auto py-1">
          <p
            v-if="library.playlistsLoading"
            class="px-4 py-3 text-center text-xs text-gray-500"
          >
            Loading...
          </p>
          <p
            v-else-if="!library.playlists.length"
            class="px-4 py-3 text-center text-xs text-gray-500"
          >
            No playlists yet. Create one below.
          </p>
          <MenuItem
            v-for="p in library.playlists"
            :key="p.id"
            v-slot="{ active, close }"
          >
            <button
              type="button"
              :disabled="busy"
              @click="onAddTo(p, close)"
              :class="[
                active ? 'bg-gray-800 text-white' : 'text-gray-300',
                'flex w-full items-center gap-3 px-4 py-2 text-left text-sm disabled:opacity-50'
              ]"
            >
              <ListBulletIcon class="h-4 w-4 shrink-0 text-gray-500" />
              <span class="flex-1 truncate">{{ p.name }}</span>
              <span v-if="p.tracks_count != null" class="shrink-0 text-xs text-gray-500">
                {{ p.tracks_count }}
              </span>
            </button>
          </MenuItem>
        </div>

        <!-- Inline create -->
        <div class="border-t border-gray-800 bg-gray-950/50 p-3">
          <button
            v-if="!showCreate"
            type="button"
            @click="showCreate = true"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-indigo-400 transition-colors hover:bg-gray-800 hover:text-indigo-300"
          >
            <PlusIcon class="h-3.5 w-3.5" />
            New playlist
          </button>
          <MenuItem v-else v-slot="{ close }">
            <div class="flex flex-col gap-2">
              <input
                v-model="newName"
                type="text"
                placeholder="Playlist name"
                @keyup.enter="onCreateAndAdd(close)"
                @click.stop
                class="rounded-md border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div class="flex justify-end gap-1.5">
                <button
                  type="button"
                  @click="showCreate = false; newName = ''"
                  class="rounded-md px-2 py-1 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  :disabled="!newName.trim() || busy"
                  @click="onCreateAndAdd(close)"
                  class="rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
                >
                  Create
                </button>
              </div>
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
