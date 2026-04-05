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
  PaperClipIcon,
  AdjustmentsHorizontalIcon,
  TagIcon
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon, ChevronLeftIcon } from '@heroicons/vue/20/solid'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/20/solid/index.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { podcastService } from '@/services/podcastService.js'
import { authService } from '@/services/authService.js'
import { useSidebarState } from '@/composables/useSidebarState.js'

const { isDesktopCollapsed, toggleDesktopCollapse } = useSidebarState()

const router = useRouter()
const authStore = useAuthStore()
authStore.initializeAuth()

// Auth computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

// Navigation items
const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Categories', href: '/categories', icon: TagIcon, current: false },
  { name: 'Favourites', href: '/favourites', icon: StarIcon, current: false },
  { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon, current: false },
  { name: 'About', href: '/about', icon: UsersIcon, current: false },
  { name: 'Documentation', href: '/documentation', icon: PaperClipIcon, current: false },
]

const sidebarOpen = ref(false)

// Reactive data (previously in data())
const searchQuery = ref('')
const categories = ref([])
const currentCategories = ref(1)
const categoriesPerPage = ref(8)
const maxVisiblePagesCategories = ref(3)
const preferredLanguage = ref('')

// Computed properties
const paginatedCategories = computed(() => {
  const start = (currentCategories.value - 1) * categoriesPerPage.value
  const end = start + categoriesPerPage.value
  return categories.value.slice(start, end)
})

const totalPagesCategories = computed(() => {
  return Math.ceil(categories.value.length / categoriesPerPage.value)
})

const visiblePagesCategories = computed(() => {
  const pages = []
  const startPage = Math.max(1, currentCategories.value - Math.floor(maxVisiblePagesCategories.value / 2))
  const endPage = Math.min(totalPagesCategories.value, startPage + maxVisiblePagesCategories.value - 1)
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

const showNextButtonCategories = computed(() => {
  return currentCategories.value + Math.floor(maxVisiblePagesCategories.value / 2) < totalPagesCategories.value
})

// Methods
function onSearchClick() {
  if (searchQuery.value.trim() !== '') {
    router.push({ name: 'SearchResults', query: { q: searchQuery.value } })
    searchQuery.value = ''
  }
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

function nextPage(type) {
  if (type === 'categories' && currentCategories.value * categoriesPerPage.value < categories.value.length) {
    currentCategories.value += 1
  }
}

function prevPage(type) {
  if (type === 'categories' && currentCategories.value > 1) {
    currentCategories.value -= 1
  }
}

function goToPage(type, page) {
  if (type === 'categories') {
    currentCategories.value = page
  }
}

function nextPageSet(type) {
  if (type === 'categories') {
    currentCategories.value = Math.min(totalPagesCategories.value, currentCategories.value + maxVisiblePagesCategories.value)
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
                <div class="flex h-32 shrink-0 items-center">
                  <img class="h-16 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="unlistened.me logo"/>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link :to="item.href" :class="[ $route.path === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']" @click.native="sidebarOpen = false">
                            <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                    <li v-if="isAuthenticated" class="mt-auto">
                      <router-link to="/settings"  class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" @click.native="sidebarOpen = false">
                        <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                        Settings
                      </router-link>
                    </li>
                    <li v-if="isAuthenticated && isAdmin">
                      <router-link to="/dashboard"  class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" @click.native="sidebarOpen = false">
                        <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                        Dashboard
                      </router-link>
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
            <img class="h-16 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Unlistened.me logo" />
          </router-link>
        </div>
        <nav class="flex flex-1 flex-col" :class="isDesktopCollapsed ? 'w-full' : ''">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
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
              <router-link to="/settings" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" :class="isDesktopCollapsed ? 'justify-center mx-0' : ''" :title="isDesktopCollapsed ? 'Settings' : undefined">
                <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                <span v-if="!isDesktopCollapsed">Settings</span>
              </router-link>
            </li>
            <li v-if="isAuthenticated && isAdmin">
              <router-link to="/dashboard" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" :class="isDesktopCollapsed ? 'justify-center mx-0' : ''" :title="isDesktopCollapsed ? 'Dashboard' : undefined">
                <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                <span v-if="!isDesktopCollapsed">Dashboard</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div :class="['transition-all duration-300', isDesktopCollapsed ? 'lg:pl-20' : 'lg:pl-72']">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-400 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-700 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="relative flex flex-1">

            <Popover class="hidden md:flex align-middle px-2 ring-0 outline-none focus:outline-none focus:ring-0 focus:border-transparent">

              <PopoverButton class="ring-0 outline-none focus:outline-none focus:ring-0 focus:border-transparent">
                <span class="sr-only">filters</span>
                <AdjustmentsHorizontalIcon class=" h-8 bg-indigo-600 hover:bg-pink-500 text-white font-bold py-2 px-2 rounded-full" aria-hidden="true" />
              </PopoverButton>

              <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                <PopoverPanel v-slot="{ close }" class="absolute inset-x-0 top-0 -z-10 bg-gray-900 pt-16 shadow-lg ring-1 ring-gray-700">
                  <div class="pt-6">
                    <div class="mx-auto max-w-7xl px-3 lg:px-8">
                      <h3 class="text-lg leading-6 text-white">Search by Categories</h3>
                    </div>
                  </div>
                  <div class="mx-auto grid max-w-7xl grid-cols-1 gap-2 px-1 sm:grid-cols-2 sm:gap-x-1 sm:gap-y-0 sm:py-6 lg:grid-cols-4 lg:gap-1 lg:px-3 xl:gap-1 py-6">
                    <div v-for="item in paginatedCategories" :key="item.name" class="group relative -mx-1 flex gap-1 rounded-lg p-1 text-sm sm:flex-col sm:p-1">
                      <div class="flex items-center justify-center rounded-lg bg-gray-800 group-hover:bg-pink-500 px-1">
                        <MagnifyingGlassIcon class="h-3 w-3 text-gray-300 mr-2"/>
                        <button @click="() => { close(); onFilterClick(item.id); }" class="font-semibold text-gray-300 py-1">
                          {{ item.name }}
                          <span class="absolute inset-0 sr-only">Search</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-900">
                    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 pb-4">
                      <div class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                        <div class="-mt-px flex w-0 flex-1">
                          <button @click="prevPage('categories')" :disabled="currentCategories === 1" :class="{'inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-white hover:border-pink-500 hover:text-pink-500': currentCategories !== 1, 'inline-flex items-center border-t-2 border-gray-600 pr-1 pt-4 text-sm font-medium text-gray-600 cursor-default': currentCategories === 1}">
                            <ArrowLongLeftIcon class="mr-3 h-5 w-5" aria-hidden="true" />
                            Previous
                          </button>
                        </div>
                        <div class="hidden md:-mt-px md:flex">
                          <button v-for="page in visiblePagesCategories" :key="page" @click="goToPage('categories', page)" :class="{'inline-flex items-center border-t-2 border-indigo-500 text-indigo-500 px-4 pt-4 text-sm font-medium': currentCategories === page, 'inline-flex items-center border-t-2 border-transparent text-white hover:text-pink-500 hover:border-pink-500 px-4 pt-4 text-sm font-medium': currentCategories !== page}" aria-current="page">{{ page }}</button>
                          <button v-if="showNextButtonCategories" @click="nextPageSet('categories')" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-white hover:text-pink-500">...</button>
                        </div>
                        <div class="-mt-px flex w-0 flex-1 justify-end">
                          <button @click="nextPage('categories')" :disabled="currentCategories * categoriesPerPage >= categories.length" :class="{'inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-white hover:border-pink-500 hover:text-pink-500': currentCategories * categoriesPerPage < categories.length, 'inline-flex items-center border-t-2 border-gray-600 pl-1 pt-4 text-sm font-medium text-gray-600 cursor-default': currentCategories * categoriesPerPage >= categories.length}">
                            Next
                            <ArrowLongRightIcon class="ml-3 h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </transition>
            </Popover>


            <button @click="onSearchClick">
              <span class="sr-only">Search</span>
              <MagnifyingGlassIcon class=" h-8 bg-indigo-600 hover:bg-pink-500 text-white font-bold py-2 px-2 rounded-full" />
            </button>
            <label for="search-field" class="sr-only">Search</label>
            <input id="search-field" v-model="searchQuery"  @keyup.enter="onSearchClick" class="block h-full w-full border-0 bg-gray-950 focus:bg-gray-950 active:bg-gray-950 pl-4 pr-0 text-white placeholder:text-gray-500 focus:ring-0 sm:text-sm" placeholder="Search..." type="search" name="search"/>
          </div>
          <div class="flex items-center gap-x-4 lg:gap-x-6">

             <router-link to="/" type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-300 lg:hidden">
               <span class="sr-only">View notifications</span>
               <img class="h-8 w-8 " src="/images/unlistened_transparen_logo_176.png" alt="unlistened.me logo"/>
             </router-link>

            <!-- Separator -->
            <div class="h-6 w-px bg-gray-700 lg:hidden" aria-hidden="true" />

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="sr-only">Open user menu</span>
                <img v-if="authStore.user" class="h-8 w-8 rounded-full bg-gray-50" src="/images/check-circled-svgrepo-com.png" alt="checkmark logo user is logged in" />
                <img v-else class="h-8 w-8 rounded-full bg-gray-50" src="/images/question-mark-circled-svgrepo-com.png" alt="question mark user is not logged in" />
                <span class="hidden lg:flex lg:items-center">
                  <span v-if="authStore.user" class="ml-4 text-sm font-semibold leading-6 text-white" aria-hidden="true">{{ authStore.user.name }}</span>
                  <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2.5 w-72 origin-top-right rounded-md bg-gray-800 py-2 shadow-lg ring-1 ring-gray-700 focus:outline-none">

                  <RouterLink v-if="!authStore.user" v-slot="{ href, navigate }" :to="{ name: 'Signup' }" custom>
                    <MenuItem v-slot="{ close }">
                      <a :href="href" @click.prevent="navigate();close()" class="block px-3 py-1 text-sm font-semibold leading-6 text-gray-200 hover:text-indigo-400">
                        Create Account
                      </a>
                    </MenuItem>
                  </RouterLink>

                  <RouterLink v-if="authStore.user" v-slot="{ href, navigate }" :to="{ name: 'Settings' }" custom>
                    <MenuItem v-slot="{ close }">
                      <a :href="href" @click.prevent="navigate();close()" class="block px-3 py-1 text-sm font-semibold leading-6 text-gray-200 hover:text-indigo-400">
                        Welcome {{ authStore.user.name }} !
                      </a>
                    </MenuItem>
                  </RouterLink>

                  <RouterLink v-if="!authStore.user" v-slot="{ href, navigate }" :to="{ name: 'Login' }" custom>
                    <MenuItem v-slot="{ close }">
                      <a :href="href" @click.prevent="navigate();close()" class="block px-3 py-1 text-sm font-semibold leading-6 text-gray-200 hover:text-indigo-400">Login</a>
                    </MenuItem>
                  </RouterLink>

                  <MenuItem v-if="authStore.user">
                    <button  class="block px-3 py-1 text-sm font-semibold leading-6 text-gray-200 hover:text-indigo-400" @click="logout">Sign out</button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main>
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
