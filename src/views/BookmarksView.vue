<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRightIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import {
  BookmarkIcon,
} from '@heroicons/vue/24/solid'
import { CheckCircleIcon } from '@heroicons/vue/24/outline/index.js'
import { XCircleIcon, XMarkIcon } from '@heroicons/vue/20/solid/index.js'
import draggable from 'vuedraggable'
import Footer from '../components/Footer.vue'
import EmptyState from '../components/EmptyState.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore'
import { podcastService } from '@/services/podcastService.js'

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()

const bookmarks = ref([])
const newSection = ref('')
const availableSections = ref(['Current Bookmarks', 'To Listen Next', 'All-Time Favorites', 'Archived Episodes'])
const sections = ref([])
const mainAreaItems = ref([])
const show = ref(false)
const message = ref('')
const notificationType = ref('success')

async function fetchBookmarks() {
  try {
    const response = await podcastService.getBookmarks()
    bookmarks.value = response.data
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
      console.error('Error fetching bookmarks')
    }
  }
}

function addSection() {
  if (newSection.value && !sections.value.find(section => section.name === newSection.value)) {
    sections.value.push({ name: newSection.value, items: [] })
  }
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
    setTimeout(() => { show.value = false; message.value = null }, 5000)
  } catch (error) {
    console.error('There was an error updating the section:', error)
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
    show.value = true
    message.value = response.data.message
    notificationType.value = 'success'
    setTimeout(() => { show.value = false; message.value = null }, 5000)
  } catch (error) {
    if (error.response && error.response.status === 401) {
      authStore.clearUser()
      messageStore.setMessage('Your session has expired due to lack of activity.')
      router.push({ name: 'Login' })
    } else {
      message.value = 'There was an error while deleting. Please try later.'
      notificationType.value = 'error'
      show.value = true
      setTimeout(() => { show.value = false; message.value = null }, 5000)
    }
  }
}

onMounted(() => {
  fetchBookmarks()
})
</script>

<template>
  <!--  Notification  -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" :class="['pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700 border-2', notificationType === 'success' ? 'border-green-500' : 'border-red-500']">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component :is="notificationType === 'success' ? CheckCircleIcon : XCircleIcon" :class="notificationType === 'success' ? 'h-6 w-6 text-green-400' : 'h-6 w-6 text-red-500'" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-white">{{message}}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="show = false" class="inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

  <div class="bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-2xl lg:max-w-4xl">
      <p class="text-base font-semibold leading-7 text-indigo-400">Your Favorites</p>
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">Bookmarks</h1>
      <p class="mt-6 text-lg leading-8 text-gray-400">
        Here you can find all the podcast episodes you have saved.
        This feature allows you to easily access and enjoy your favorite episodes
        at any time. Whether you want to revisit a thought-provoking discussion or
        catch up on missed content, your bookmarks keep everything in one convenient
        place for quick and easy listening.
      </p>
    </div>
  </div>

  <div v-if="!bookmarks[0]" class="bg-gray-950 px-6 pb-24 sm:pb-32 lg:px-8">
    <div class="mx-auto max-w-2xl lg:max-w-4xl">
      <EmptyState
        :icon="BookmarkIcon"
        title="No Bookmarks Yet?"
        description="It looks like you haven't added any bookmarks yet. Dive into our diverse library of podcasts and find those standout episodes that speak to you."
        action-text="Start exploring"
        action-link="/feed_listing"
      />
    </div>
  </div>

  <div v-else class="pb-24 bg-gray-950">
    <div class="bg-gray-950 pb-12 sm:pb-12">
      <div class="mx-auto max-w-2xl lg:max-w-4xl px-6 lg:px-8">
        <div class="mx-auto">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Organize your bookmarks</h2>
          <p class="leading-6 text-base text-gray-400 py-6">
            Welcome to your personalized feeds hub! Here, you can easily manage your favorite podcasts by creating and organizing them into custom categories. Whether you want to keep track of feeds to listen to next, highlight your all-time favorites, or archive past podcasts, our flexible system allows you to create unique sections. Simply select a category from the dropdown menu and drag your favorite podcast into the desired section for a streamlined and organized listening experience.
          </p>
          <p class="text-white font-bold">Custom categories :</p>
          <div class="mx-auto lg:flex block justify-between align-middle">
            <div class="lg:w-10/12 w-full">
              <label for="location" class="sr-only">Custom categories</label>
              <select v-model="newSection" id="location" name="location" class="mt-2 block w-full border-0 rounded-xl py-1.5 pl-3 pr-10 text-white bg-gray-800 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <option v-for="section in availableSections" :key="section" :value="section">{{ section }}</option>
              </select>
            </div>
            <button class="lg:mt-1.5 mt-3 bg-indigo-600 hover:bg-pink-500 text-white text-sm font-bold py-2 px-4 mx-1 rounded-full flex align-middle transition-colors" @click="addSection">Add Section</button>
          </div>
        </div>
        <div class="mx-auto max-w-2xl lg:mx-0 mt-10">
          <h2 class="text-xl font-bold tracking-tight text-white sm:text-2xl">Main area</h2>
        </div>
        <div class="mx-auto mt-6 gap-x-8 gap-y-16 border rounded-2xl border-gray-700 pt-1 pb-10 sm:mt-6 sm:pb-16 lg:mx-0 lg:max-w-none">
          <draggable class="list-group" v-model="mainAreaItems" group="favorites" @change="onDragEnd" itemKey="id">
            <template #item="{ element }">
              <div class="bg-indigo-600 border-solid border-4 border-gray-950 rounded-2xl">
                <div class="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
                  <div class="flex flex-wrap items-center justify-between">
                    <div class="flex w-0 flex-1 items-center">
                      <span class="flex rounded-lg bg-indigo-800 p-2">
                        <BookmarkIcon class="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                      <p class="ml-3 truncate font-medium text-white">
                        <span>{{ element.title }}</span>
                      </p>
                    </div>
                    <div class="order-3 mt-2 flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto w-full">
                      <router-link :to="'/episode/' + element.episode_id" type="button" class="items-center justify-center border border-transparent bg-white py-2 px-4 mx-1 rounded-full flex text-sm font-medium text-indigo-600 shadow-sm hover:bg-pink-500 hover:text-white transition-colors">
                        <span class="sr-only">Go to episode</span>
                        <ArrowRightIcon class="h-5 w-5" aria-hidden="true" />
                      </router-link>
                    </div>
                    <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                      <button @click="deleteBookmark(element.episode_id, 'main')" type="button" class="-mr-1 py-2 px-4 mx-1 rounded-full flex p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 text-white hover:text-red-600 transition-colors">
                        <span class="sr-only">Dismiss</span>
                        <TrashIcon class="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <div v-for="(section, index) in sections" :key="section.name" :class="['py-6', index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-950']">
      <div class="mx-auto max-w-2xl lg:max-w-4xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:mx-0">
          <h2 class="text-xl font-bold tracking-tight text-white sm:text-2xl">{{ section.name }}</h2>
        </div>
        <div class="mx-auto mt-6 gap-x-8 gap-y-16 border rounded-2xl border-gray-700 pt-1 pb-10 sm:mt-6 sm:pb-16 lg:mx-0 lg:max-w-none">
          <draggable class="list-group" v-model="section.items" group="favorites" @change="onDragEnd" itemKey="id">
            <template #item="{ element }">
              <div class="bg-indigo-600 border-solid border-4 border-gray-950 rounded-2xl">
                <div class="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
                  <div class="flex flex-wrap items-center justify-between">
                    <div class="flex w-0 flex-1 items-center">
                      <span class="flex rounded-lg bg-indigo-800 p-2">
                        <BookmarkIcon class="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                      <p class="ml-3 truncate font-medium text-white">
                        <span>{{ element.title }}</span>
                      </p>
                    </div>
                    <div class="order-3 mt-2 flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto w-full">
                      <router-link :to="'/episode/' + element.episode_id" type="button" class="items-center justify-center border border-transparent bg-white py-2 px-4 mx-1 rounded-full flex text-sm font-medium text-indigo-600 shadow-sm hover:bg-pink-500 hover:text-white transition-colors">
                        <span class="sr-only">Go to episode</span>
                        <ArrowRightIcon class="h-5 w-5" aria-hidden="true" />
                      </router-link>
                    </div>
                    <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                      <button @click="deleteBookmark(element.episode_id, section.name)" type="button" class="-mr-1 py-2 px-4 mx-1 rounded-full flex p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 text-white hover:text-red-600 transition-colors">
                        <span class="sr-only">Dismiss</span>
                        <TrashIcon class="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>
