<script setup>
import {ref} from 'vue'
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
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import {useAuthStore} from "@/stores/authStore.js";
let authStore = useAuthStore();

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Podcasts', href: '/feed_listing', icon: FolderIcon, current: false },
  { name: 'Favourites', href: '/favourites', icon: StarIcon, current: false },
  { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon, current: false },
  { name: 'About', href: '/about', icon: UsersIcon, current: false },
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
                    <li v-if="authStore.user" class="mt-auto">
                      <router-link to="/settings"  class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white" @click.native="sidebarOpen = false">
                        <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                        Settings
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
            <li v-if="authStore.user" class="mt-auto">
              <router-link   to="/settings" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
                <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                Settings
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
                    <router-link  to="/signin" class="block px-3 py-1 text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">Sign in</router-link>
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
import {useAuthStore} from "@/stores/authStore.js";
export default {
  data() {
    return {
      searchQuery: '',
    };
  },

  methods: {
    onSearchClick() {
      this.$router.push({ name: 'SearchResults', query: { q: this.searchQuery } });
      this.searchQuery='';
    },
    logout() {
      const authStore = useAuthStore();
      authStore.clearUser();
      this.$router.push({ name: 'Login' });
    }
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