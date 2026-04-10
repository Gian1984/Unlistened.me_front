<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  Bars3Icon,
  Cog6ToothIcon,
  StarIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  BookmarkIcon,
  BookOpenIcon,
  AdjustmentsHorizontalIcon,
  TagIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
  MicrophoneIcon,
  MusicalNoteIcon,
  HeartIcon,
  ListBulletIcon,
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, ChevronRightIcon, MagnifyingGlassIcon, ChevronLeftIcon, XMarkIcon as XMarkSolid } from '@heroicons/vue/20/solid'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { podcastService } from '@/services/podcastService.js'
import { musicService } from '@/services/musicService.js'
import { authService } from '@/services/authService.js'
import { useSidebarState } from '@/composables/useSidebarState.js'

const { isDesktopCollapsed, toggleDesktopCollapse } = useSidebarState()

const router = useRouter()
const authStore = useAuthStore()
authStore.initializeAuth()

// Auth computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const userInitials = computed(() => {
  const source = authStore.user?.name || authStore.user?.email || ''
  return source
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
})

// Navigation sections
const navigationSections = [
  {
    label: 'Discover',
    items: [
      { name: 'Home', href: '/', icon: HomeIcon },
      { name: 'Podcasts', href: '/podcasts', icon: MicrophoneIcon },
      { name: 'Music', href: '/music', icon: MusicalNoteIcon },
    ],
  },
  {
    label: 'Library',
    items: [
      { name: 'Favourites', href: '/favourites', icon: StarIcon },
      { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon },
      { name: 'Music favorites', href: '/music/favorites', icon: HeartIcon },
      { name: 'Music playlists', href: '/music/playlists', icon: ListBulletIcon },
    ],
  },
  {
    label: 'More',
    items: [
      { name: 'Documentation', href: '/documentation', icon: BookOpenIcon },
    ],
  },
]

const sidebarOpen = ref(false)

// Reactive data
const searchQuery = ref('')
const searchType = ref('podcasts')
const categories = ref([])
const categoryFilter = ref('')
const preferredLanguage = ref('')

const filteredCategories = computed(() => {
  const q = categoryFilter.value.trim().toLowerCase()
  if (!q) return categories.value
  return categories.value.filter(c => (c.name || '').toLowerCase().includes(q))
})

// Methods
function onSearchClick() {
  searchType.value = 'podcasts'
  if (searchQuery.value.trim() !== '') {
    router.push({ name: 'SearchResults', query: { q: searchQuery.value, type: 'podcasts' } })
    searchQuery.value = ''
  }
}

function onMusicSearchClick() {
  searchType.value = 'music'
  if (searchQuery.value.trim() !== '') {
    router.push({ name: 'SearchResults', query: { q: searchQuery.value, type: 'music' } })
    searchQuery.value = ''
  }
}

function clearSearch() {
  searchQuery.value = ''
}

function onFilterClick(id) {
  router.push({ name: 'SearchResults', query: { s: id } })
}

async function logout() {
  try {
    await authService.logout()
    authStore.clearUser()
    const messageStore = useMessageStore()
    messageStore.setMessage('Successfully logged out')
    router.push({ name: 'Login' })
  } catch (error) {
    const messageStore = useMessageStore()
    messageStore.setMessage('Failed to log out')
  }
}

async function fetchSearchCat() {
  try {
    const response = await podcastService.getCategories()
    categories.value = response.data.feeds
  } catch (error) {
    console.error('Error fetching search results:', error)
  }
}

async function detectBrowserLanguage() {
  preferredLanguage.value = navigator.language || navigator.userLanguage
  try {
    await authService.detectLanguage(preferredLanguage.value)
    console.log('Browser lang update')
  } catch (error) {
    console.log('Error while lang update')
  }
}

// Lifecycle: created() equivalent - runs immediately
fetchSearchCat()

// Lifecycle: mounted()
onMounted(() => {
  detectBrowserLanguage()
})
</script>
<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5 focus:outline-none focus:ring-0 focus:border-none active:border-none" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                <div class="flex h-24 shrink-0 items-center">
                  <router-link to="/" @click="sidebarOpen = false">
                    <img class="h-12 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="unlistened.me logo"/>
                  </router-link>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-5">
                    <li v-for="section in navigationSections" :key="section.label">
                      <p class="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{{ section.label }}</p>
                      <ul role="list" class="mt-1 -mx-2 space-y-1">
                        <li v-for="item in section.items" :key="item.name">
                          <router-link :to="item.href" :class="[ $route.path === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']" @click="sidebarOpen = false">
                            <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                    <li v-if="isAuthenticated" class="mt-auto">
                      <div class="mb-2 border-t border-gray-800" />
                      <ul role="list" class="-mx-2 space-y-1">
                        <li>
                          <router-link to="/settings" class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" @click="sidebarOpen = false">
                            <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                            Settings
                          </router-link>
                        </li>
                        <li v-if="isAdmin">
                          <router-link to="/dashboard" class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" @click="sidebarOpen = false">
                            <Squares2X2Icon class="h-6 w-6 shrink-0" aria-hidden="true" />
                            Dashboard
                          </router-link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div :class="[
      'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300',
      isDesktopCollapsed ? 'lg:w-20' : 'lg:w-72'
    ]">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-3 pb-4" :class="isDesktopCollapsed ? 'items-center' : 'px-6'">
        <div class="flex h-24 shrink-0 items-center" :class="isDesktopCollapsed ? 'justify-center' : ''">
          <router-link to="/">
            <img class="h-12 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Unlistened.me logo" />
          </router-link>
        </div>
        <nav class="flex flex-1 flex-col" :class="isDesktopCollapsed ? 'w-full' : ''">
          <ul role="list" class="flex flex-1 flex-col gap-y-5">
            <li v-for="section in navigationSections" :key="section.label">
              <p
                  v-if="!isDesktopCollapsed"
                  class="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {{ section.label }}
              </p>
              <div v-else class="mx-auto h-px w-6 bg-gray-800" aria-hidden="true" />
              <ul role="list" class="mt-1 -mx-2 space-y-1">
                <li v-for="item in section.items" :key="item.name">
                  <router-link :to="item.href" :class="[$route.path === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold', isDesktopCollapsed ? 'justify-center' : '']" :title="isDesktopCollapsed ? item.name : undefined">
                    <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span v-if="!isDesktopCollapsed">{{ item.name }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
            <!-- Collapse toggle -->
            <li>
              <button @click="toggleDesktopCollapse" class="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" :class="isDesktopCollapsed ? 'justify-center' : '-mx-2'" :title="isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
                <ChevronLeftIcon :class="['h-6 w-6 shrink-0 transition-transform duration-300', isDesktopCollapsed ? 'rotate-180' : '']" aria-hidden="true" />
                <span v-if="!isDesktopCollapsed">Collapse</span>
              </button>
            </li>
            <li v-if="isAuthenticated" class="mt-auto">
              <div class="mb-2 border-t border-gray-800" :class="isDesktopCollapsed ? 'mx-2' : '-mx-2'" />
              <ul role="list" class="space-y-1" :class="isDesktopCollapsed ? '' : '-mx-2'">
                <li>
                  <router-link to="/settings" class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" :class="isDesktopCollapsed ? 'justify-center' : ''" :title="isDesktopCollapsed ? 'Settings' : undefined">
                    <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span v-if="!isDesktopCollapsed">Settings</span>
                  </router-link>
                </li>
                <li v-if="isAdmin">
                  <router-link to="/dashboard" class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" :class="isDesktopCollapsed ? 'justify-center' : ''" :title="isDesktopCollapsed ? 'Dashboard' : undefined">
                    <Squares2X2Icon class="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span v-if="!isDesktopCollapsed">Dashboard</span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div :class="['transition-all duration-300 overflow-hidden w-full', isDesktopCollapsed ? 'lg:pl-20 pl-0' : 'lg:pl-72 pl-0']">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-2 border-b border-gray-800 bg-gray-950/95 px-3 shadow-sm backdrop-blur-md sm:gap-x-4 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-400 transition-colors hover:text-white lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>

        <div class="flex flex-1 items-center gap-x-2 self-stretch sm:gap-x-4">
          <!-- Search bar -->
          <div class="flex flex-1 items-center py-3 min-w-0">
            <div class="group relative flex w-full items-center gap-1.5 rounded-full border border-gray-800 bg-gray-900 px-2 py-1.5 transition-colors focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 hover:border-gray-700 sm:gap-2 sm:px-3 md:max-w-2xl min-w-0">
              <!-- Search type toggle -->
              <div class="flex shrink-0 rounded-full bg-gray-800 p-0.5">
                <button
                  type="button"
                  @click="onSearchClick"
                  class="flex items-center gap-1 rounded-full px-1.5 py-1 text-xs font-medium transition-colors sm:px-2"
                  :class="searchType === 'podcasts' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'"
                  title="Search podcasts"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="onMusicSearchClick"
                  class="flex items-center gap-1 rounded-full px-1.5 py-1 text-xs font-medium transition-colors sm:px-2"
                  :class="searchType === 'music' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'"
                  title="Search music"
                >
                  <MusicalNoteIcon class="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                  type="button"
                  @click="searchType === 'music' ? onMusicSearchClick() : onSearchClick()"
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-indigo-300"
              >
                <span class="sr-only">Search</span>
                <MagnifyingGlassIcon class="h-4 w-4" aria-hidden="true" />
              </button>

              <label for="search-field" class="sr-only">Search</label>
              <input
                  id="search-field"
                  v-model="searchQuery"
                  @keyup.enter="searchType === 'music' ? onMusicSearchClick() : onSearchClick()"
                  type="text"
                  name="search"
                  placeholder="Search..."
                  class="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-0"
              />

              <button
                  v-if="searchQuery"
                  type="button"
                  @click="clearSearch"
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
                  aria-label="Clear search"
              >
                <XMarkSolid class="h-3.5 w-3.5" />
              </button>

              <!-- Filter by category popover -->
              <Popover class="relative shrink-0 hidden sm:block">
                <PopoverButton
                    class="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-indigo-300 focus:outline-none sm:h-7 sm:w-auto sm:gap-1 sm:rounded-full sm:bg-indigo-500/10 sm:px-2.5 sm:text-indigo-300 sm:ring-1 sm:ring-inset sm:ring-indigo-500/30 sm:hover:bg-indigo-500/20 sm:hover:text-white"
                    title="Filter by category"
                >
                  <AdjustmentsHorizontalIcon class="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                  <span class="hidden sm:inline text-xs font-medium">Filters</span>
                </PopoverButton>

                <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                  <PopoverPanel v-slot="{ close }" class="absolute right-0 z-50 mt-3 w-[22rem] max-w-[calc(100vw-1.5rem)] origin-top-right overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
                    <div class="border-b border-gray-800 px-4 pt-4 pb-3">
                      <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Browse by category</p>
                      <div class="relative mt-2">
                        <MagnifyingGlassIcon class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            v-model="categoryFilter"
                            type="search"
                            placeholder="Filter categories"
                            class="w-full rounded-lg border border-gray-800 bg-gray-950 py-1.5 pl-8 pr-2 text-xs text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div class="max-h-72 overflow-y-auto p-2">
                      <p v-if="!categories.length" class="px-2 py-6 text-center text-xs text-gray-500">Loading categories...</p>
                      <p v-else-if="!filteredCategories.length" class="px-2 py-6 text-center text-xs text-gray-500">No categories match.</p>
                      <ul v-else class="grid grid-cols-2 gap-1">
                        <li v-for="cat in filteredCategories" :key="cat.id">
                          <button
                              type="button"
                              @click="() => { close(); categoryFilter = ''; onFilterClick(cat.id); }"
                              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                          >
                            <TagIcon class="h-3.5 w-3.5 shrink-0 text-gray-500" />
                            <span class="truncate">{{ cat.name }}</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div class="border-t border-gray-800 bg-gray-950/60 px-4 py-2.5">
                      <router-link
                          to="/categories"
                          @click="close"
                          class="flex items-center justify-between text-xs font-semibold text-indigo-400 transition-colors hover:text-pink-400"
                      >
                        See all categories
                        <ChevronRightIcon class="h-4 w-4" />
                      </router-link>
                    </div>
                  </PopoverPanel>
                </transition>
              </Popover>
            </div>
          </div>

          <div class="flex items-center gap-x-2 lg:gap-x-4">
            <!-- Profile dropdown -->
            <Menu as="div" class="relative shrink-0">
              <MenuButton class="-m-1.5 flex items-center gap-x-2 rounded-full p-1.5 transition-colors hover:bg-gray-900">
                <span class="sr-only">Open user menu</span>
                <div
                    v-if="authStore.user"
                    class="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-indigo-500/15 text-xs sm:text-sm font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30"
                >
                  {{ userInitials }}
                </div>
                <div
                    v-else
                    class="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 ring-1 ring-inset ring-gray-700"
                >
                  <UsersIcon class="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span class="hidden lg:flex lg:items-center">
                  <span v-if="authStore.user" class="text-sm font-semibold leading-6 text-white" aria-hidden="true">{{ authStore.user.name }}</span>
                  <span v-else class="text-sm font-semibold leading-6 text-gray-300">Guest</span>
                  <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2.5 w-72 origin-top-right overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-xl focus:outline-none">

                  <!-- Authenticated header -->
                  <div v-if="authStore.user" class="flex items-center gap-3 border-b border-gray-800 bg-gradient-to-br from-indigo-500/10 to-gray-900 px-4 py-4">
                    <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
                      {{ userInitials }}
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-white">{{ authStore.user.name }}</p>
                      <p class="truncate text-xs text-gray-400">{{ authStore.user.email }}</p>
                    </div>
                  </div>

                  <!-- Guest header -->
                  <div v-else class="border-b border-gray-800 bg-gradient-to-br from-indigo-500/10 to-gray-900 px-4 py-4">
                    <p class="text-sm font-semibold text-white">Welcome</p>
                    <p class="mt-0.5 text-xs text-gray-400">Sign in to access your library</p>
                  </div>

                  <!-- Authenticated links -->
                  <div v-if="authStore.user" class="py-1">
                    <MenuItem v-slot="{ active, close }">
                      <router-link
                          to="/settings"
                          @click="close"
                          :class="[active ? 'bg-gray-800 text-white' : 'text-gray-300', 'flex items-center gap-3 px-4 py-2 text-sm']"
                      >
                        <Cog6ToothIcon class="h-4 w-4 text-gray-500" />
                        Account settings
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active, close }">
                      <router-link
                          to="/favourites"
                          @click="close"
                          :class="[active ? 'bg-gray-800 text-white' : 'text-gray-300', 'flex items-center gap-3 px-4 py-2 text-sm']"
                      >
                        <StarIcon class="h-4 w-4 text-gray-500" />
                        My favourites
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active, close }">
                      <router-link
                          to="/bookmarks"
                          @click="close"
                          :class="[active ? 'bg-gray-800 text-white' : 'text-gray-300', 'flex items-center gap-3 px-4 py-2 text-sm']"
                      >
                        <BookmarkIcon class="h-4 w-4 text-gray-500" />
                        My bookmarks
                      </router-link>
                    </MenuItem>
                    <MenuItem v-if="isAdmin" v-slot="{ active, close }">
                      <router-link
                          to="/dashboard"
                          @click="close"
                          :class="[active ? 'bg-gray-800 text-white' : 'text-gray-300', 'flex items-center gap-3 px-4 py-2 text-sm']"
                      >
                        <Squares2X2Icon class="h-4 w-4 text-gray-500" />
                        Admin dashboard
                      </router-link>
                    </MenuItem>
                  </div>

                  <!-- Guest links -->
                  <div v-else class="py-1">
                    <MenuItem v-slot="{ active, close }">
                      <router-link
                          :to="{ name: 'Login' }"
                          @click="close"
                          :class="[active ? 'bg-gray-800 text-white' : 'text-gray-300', 'flex items-center gap-3 px-4 py-2 text-sm']"
                      >
                        <ArrowRightOnRectangleIcon class="h-4 w-4 text-gray-500" />
                        Sign in
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active, close }">
                      <router-link
                          :to="{ name: 'Signup' }"
                          @click="close"
                          :class="[active ? 'bg-gray-800 text-white' : 'text-gray-300', 'flex items-center gap-3 px-4 py-2 text-sm']"
                      >
                        <UserPlusIcon class="h-4 w-4 text-gray-500" />
                        Create account
                      </router-link>
                    </MenuItem>
                  </div>

                  <!-- Sign out -->
                  <div v-if="authStore.user" class="border-t border-gray-800 py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                          type="button"
                          @click="logout"
                          :class="[active ? 'bg-red-500/10 text-red-300' : 'text-red-400', 'flex w-full items-center gap-3 px-4 py-2 text-sm']"
                      >
                        <ArrowLeftOnRectangleIcon class="h-4 w-4" />
                        Sign out
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="overflow-x-hidden">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:enabled,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:enabled,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:enabled,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #030712 inset;
  box-shadow: 0 0 0 1000px #030712 inset;
  background-color: #030712;
  -webkit-text-fill-color: #ffffff;
}
</style>
