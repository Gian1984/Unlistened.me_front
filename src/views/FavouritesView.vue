<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore'
import { podcastService } from '@/services/podcastService.js'

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()

const favorites = ref([])
const newSection = ref('')
const availableSections = ref([
  'Current Favorites',
  'To Listen Next',
  'All-Time Favorites',
  'Archived Episodes'
])
const sections = ref([])
const mainAreaItems = ref([])
const show = ref(false)
const message = ref('')
const notificationType = ref('success')

async function fetchFavorites() {
  try {
    const response = await podcastService.getFavorites()
    favorites.value = response.data
    sections.value = []
    mainAreaItems.value = response.data.filter(item => !item.section)

    availableSections.value.forEach(sectionName => {
      const items = response.data.filter(item => item.section === sectionName)
      if (items.length > 0) {
        sections.value.push({ name: sectionName, items })
      }
    })
  } catch (error) {
    if (error.response && error.response.status === 401) {
      authStore.clearUser()
      messageStore.setMessage('Your session has expired due to lack of activity.')
      router.push({ name: 'Login' })
    } else {
      console.error('Error fetching favorites')
    }
  }
}

function addSection() {
  if (!newSection.value) return

  const exists = sections.value.find(section => section.name === newSection.value)
  if (!exists) {
    sections.value.push({ name: newSection.value, items: [] })
  }
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
      <div class="mx-auto max-w-6xl mb-10">
        <p class="text-sm font-semibold text-pink-400">Your library</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Favourite podcasts
        </h1>
        <p class="mt-4 max-w-3xl text-lg leading-8 text-gray-400">
          Keep your saved podcasts organized in one place. Create sections, drag podcasts where you want them, and keep your library easy to browse.
        </p>
      </div>

      <!-- Empty state -->
      <div v-if="!favorites.length" class="mx-auto max-w-4xl py-8">
        <EmptyState
            :icon="StarIcon"
            title="No favourites yet"
            description="You have not saved any podcasts yet. Explore the library and add the shows you want to keep close."
            action-text="Start exploring"
            action-link="/"
        />
      </div>

      <!-- Content -->
      <div v-else class="mx-auto max-w-6xl">
        <!-- Section creator -->
        <div class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <h2 class="text-xl font-semibold text-white">Organize your favourites</h2>
              <p class="mt-2 text-sm leading-7 text-gray-400">
                Add a section and drag podcasts into it. Use this space to separate what you listen to most, what you want to hear next, and what you want to archive.
              </p>
            </div>

            <div class="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div class="min-w-[240px]">
                <label for="favorite-section" class="sr-only">Select section</label>
                <select
                    v-model="newSection"
                    id="favorite-section"
                    class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option disabled value="">Choose a section</option>
                  <option
                      v-for="section in availableSections"
                      :key="section"
                      :value="section"
                  >
                    {{ section }}
                  </option>
                </select>
              </div>

              <button
                  @click="addSection"
                  class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                <FolderPlusIcon class="h-4 w-4" />
                Add section
              </button>
            </div>
          </div>
        </div>

        <!-- Main area -->
        <section class="mb-10">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-white">Main area</h2>
              <p class="text-sm text-gray-500">Unsorted saved podcasts</p>
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
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-700 text-gray-300">
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
                class="flex items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-800/40 px-4 py-8 text-sm text-gray-500"
            >
              Drag saved podcasts here
            </div>
          </div>
        </section>

        <!-- Custom sections -->
        <section
            v-for="section in sections"
            :key="section.name"
            class="mb-8"
        >
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-white">{{ section.name }}</h2>
              <p class="text-sm text-gray-500">Drag podcasts here to keep them grouped</p>
            </div>
            <p class="text-sm text-gray-500">{{ section.items.length }} items</p>
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
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-700 text-gray-300">
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
                class="flex items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-800/40 px-4 py-8 text-sm text-gray-500"
            >
              Drop podcasts here
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <Footer />
</template>