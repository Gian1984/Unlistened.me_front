<script setup>
import Footer from '../components/Footer.vue'
import {ArrowRightIcon, StarIcon, CheckCircleIcon} from "@heroicons/vue/24/outline/index.js";
import { XMarkIcon } from '@heroicons/vue/20/solid'
import {useAuthStore} from "@/stores/authStore.js";
let authStore = useAuthStore();
authStore.initializeAuth();
import {useMessageStore} from "@/stores/messageStore.js";
let messageStore = useMessageStore();
messageStore.initializeMessage();
</script>
<template>

  <!--  Notification  -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">Successfully added!</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="show = false" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
  <!--  Notification  -->

  <div v-if="noResult">
    <div class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm pb-24">
        <img class="mx-auto h-64 w-auto" src="/images/unlistened.me_white_300.png" alt="Unlistened.me logo" />
      </div>
      <div class="text-center">
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Sorry</h1>
        <p class="mt-2 text-xl font-bold  leading-7 text-gray-900">but your search returned no results.</p>
        <div class="mt-2 flex items-center justify-center gap-x-6 mx-auto text-center">
          <svg width="64px" height="64px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="_x3C_Layer_x3E_" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="search_x2C__magnifier_x2C__magnifying_x2C__emoji_x2C__No_results"> <g id="XMLID_1857_"> <g id="XMLID_1791_"> <path d="M17.5,13c0.27,0,0.5,0.23,0.5,0.5S17.77,14,17.5,14S17,13.77,17,13.5S17.23,13,17.5,13z " fill="#263238" id="XMLID_1797_"></path> <path d="M8.5,13C8.77,13,9,13.23,9,13.5S8.77,14,8.5,14S8,13.77,8,13.5S8.23,13,8.5,13z" fill="#263238" id="XMLID_1794_"></path> </g> </g> <g id="XMLID_1764_"> <g id="XMLID_4103_"> <line fill="none" id="XMLID_4109_" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="23.43" x2="21.214" y1="23.401" y2="21.186"></line> <path d=" M29.914,27.086l-3.5-3.5c-0.756-0.756-2.072-0.756-2.828,0C23.208,23.964,23,24.466,23,25s0.208,1.036,0.586,1.414l3.5,3.5 c0.378,0.378,0.88,0.586,1.414,0.586s1.036-0.208,1.414-0.586S30.5,29.034,30.5,28.5S30.292,27.464,29.914,27.086z" fill="none" id="XMLID_4108_" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path> <circle cx="13" cy="13" fill="none" id="XMLID_4107_" r="11.5" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></circle> <path d=" M12,15.521c0-0.55,0.45-1,1-1s1,0.45,1,1" fill="none" id="XMLID_4106_" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path> <path d=" M17.5,13c0.27,0,0.5,0.23,0.5,0.5S17.77,14,17.5,14S17,13.77,17,13.5S17.23,13,17.5,13z" fill="none" id="XMLID_4105_" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path> <path d=" M8.5,13C8.77,13,9,13.23,9,13.5S8.77,14,8.5,14S8,13.77,8,13.5S8.23,13,8.5,13z" fill="none" id="XMLID_4104_" stroke="#455A64" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path> </g> <g id="XMLID_4096_"> <line fill="none" id="XMLID_4102_" stroke="#263238" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="23.43" x2="21.214" y1="23.401" y2="21.186"></line> <path d=" M29.914,27.086l-3.5-3.5c-0.756-0.756-2.072-0.756-2.828,0C23.208,23.964,23,24.466,23,25s0.208,1.036,0.586,1.414l3.5,3.5 c0.378,0.378,0.88,0.586,1.414,0.586s1.036-0.208,1.414-0.586S30.5,29.034,30.5,28.5S30.292,27.464,29.914,27.086z" fill="none" id="XMLID_4101_" stroke="#263238" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path> <circle cx="13" cy="13" fill="none" id="XMLID_4100_" r="11.5" stroke="#263238" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></circle> <path d=" M12,15.521c0-0.55,0.45-1,1-1s1,0.45,1,1" fill="none" id="XMLID_4099_" stroke="#263238" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path> <path d=" M17.5,13c0.27,0,0.5,0.23,0.5,0.5S17.77,14,17.5,14S17,13.77,17,13.5S17.23,13,17.5,13z" fill="none" id="XMLID_4098_" stroke="#263238" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path> <path d=" M8.5,13C8.77,13,9,13.23,9,13.5S8.77,14,8.5,14S8,13.77,8,13.5S8.23,13,8.5,13z" fill="none" id="XMLID_4097_" stroke="#263238" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path> </g> </g> </g> </g></svg>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-4xl">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm pb-24">
          <img class="mx-auto h-64 w-auto" src="/images/unlistened.me_white_300.png" alt="Unlistened.me logo" />
        </div>
        <h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Search result</h1>
        <p class="mt-2 text-lg leading-6 text-gray-900">
          Sit back, relax, and dive into these selections, knowing that they've been handpicked just for you. Happy listening!
        </p>
        <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
          <article v-for="feed in visibleFeeds" :key="feed.id" class="relative isolate flex flex-col gap-8 lg:flex-row">
            <div class="relative aspect-square lg:w-64 lg:shrink-0">
              <img :src="feed.image || '/images/image_not_available_500.webp'" alt="" class="absolute inset-0 aspect-square w-full rounded-2xl bg-gray-50 object-cover" />
              <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10 aspect-square w-full" />
            </div>
            <div>
              <div class="flex items-center gap-x-4 text-xs">
                <time :datetime="feed.newestItemPubdate" class="text-gray-500">{{ getReadableDate( feed.newestItemPubdate) }}</time>
              </div>
              <div class="group relative max-w-xl">
                <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <router-link :to="'/feed/' + feed.id">
                    <span class="absolute inset-0" />
                    {{ feed.title }}
                  </router-link>
                </h3>
                <p class="mt-5 text-sm leading-6 text-gray-600">{{ feed.description }}</p>
              </div>
              <div class="mt-6 flex border-t border-gray-900/5 pt-6">
                <div class="relative flex items-center gap-x-4">
                  <img :src="feed.image || '/images/image_not_available_170.webp'" alt="" class="h-10 w-10 rounded-full bg-gray-50" />
                  <div class="text-sm leading-6">
                    <p class="font-semibold text-gray-900">
                        {{ feed.author }}
                    </p>
                  </div>
                  <div class="text-sm leading-6 flex">
                    <router-link :to="'/feed/' + feed.id" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full flex">
                      <ArrowRightIcon class="h-5 w-5" />
                    </router-link>
                    <button @click="addFavourite(feed.id, feed.title)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                      <StarIcon class="h-5 w-5"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <button class="bg-indigo-700 hover:bg-pink-500 text-white font-bold py-2 px-4 mx-1 rounded-full flex" v-if="visibleCount < feeds.length" @click="loadMore">
            Load More ...
          </button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
<script>
const base_Url = import.meta.env.VITE_BASE_URL
import { ref } from 'vue'
const show = ref(false)
export default {

  data() {
    return {
      feeds: [], // Array to store podcasts
      visibleCount: 5,
      noResult:false,
    };
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(newQuery) {
        const queryParam = Object.keys(newQuery)[0];
        this.fetchSearchResults(queryParam, newQuery[queryParam]);
        this.noResult = false;
        this.error = false;
      },
    },
  },

  computed: {
    visibleFeeds() {
      return this.feeds.slice(0, this.visibleCount);
    }
  },
  created() {
    this.fetchSearchResults();
  },
  methods: {

    fetchSearchResults(param, value) {
      let url;
      if (param === 'q') {
        url = `${base_Url}api/search-feed-by-title/${value}`;
      } else if (param === 's') {
        url = `${base_Url}api/search-feeds-by-cat/${value}`;
      }

      if (url) {
        this.axios.get(url)
            .then(response => {
              this.feeds = response.data.feeds;

            })
            .catch(error => {
              console.error('Error fetching search results:', error);
              this.noResult = true;
            });
      }
    },

    loadMore() {
      const increment = 5; // Number of podcasts to add each time
      this.visibleCount = Math.min(this.visibleCount + increment, this.feeds.length);
    },

    getReadableDate(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);
      // Format the date as needed
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    addFavourite(feedId, feedTitle) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/add-favorite', {
            feed_id: feedId,
            title: feedTitle,
          }))
          .then(() => {
            show.value = true;
            setTimeout(() => {
              show.value = false;
            }, 5000);
          })
          .catch(error => {
            if (error.response && error.response.status === 401) {
              const authStore = useAuthStore();
              const messageStore = useMessageStore();
              authStore.clearUser();
              messageStore.setMessage('Your session has expired due to lack of activity.');
              this.$router.push({ name: 'Login' });
            } else {
              const messageStore = useMessageStore();
              messageStore.setMessage('To access this functionality you have to be logged in');
              this.$router.push({ name: 'Login' });
            }
          });
    }
  },

  mounted() {
    this.noResult = false; // Reset data when the component is mounted
  }


}
</script>