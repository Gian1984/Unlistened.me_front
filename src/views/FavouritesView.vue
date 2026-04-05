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

function stripHtmlTags(str) {
  if (!str) return ''
  return str.replace(/<[^>]*>/g, '')
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
          Keep the podcasts you care about in one place. Create sections, drag cards between groups, and build your own listening space with a cleaner overview.
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
        <!-- Section manager -->
        <div class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <h2 class="text-xl font-semibold text-white">Organize your favourites</h2>
              <p class="mt-2 text-sm leading-7 text-gray-400">
                Add a section and move your saved podcasts where they belong. Use sections to separate what you listen to now, what you want to revisit, and what you want to keep archived.
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
              <p class="text-sm text-gray-500">Saved podcasts not yet organized</p>
            </div>
            <p class="text-sm text-gray-500">{{ mainAreaItems.length }} items</p>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-gray-900/40 p-4">
            <draggable
                v-model="mainAreaItems"
                group="favorites"
                @change="onDragEnd"
                itemKey="id"
                class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 min-h-[120px]"
            >
              <template #item="{ element }">
                <div class="group rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all overflow-hidden">
                  <div class="flex items-start gap-3 p-4">
                    <!-- Drag handle -->
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-700 text-gray-400 cursor-grab active:cursor-grabbing">
                      <Bars3Icon class="h-4 w-4" />
                    </div>

                    <!-- Cover -->
                    <div class="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-700">
                      <img
                          :src="element.image || '/images/image_not_available_500.webp'"
                          :alt="element.title"
                          class="w-full h-full object-cover"
                          loading="lazy"
                      />
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {{ element.title }}
                      </h3>
                      <p class="text-xs text-gray-400 truncate mt-0.5">
                        {{ element.author || 'Podcast' }}
                      </p>
                      <p class="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                        {{ stripHtmlTags(element.description) }}
                      </p>
                    </div>
                  </div>

                  <!-- Bottom actions -->
                  <div class="flex items-center gap-2 px-4 pb-3">
                    <div class="flex items-center gap-1.5 text-xs text-pink-400">
                      <StarIcon class="h-4 w-4" />
                      <span>Saved</span>
                    </div>

                    <button
                        @click.prevent="deleteFavourite(element.feed_id, 'main')"
                        class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove from favourites"
                    >
                      <TrashIcon class="h-4 w-4" />
                      <span class="hidden sm:inline">Remove</span>
                    </button>

                    <router-link
                        :to="'/feed/' + element.feed_id"
                        class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors ml-auto"
                    >
                      <span>Episodes</span>
                      <ArrowRightIcon class="h-3.5 w-3.5" />
                    </router-link>
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
              <p class="text-sm text-gray-500">Drag podcasts into this group</p>
            </div>
            <p class="text-sm text-gray-500">{{ section.items.length }} items</p>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-gray-900/40 p-4">
            <draggable
                v-model="section.items"
                group="favorites"
                @change="onDragEnd"
                itemKey="id"
                class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 min-h-[120px]"
            >
              <template #item="{ element }">
                <div class="group rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all overflow-hidden">
                  <div class="flex items-start gap-3 p-4">
                    <!-- Drag handle -->
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-700 text-gray-400 cursor-grab active:cursor-grabbing">
                      <Bars3Icon class="h-4 w-4" />
                    </div>

                    <!-- Cover -->
                    <div class="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-700">
                      <img
                          :src="element.image || '/images/image_not_available_500.webp'"
                          :alt="element.title"
                          class="w-full h-full object-cover"
                          loading="lazy"
                      />
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {{ element.title }}
                      </h3>
                      <p class="text-xs text-gray-400 truncate mt-0.5">
                        {{ element.author || 'Podcast' }}
                      </p>
                      <p class="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                        {{ stripHtmlTags(element.description) }}
                      </p>
                    </div>
                  </div>

                  <!-- Bottom actions -->
                  <div class="flex items-center gap-2 px-4 pb-3">
                    <div class="flex items-center gap-1.5 text-xs text-pink-400">
                      <StarIcon class="h-4 w-4" />
                      <span>Saved</span>
                    </div>

                    <button
                        @click.prevent="deleteFavourite(element.feed_id, section.name)"
                        class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove from favourites"
                    >
                      <TrashIcon class="h-4 w-4" />
                      <span class="hidden sm:inline">Remove</span>
                    </button>

                    <router-link
                        :to="'/feed/' + element.feed_id"
                        class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors ml-auto"
                    >
                      <span>Episodes</span>
                      <ArrowRightIcon class="h-3.5 w-3.5" />
                    </router-link>
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
