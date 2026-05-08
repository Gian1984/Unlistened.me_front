<script setup>
import { onMounted, ref } from 'vue'
import {
  ArrowRightIcon,
  Bars3Icon,
  CheckCircleIcon,
  FolderPlusIcon,
  TrashIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
import { BookmarkIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import draggable from 'vuedraggable'
import EmptyState from '@/components/EmptyState.vue'
import PageHero from '@/components/PageHero.vue'
import { podcastService } from '@/services/podcastService.js'
import { usePageSeo } from '~/composables/usePageSeo'

definePageMeta({
  middleware: ['auth'],
})

usePageSeo('bookmarks')

const bookmarks = ref([])
const isLoading = ref(true)
const newSectionName = ref('')
const sectionPresets = [
  'Listen next',
  'Saved for later',
  'Best episodes',
  'Archive',
]
const sections = ref([])
const mainAreaItems = ref([])
const show = ref(false)
const message = ref('')
const notificationType = ref('success')

async function fetchBookmarks() {
  isLoading.value = true
  try {
    const response = await podcastService.getBookmarks()
    bookmarks.value = response.data
    sections.value = []
    mainAreaItems.value = response.data.filter(item => !item.section)

    const sectionNames = [...new Set(response.data.filter(i => i.section).map(i => i.section))]
    sectionNames.forEach((sectionName) => {
      const items = response.data.filter(item => item.section === sectionName)
      sections.value.push({ name: sectionName, items })
    })
  } catch {
    // 401s redirect via session handler; other errors fall to empty state.
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
    updateBookmarkSection(element.id, sectionName)
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

async function updateBookmarkSection(favoriteId, section) {
  try {
    const response = await podcastService.updateBookmarkSection(favoriteId, section)
    show.value = true
    message.value = response.data.message
    notificationType.value = 'success'
    setTimeout(() => {
      show.value = false
      message.value = null
    }, 3000)
  } catch {
    notificationType.value = 'error'
    message.value = 'Unable to update bookmark section.'
    show.value = true
    setTimeout(() => {
      show.value = false
      message.value = null
    }, 3000)
  }
}

async function deleteBookmark(episodeId, sectionName) {
  try {
    const response = await podcastService.deleteBookmark(episodeId)

    if (sectionName === 'main') {
      mainAreaItems.value = mainAreaItems.value.filter(item => item.episode_id !== episodeId)
    } else {
      const section = sections.value.find(sec => sec.name === sectionName)
      if (section) {
        section.items = section.items.filter(item => item.episode_id !== episodeId)
      }
    }

    bookmarks.value = bookmarks.value.filter(item => item.episode_id !== episodeId)

    show.value = true
    message.value = response.data.message
    notificationType.value = 'success'
    setTimeout(() => {
      show.value = false
      message.value = null
    }, 3000)
  } catch (error) {
    if (error.response?.status !== 401) {
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
  fetchBookmarks()
})
</script>

<template>
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
            notificationType === 'success' ? 'border-green-500' : 'border-red-500',
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
                class="ml-auto inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
                @click="show = false"
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
      <PageHero
        eyebrow="Your library"
        title="Bookmarks"
        description="Every episode you bookmark lands here. Group them into sections, drag them around, and keep your listening queue exactly the way you want."
        :breadcrumbs="[
          { label: 'Home', to: '/' },
          { label: 'Library' },
          { label: 'Bookmarks' },
        ]"
      />

      <div v-if="isLoading">
        <div class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
          <div class="h-5 w-48 rounded animate-shimmer" />
          <div class="mt-3 space-y-2">
            <div class="h-3.5 w-full max-w-lg rounded animate-shimmer" />
            <div class="h-3.5 w-2/3 rounded animate-shimmer" />
          </div>
          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div v-for="i in 3" :key="i" class="h-16 rounded-xl border border-gray-800 bg-gray-950/50 animate-shimmer" />
          </div>
          <div class="mt-6 flex flex-wrap gap-2">
            <div v-for="i in 4" :key="i" class="h-7 w-28 rounded-full animate-shimmer" />
          </div>
          <div class="mt-5 flex flex-col gap-2 sm:flex-row">
            <div class="h-10 flex-1 rounded-lg animate-shimmer" />
            <div class="h-10 w-32 shrink-0 rounded-lg animate-shimmer" />
          </div>
        </div>

        <div class="mb-10">
          <div class="mb-4 flex items-center justify-between">
            <div class="space-y-1.5">
              <div class="h-5 w-14 rounded animate-shimmer" />
              <div class="h-3.5 w-64 rounded animate-shimmer" />
            </div>
            <div class="h-3.5 w-10 rounded animate-shimmer" />
          </div>
          <div class="space-y-2 rounded-2xl border border-gray-800 bg-gray-900/40 p-3 sm:p-4">
            <div v-for="i in 4" :key="i" class="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3">
              <div class="h-9 w-9 shrink-0 rounded-full animate-shimmer" />
              <div class="h-9 w-9 shrink-0 rounded-full animate-shimmer" />
              <div class="min-w-0 flex-1 space-y-1.5">
                <div class="h-4 w-3/4 rounded animate-shimmer" />
                <div class="h-3 w-1/3 rounded animate-shimmer" />
              </div>
              <div class="flex shrink-0 gap-1">
                <div class="h-8 w-8 rounded-full animate-shimmer" />
                <div class="h-8 w-8 rounded-full animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!bookmarks.length" class="mx-auto max-w-4xl py-8">
        <EmptyState
          :icon="BookmarkIcon"
          title="No bookmarks yet"
          description="You have not saved any episodes yet. Browse podcasts and bookmark the ones you want to listen to later."
          action-text="Start browsing"
          action-link="/"
        />
      </div>

      <div v-else class="mx-auto">
        <div class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
          <div class="max-w-2xl">
            <h2 class="text-xl font-semibold text-white">Organize your bookmarks</h2>
            <p class="mt-2 text-sm leading-7 text-gray-400">
              Want a tidy listening queue? Create a section, then drag any episode into it. Make as many sections as you want, and drag things back to the inbox whenever you change your mind.
            </p>
          </div>

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
                <p class="mt-0.5 text-xs leading-5 text-gray-400">Move episodes from the inbox into any section.</p>
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

          <div class="mt-6">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Quick add</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="preset in sectionPresets"
                :key="preset"
                type="button"
                :disabled="sections.some(s => s.name === preset)"
                class="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-700 disabled:hover:bg-gray-800 disabled:hover:text-gray-300"
                @click="addSection(preset)"
              >
                <FolderPlusIcon class="h-3.5 w-3.5" />
                {{ preset }}
              </button>
            </div>
          </div>

          <div class="mt-5">
            <label for="bookmark-section" class="text-xs font-semibold uppercase tracking-wide text-gray-500">Or pick your own name</label>
            <div class="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="bookmark-section"
                v-model="newSectionName"
                type="text"
                placeholder="e.g. Morning commute, Deep dives, Sleep stories..."
                class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                @keyup.enter="addSection()"
              />
              <button
                type="button"
                :disabled="!newSectionName.trim()"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
                @click="addSection()"
              >
                <FolderPlusIcon class="h-4 w-4" />
                Add section
              </button>
            </div>
          </div>
        </div>

        <section class="mb-10">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-white">Inbox</h2>
              <p class="text-sm text-gray-500">Every episode you bookmark lands here. Drag any of them into a section below.</p>
            </div>
            <p class="text-sm text-gray-500">{{ mainAreaItems.length }} items</p>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-gray-900/40 p-3 sm:p-4">
            <draggable
              v-model="mainAreaItems"
              group="favorites"
              item-key="id"
              class="min-h-[80px] space-y-2"
              @change="onDragEnd"
            >
              <template #item="{ element }">
                <div class="group flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/40 p-2 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60 sm:gap-3 sm:p-3">
                  <div class="drag-handle hidden h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-full bg-gray-700 text-gray-400 active:cursor-grabbing sm:flex" title="Drag to a section">
                    <Bars3Icon class="h-4 w-4" />
                  </div>
                  <span class="hidden w-5 shrink-0 text-center text-xs text-gray-500 tabular-nums sm:flex">
                    {{ mainAreaItems.indexOf(element) + 1 }}
                  </span>

                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 sm:h-12 sm:w-12">
                    <BookmarkIcon class="h-5 w-5 text-indigo-400" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <NuxtLink :to="'/episode/' + element.episode_id" class="block">
                      <p class="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                        {{ element.title }}
                      </p>
                    </NuxtLink>
                    <p class="mt-0.5 text-xs text-gray-400">Saved episode</p>
                  </div>

                  <div class="flex shrink-0 items-center gap-0.5">
                    <NuxtLink
                      :to="'/episode/' + element.episode_id"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-indigo-400"
                      title="Open episode"
                    >
                      <ArrowRightIcon class="h-4 w-4" />
                    </NuxtLink>

                    <button
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-red-400"
                      title="Delete bookmark"
                      @click="deleteBookmark(element.episode_id, 'main')"
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
              Your inbox is empty. Drag an episode here to move it back from a section.
            </div>
          </div>
        </section>

        <section v-for="section in sections" :key="section.name" class="mb-8">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <h2 class="truncate text-lg font-semibold text-white">{{ section.name }}</h2>
              <p class="text-sm text-gray-500">Drag episodes in or out to keep them grouped.</p>
            </div>
            <div class="flex items-center gap-3">
              <p class="text-sm text-gray-500">{{ section.items.length }} items</p>
              <button
                v-if="!section.items.length"
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800 hover:text-red-400"
                title="Remove this empty section"
                @click="removeSection(section.name)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-gray-900/40 p-3 sm:p-4">
            <draggable
              v-model="section.items"
              group="favorites"
              item-key="id"
              class="min-h-[80px] space-y-2"
              @change="onDragEnd"
            >
              <template #item="{ element }">
                <div class="group flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/40 p-2 transition-colors hover:border-indigo-500/40 hover:bg-gray-800/60 sm:gap-3 sm:p-3">
                  <div class="drag-handle hidden h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-full bg-gray-700 text-gray-400 active:cursor-grabbing sm:flex" title="Drag to another section">
                    <Bars3Icon class="h-4 w-4" />
                  </div>
                  <span class="hidden w-5 shrink-0 text-center text-xs text-gray-500 tabular-nums sm:flex">
                    {{ section.items.indexOf(element) + 1 }}
                  </span>

                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 sm:h-12 sm:w-12">
                    <BookmarkIcon class="h-5 w-5 text-indigo-400" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <NuxtLink :to="'/episode/' + element.episode_id" class="block">
                      <p class="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                        {{ element.title }}
                      </p>
                    </NuxtLink>
                    <p class="mt-0.5 text-xs text-gray-400">Saved episode</p>
                  </div>

                  <div class="flex shrink-0 items-center gap-0.5">
                    <NuxtLink
                      :to="'/episode/' + element.episode_id"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-indigo-400"
                      title="Open episode"
                    >
                      <ArrowRightIcon class="h-4 w-4" />
                    </NuxtLink>

                    <button
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-700 hover:text-red-400"
                      title="Delete bookmark"
                      @click="deleteBookmark(element.episode_id, section.name)"
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
              This section is empty. Drag an episode from your inbox into here.
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
