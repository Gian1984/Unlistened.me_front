<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRightIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import {
  StarIcon
} from '@heroicons/vue/24/solid'
import Footer from '../components/Footer.vue'
import EmptyState from '../components/EmptyState.vue'
import { useAuthStore } from "@/stores/authStore.js"
import { useMessageStore } from '@/stores/messageStore'
import { CheckCircleIcon } from "@heroicons/vue/24/outline/index.js"
import { XCircleIcon, XMarkIcon } from "@heroicons/vue/20/solid/index.js"
import draggable from 'vuedraggable'
import { podcastService } from '@/services/podcastService.js'

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()

const favorites = ref([])
const newSection = ref('')
const availableSections = ref(['Current Favorites', 'To Listen Next', 'All-Time Favorites', 'Archived Episodes'])
const sections = ref([])
const mainAreaItems = ref([])
const show = ref(false)
const message = ref('')
const notificationType = ref('success')

async function fetchFavorites() {
  try {
    const response = await podcastService.getFavorites()
    favorites.value = response.data

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
  if (newSection.value && !sections.value.find(section => section.name === newSection.value)) {
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
    setTimeout(() => { show.value = false; message.value = null }, 5000)
  } catch (error) {
    console.error('There was an error updating the section:', error)
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
  fetchFavorites()
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
      <p class="text-base font-semibold leading-7 text-indigo-400">Your Favorite</p>
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">Feeds</h1>
      <p class="mt-6 text-lg leading-8 text-gray-400">
        Welcome to your personal hub for all things podcast! This special section is designed just for you,
        here you can easily access and manage your favorite feeds. Whether you're revisiting an old favorite or keeping tabs
        on episodes to enjoy later, this is your go-to spot for curated audio content.
        Enjoy seamless browsing of your top picks and never miss a beat in the world of podcasts!
      </p>
    </div>
  </div>

  <div v-if="!favorites[0]" class="bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-2xl lg:max-w-4xl">
      <EmptyState
        :icon="StarIcon"
        title="No Favorites Yet?"
        description="It looks like you haven't added any favorites yet. Dive into our diverse library of podcasts and find those standout episodes that speak to you."
        action-text="Start exploring"
        action-link="/feed_listing"
      />
    </div>
  </div>

  <div v-else class="pb-24 bg-gray-950">
    <div class="bg-gray-950 pb-12 sm:pb-12">
      <div class="mx-auto max-w-2xl lg:max-w-4xl px-6 lg:px-8">
        <div class="mx-auto">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Organize your feeds</h2>
          <p class="leading-6 text-base text-gray-400 py-6">
            Welcome to your personalized feeds hub! Here, you can easily manage your favorite feeds by creating and organizing them into custom categories. Whether you want to keep track of feeds to listen to next, highlight your all-time favorites, or archive past feeds, our flexible system allows you to create up to five unique sections. Simply select a category from the dropdown menu and drag your favorite feeds into the desired section for a streamlined and organized listening experience.
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
                        <StarIcon class="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                      <p class="ml-3 truncate font-medium text-white">
                        <span>{{ element.title }}</span>
                      </p>
                    </div>
                    <div class="order-3 mt-2 flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto w-full">
                      <router-link :to="'/feed/' + element.feed_id" type="button" class="items-center justify-center border border-transparent bg-white py-2 px-4 mx-1 rounded-full flex text-sm font-medium text-indigo-600 shadow-sm hover:bg-pink-500 hover:text-white transition-colors">
                        <span class="sr-only">Visit feed</span>
                        <ArrowRightIcon class="h-5 w-5" aria-hidden="true" />
                      </router-link>
                    </div>
                    <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                      <button @click="deleteFavourite(element.feed_id, 'main')" type="button" class="-mr-1 py-2 px-4 mx-1 rounded-full flex p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 text-white hover:text-red-600 transition-colors">
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
                        <StarIcon class="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                      <p class="ml-3 truncate font-medium text-white">
                        <span>{{ element.title }}</span>
                      </p>
                    </div>
                    <div class="order-3 mt-2 flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto w-full">
                      <router-link :to="'/feed/' + element.feed_id" type="button" class="items-center justify-center border border-transparent bg-white py-2 px-4 mx-1 rounded-full flex text-sm font-medium text-indigo-600 shadow-sm hover:bg-pink-500 hover:text-white transition-colors">
                        <span class="sr-only">Visit feed</span>
                        <ArrowRightIcon class="h-5 w-5" aria-hidden="true" />
                      </router-link>
                    </div>
                    <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                      <button @click="deleteFavourite(element.feed_id, section.name)" type="button" class="-mr-1 py-2 px-4 mx-1 rounded-full flex p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 text-white hover:text-red-600 transition-colors">
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
