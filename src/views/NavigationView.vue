<script setup>
import {ref} from 'vue'
import { computed } from 'vue';
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
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  BookmarkIcon,
  PaperClipIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import {useAuthStore} from "@/stores/authStore.js";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import {ArrowLongLeftIcon, ArrowLongRightIcon} from "@heroicons/vue/20/solid/index.js";

let authStore = useAuthStore();
authStore.initializeAuth(); // Ensure the store is initialized

// Create computed properties to check authentication and admin status
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Podcasts', href: '/feed_listing', icon: FolderIcon, current: false },
  { name: 'Favourites', href: '/favourites', icon: StarIcon, current: false },
  { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon, current: false },
  { name: 'About', href: '/about', icon: UsersIcon, current: false },
  { name: 'Documentation', href: '/documentation', icon: PaperClipIcon, current: false },
]


const sidebarOpen = ref(false)
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
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
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
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
        <div class="flex h-24 shrink-0 items-center">
          <img class="h-16 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Unlistened.me logo" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <router-link :to="item.href" :class="[$route.path === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                    <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li v-if="isAuthenticated" class="mt-auto">
              <router-link   to="/settings" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
                <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                Settings
              </router-link>
            </li>
            <li v-if="isAuthenticated && isAdmin">
              <router-link to="/dashboard" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
                <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                Dashboard
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="relative flex flex-1">

            <Popover class="flex align-middle px-2 ring-0 outline-none focus:outline-none focus:ring-0 focus:border-transparent">

              <PopoverButton class="ring-0 outline-none focus:outline-none focus:ring-0 focus:border-transparent">
                <AdjustmentsHorizontalIcon class=" h-12 bg-indigo-500 hover:bg-pink-500 text-white font-bold py-4 px-4 rounded-full" aria-hidden="true" />
              </PopoverButton>

              <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                <PopoverPanel class="absolute inset-x-0 top-0 -z-10 bg-white pt-16 shadow-lg ring-1 ring-gray-900/5">
                  <div class="pt-6">
                    <div class="mx-auto max-w-7xl px-3 lg:px-8">
                      <h3 class="text-lg leading-6 text-gray-900">Search by Categories</h3>
                    </div>
                  </div>
                  <div class="mx-auto grid max-w-7xl grid-cols-1 gap-2 px-1 sm:grid-cols-2 sm:gap-x-1 sm:gap-y-0 sm:py-6 lg:grid-cols-4 lg:gap-1 lg:px-3 xl:gap-1 py-6">
                    <div v-for="item in paginatedCategories" :key="item.name" class="group relative -mx-1 flex gap-1 rounded-lg p-1 text-sm sm:flex-col sm:p-1">
                      <div class="flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-white px-1">
                        <MagnifyingGlassIcon class="h-3 w-3 text-gray-900 mr-2"/>
                        <button @click="onFilterClick(item.id)" class="font-semibold text-gray-900 py-1">
                          {{ item.name }}
                          <span class="absolute inset-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-900">
                    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 pb-4">
                      <div class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                        <div class="-mt-px flex w-0 flex-1">
                          <button @click="prevPage('categories')" :disabled="currentCategories === 1" :class="{'inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-white hover:border-indigo-500 hover:text-indigo-500': currentCategories !== 1, 'inline-flex items-center border-t-2 border-gray-600 pr-1 pt-4 text-sm font-medium text-gray-600 cursor-default': currentCategories === 1}">
                            <ArrowLongLeftIcon class="mr-3 h-5 w-5" aria-hidden="true" />
                            Previous
                          </button>
                        </div>
                        <div class="hidden md:-mt-px md:flex">
                          <button v-for="page in visiblePagesCategories" :key="page" @click="goToPage('categories', page)" :class="{'inline-flex items-center border-t-2 border-pink-500 text-pink-600 px-4 pt-4 text-sm font-medium': currentCategories === page, 'inline-flex items-center border-t-2 border-transparent text-white hover:text-indigo-500 hover:border-indigo-500 px-4 pt-4 text-sm font-medium': currentCategories !== page}" aria-current="page">{{ page }}</button>
                          <button v-if="showNextButtonCategories" @click="nextPageSet('categories')" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-white hover:text-indigo-500">...</button>
                        </div>
                        <div class="-mt-px flex w-0 flex-1 justify-end">
                          <button @click="nextPage('categories')" :disabled="currentCategories * categoriesPerPage >= categories.length" :class="{'inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-white hover:border-indigo-500 hover:text-indigo-500': currentCategories * categoriesPerPage < categories.length, 'inline-flex items-center border-t-2 border-gray-600 pl-1 pt-4 text-sm font-medium text-gray-600 cursor-default': currentCategories * categoriesPerPage >= categories.length}">
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

            <label for="search-field" class="sr-only">Search</label>
            <button @click="onSearchClick">
              <MagnifyingGlassIcon class=" h-12 bg-indigo-500 hover:bg-pink-500 text-white font-bold py-4 px-4 rounded-full" />
            </button>

            <input id="search-field" v-model="searchQuery" class="block h-full w-full border-0 bg-white focus:bg-white active:bg-white target:bg-white visited:bg-white pl-4 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." type="search" name="search"/>
          </div>
          <div class="flex items-center gap-x-4 lg:gap-x-6">

             <router-link to="/" type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 lg:hidden">
               <span class="sr-only">View notifications</span>
               <img class="h-8 w-8 " src="/images/unlistened_transparen_logo_176.png" alt="unlistened.me logo"/>
             </router-link>

            <!-- Separator -->
            <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="sr-only">Open user menu</span>
                <img v-if="authStore.user" class="h-8 w-8 rounded-full bg-gray-50" src="/images/check-circled-svgrepo-com.png" alt="checkmark logo user is logged in" />
                <img v-else class="h-8 w-8 rounded-full bg-gray-50" src="/images/question-mark-circled-svgrepo-com.png" alt="question mark user is not logged in" />
                <span class="hidden lg:flex lg:items-center">
                  <span v-if="authStore.user" class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">{{ authStore.user.name }}</span>
                  <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-900" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2.5 w-72 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem v-if="!authStore.user">
                    <router-link  to="/signup" class="block px-3 py-1 text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">Create Account</router-link>
                  </MenuItem>
                  <MenuItem v-if="authStore.user">
                    <router-link  to="/settings" class="block px-3 py-1 text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">Welcome {{ authStore.user.name }} !</router-link>
                  </MenuItem>
                  <MenuItem v-if="!authStore.user">
                    <router-link  to="/login" class="block px-3 py-1 text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">Login</router-link>
                  </MenuItem>
                  <MenuItem v-if="authStore.user">
                    <button  class="block px-3 py-1 text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600" @click="logout">Sign out</button>
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
<script>
const base_Url = import.meta.env.VITE_BASE_URL
import {useAuthStore} from "@/stores/authStore.js";
import {useMessageStore} from "@/stores/messageStore.js";

export default {
  data() {
    return {
      searchQuery: '',
      categories:[],
      currentCategories: 1,
      categoriesPerPage: 8,
      maxVisiblePagesCategories: 3,
    };
  },

  computed: {
    paginatedCategories() {
      const start = (this.currentCategories - 1) * this.categoriesPerPage;
      const end = start + this.categoriesPerPage;
      return this.categories.slice(start, end);
    },
    totalPagesCategories() {
      return Math.ceil(this.categories.length / this.categoriesPerPage);
    },
    visiblePagesCategories() {
      const pages = [];
      const startPage = Math.max(1, this.currentCategories - Math.floor(this.maxVisiblePagesCategories / 2));
      const endPage = Math.min(this.totalPagesCategories, startPage + this.maxVisiblePagesCategories - 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
    showNextButtonCategories() {
      return this.currentCategories + Math.floor(this.maxVisiblePagesCategories / 2) < this.totalPagesCategories;
    },
  },

  created() {
    this.fetchSearchCat()
  },

  methods: {
    onSearchClick() {
      this.$router.push({ name: 'SearchResults', query: { q: this.searchQuery } });
      this.searchQuery='';
    },

    onFilterClick(id) {
      this.$router.push({ name: 'SearchResults', query: { s: id } });
    },

    logout() {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/logout'))
          .then(response => {

            const authStore = useAuthStore();
            authStore.clearUser();

            const messageStore = useMessageStore();
            messageStore.setMessage('Successfully logged out');
            this.$router.push({ name: 'Login' });

          })
          .catch(error => {

            const messageStore = useMessageStore();
            console.log(error)
            messageStore.setMessage('Failed to log out',error);

          });
    },

    fetchSearchCat() {
      this.axios.get(base_Url + `api/feed-cat`)
          .then(response => {
            console.log(response)
            this.categories = response.data.feeds
          })
          .catch(error => {
            console.error('Error fetching search results:', error);
          });
    },

    nextPage(type) {
      if (type === 'categories' && this.currentCategories * this.categoriesPerPage < this.categories.length) {
        this.currentCategories += 1;
      }
    },
    prevPage(type) {
      if (type === 'categories' && this.currentCategories > 1) {
        this.currentCategories -= 1;
      }
    },
    goToPage(type, page) {
      if (type === 'categories') {
        this.currentCategories = page;
      }
    },
    nextPageSet(type) {
      if (type === 'categories') {
        this.currentCategories = Math.min(this.totalPagesCategories, this.currentCategories + this.maxVisiblePagesCategories);
      }
    },

  },

};
</script>

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
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
  box-shadow: 0 0 0 1000px #ffffff inset;
  background-color: #ffffff;
}
</style>