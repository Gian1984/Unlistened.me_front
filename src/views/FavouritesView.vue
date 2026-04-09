<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSeo } from '@/seo/composables/useSeo.js'
import { favouritesSeo } from '@/seo/registry/index.js'
import {
  ArrowRightIcon,
  TrashIcon,
  Bars3Icon,
  FolderPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import draggable from 'vuedraggable'
import Footer from '../components/Footer.vue'
import EmptyState from '../components/EmptyState.vue'
import SkeletonRow from '../components/SkeletonRow.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore'
import { podcastService } from '@/services/podcastService.js'

useSeo(favouritesSeo)

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()

const favorites = ref([])
const isLoading = ref(true)
const newSectionName = ref('')
const sectionPresets = [
  'Currently listening',
  'Listen next',
  'All time favourites',
  'Archive',
]
const sections = ref([])
const mainAreaItems = ref([])
const show = ref(false)
const message = ref('')
const notificationType = ref('success')

async function fetchFavorites() {
  isLoading.value = true
  try {
    const response = await podcastService.getFavorites()
    favorites.value = response.data
    sections.value = []
    mainAreaItems.value = response.data.filter(item => !item.section)

    const sectionNames = [...new Set(response.data.filter(i => i.section).map(i => i.section))]
    sectionNames.forEach(sectionName => {
      const items = response.data.filter(item => item.section === sectionName)
      sections.value.push({ name: sectionName, items })
    })
  } catch (error) {
    if (error.response && error.response.status === 401) {
      authStore.clearUser()
      messageStore.setMessage('Your session has expired due to lack of activity.')
      router.push({ name: 'Login' })
    } else {
      console.error('Error fetching favorites')
    }
  } finally {
    isLoading.value = false
  }
}

function addSection(name) {
  const candidate = (name ?? newSectionName.value).trim()
  if (!candidate) return
  const exists = sections.value.find(section => section.name === candidate)
  if (!exists) {
    sections.value.push({ name: candidate, items: [] })
  }
  newSectionName.value = ''
}

function removeSection(name) {
  const section = sections.value.find(s => s.name === name)
  if (!section || section.items.length > 0) return
  sections.value = sections.value.filter(s => s.name !== name)
}

function onDragEnd(evt) {
  if (evt.added || evt.moved) {
    const element = evt.added ? evt.added.element : evt.moved.element
    const sectionName = getSectionFromElement(element)
    updateFavoriteSection(element.id, sectionName)
  }
}

function getSectionFromElement(element) {
  for (const section of sections.value) {
    if (section.items.includes(element)) {
      return section.name
    }
  }
  return null
}

async function updateFavoriteSection(favoriteId, section) {
  try {
    const response = await podcastService.updateFavoriteSection(favoriteId, section)
    show.value = true
    message.value = response.data.message
    notificationType.value = 'success'
    setTimeout(() => {
      show.value = false
      message.value = null
    }, 3000)
  } catch (error) {
    console.error('There was an error updating the section:', error)
    notificationType.value = 'error'
    message.value = 'Unable to update the section. Please try again.'
    show.value = true
    setTimeout(() => {
      show.value = false
      message.value = null
    }, 3000)
  }
}

async function deleteFavourite(feedId, sectionName) {
  try {
    const response = await podcastService.deleteFavorite(feedId)

    if (sectionName === 'main') {
      mainAreaItems.value = mainAreaItems.value.filter(item => item.feed_id !== feedId)
    } else {
      const section = sections.value.find(sec => sec.name === sectionName)
      if (section) {
        section.items = section.items.filter(item => item.feed_id !== feedId)
      }
    }

    favorites.value = favorites.value.filter(item => item.feed_id !== feedId)

    show.value = true
    message.value = response.data.message
    notificationType.value = 'success'
    setTimeout(() => {
      show.value = false
      message.value = null
    }, 3000)
  } catch (error) {
    if (error.response && error.response.status === 401) {
      authStore.clearUser()
      messageStore.setMessage('Your session has expired due to lack of activity.')
      router.push({ name: 'Login' })
    } else {
      message.value = 'There was an error while deleting. Please try later.'
      notificationType.value = 'error'
      show.value = true
      setTimeout(() => {
        show.value = false
        message.value = null
      }, 3000)
    }
  }
}

onMounted(() => {
  fetchFavorites()
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
            :class="[
            'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700 border-2',
            notificationType === 'success' ? 'border-green-500' : 'border-red-500'
          ]"
        >
          <div class="p-4">
            <div class="flex items-start">
              <component
                  :is="notificationType === 'success' ? CheckCircleIcon : XCircleIcon"
                  :class="notificationType === 'success' ? 'h-6 w-6 flex-shrink-0 text-green-400' : 'h-6 w-6 flex-shrink-0 text-red-500'"
                  aria-hidden="true"
              />
              <p class="ml-3 text-sm font-medium text-white">{{ message }}</p>
              <button
                  type="button"
                  @click="show = false"
                  class="ml-auto inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
              >
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
      <!-- Header -->
      <div class="mx-auto mb-10">
        <p class="text-sm font-semibold text-pink-400">Your library</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Favourite podcasts
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-gray-400">
          All your saved podcasts live here. Group them into sections, drag them around, and shape your library exactly the way you like.
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="mx-auto max-w-4xl py-8">
        <div class="space-y-4">
          <SkeletonRow v-for="i in 3" :key="i" />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!favorites.length" class="mx-auto max-w-4xl py-8">
        <EmptyState
            :icon="StarIcon"
            title="No favourites yet"
            description="You have not saved any podcasts yet. Browse the library and tap the star to add a show."
            action-text="Start browsing"
            action-link="/"
        />
      </div>

      <!-- Content -->
      <div v-else class="mx-auto">
        <!-- Section creator + how it works -->
        <div class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
          <div class="max-w-2xl">
            <h2 class="text-xl font-semibold text-white">Organize your favourites</h2>
            <p class="mt-2 text-sm leading-7 text-gray-400">
              Need a tidier library? Create a section, then drag any podcast into it. You can have as many sections as you like, and you can always drag things back to the inbox.
            </p>
          </div>

          <!-- Steps -->
          <ol class="mt-5 grid gap-3 sm:grid-cols-3">
            <li class="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-950/50 p-3">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">1</span>
              <div>
                <p class="text-sm font-semibold text-white">Create a section</p>
                <p class="mt-0.5 text-xs leading-5 text-gray-400">Pick a quick name below or type your own.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-950/50 p-3">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">2</span>
              <div>
                <p class="text-sm font-semibold text-white">Drag and drop</p>
                <p class="mt-0.5 text-xs leading-5 text-gray-400">Move podcasts from the inbox into any section.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-950/50 p-3">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">3</span>
              <div>
                <p class="text-sm font-semibold text-white">Reorder anytime</p>
                <p class="mt-0.5 text-xs leading-5 text-gray-400">Drag rows up or down to change the order.</p>
              </div>
            </li>
          </ol>

          <!-- Quick presets -->
          <div class="mt-6">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Quick add</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                  v-for="preset in sectionPresets"
                  :key="preset"
                  type="button"
                  @click="addSection(preset)"
                  :disabled="sections.some(s => s.name === preset)"
                  class="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-700 disabled:hover:bg-gray-800 disabled:hover:text-gray-300"
              >
                <FolderPlusIcon class="h-3.5 w-3.5" />
                {{ preset }}
              </button>
            </div>
          </div>

          <!-- Custom name -->
          <div class="mt-5">
            <label for="favorite-section" class="text-xs font-semibold uppercase tracking-wide text-gray-500">Or pick your own name</label>
            <div class="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                  v-model="newSectionName"
                  id="favorite-section"
                  type="text"
                  placeholder="e.g. Cooking shows, Sleep stories, Indie picks..."
                  @keyup.enter="addSection()"
                  class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <button
                  type="button"
                  @click="addSection()"
                  :disabled="!newSectionName.trim()"
                  class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
              >
                <FolderPlusIcon class="h-4 w-4" />
                Add section
              </button>
            </div>
          </div>
        </div>

        <!-- Inbox -->
        <section class="mb-10">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-white">Inbox</h2>
              <p class="text-sm text-gray-500">Everything you save lands here. Drag any podcast into a section below.</p>
            </div>
            <p class="text-sm text-gray-500">{{ mainAreaItems.length }} items</p>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-gray-900/40 p-3 sm:p-4">
            <draggable
                v-model="mainAreaItems"
                group="favorites"
                @change="onDragEnd"
                itemKey="id"
                class="space-y-2 min-h-[80px]"
            >
              <template #item="{ element }">
                <div class="group flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3 transition-colors hover:border-gray-600">
                  <div class="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-full bg-gray-700 text-gray-300 active:cursor-grabbing" title="Drag to a section">
                    <Bars3Icon class="h-4 w-4" />
                  </div>

                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-400">
                    <StarIcon class="h-4 w-4" />
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="truncate text-sm font-medium text-white">
                      {{ element.title }}
                    </p>
                    <p class="mt-0.5 text-xs text-gray-400">
                      Saved podcast
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-1">
                    <router-link
                        :to="'/feed/' + element.feed_id"
                        class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-indigo-400"
                        title="Open podcast"
                    >
                      <ArrowRightIcon class="h-4 w-4" />
                    </router-link>

                    <button
                        @click="deleteFavourite(element.feed_id, 'main')"
                        class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-red-400"
                        title="Delete favourite"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </template>
            </draggable>

            <div
                v-if="!mainAreaItems.length"
                class="flex items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-800/40 px-4 py-8 text-center text-sm text-gray-500"
            >
              Your inbox is empty. Drag a podcast here to move it back from a section.
            </div>
          </div>
        </section>

        <!-- Custom sections -->
        <section
            v-for="section in sections"
            :key="section.name"
            class="mb-8"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <h2 class="truncate text-lg font-semibold text-white">{{ section.name }}</h2>
              <p class="text-sm text-gray-500">Drag podcasts in or out to keep them grouped.</p>
            </div>
            <div class="flex items-center gap-3">
              <p class="text-sm text-gray-500">{{ section.items.length }} items</p>
              <button
                  v-if="!section.items.length"
                  type="button"
                  @click="removeSection(section.name)"
                  class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800 hover:text-red-400"
                  title="Remove this empty section"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-gray-900/40 p-3 sm:p-4">
            <draggable
                v-model="section.items"
                group="favorites"
                @change="onDragEnd"
                itemKey="id"
                class="space-y-2 min-h-[80px]"
            >
              <template #item="{ element }">
                <div class="group flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3 transition-colors hover:border-gray-600">
                  <div class="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-full bg-gray-700 text-gray-300 active:cursor-grabbing" title="Drag to another section">
                    <Bars3Icon class="h-4 w-4" />
                  </div>

                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-400">
                    <StarIcon class="h-4 w-4" />
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="truncate text-sm font-medium text-white">
                      {{ element.title }}
                    </p>
                    <p class="mt-0.5 text-xs text-gray-400">
                      Saved podcast
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-1">
                    <router-link
                        :to="'/feed/' + element.feed_id"
                        class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-indigo-400"
                        title="Open podcast"
                    >
                      <ArrowRightIcon class="h-4 w-4" />
                    </router-link>

                    <button
                        @click="deleteFavourite(element.feed_id, section.name)"
                        class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-red-400"
                        title="Delete favourite"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </template>
            </draggable>

            <div
                v-if="!section.items.length"
                class="flex items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-800/40 px-4 py-8 text-center text-sm text-gray-500"
            >
              This section is empty. Drag a podcast from your inbox into here.
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <Footer />
</template>