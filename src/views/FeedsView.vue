<script setup>
import Footer from '../components/Footer.vue'
import {StarIcon, ArrowRightIcon, CheckCircleIcon, ArrowPathIcon} from '@heroicons/vue/24/outline/index.js'
import {useAuthStore} from "@/stores/authStore.js";
let authStore = useAuthStore();
authStore.initializeAuth();
import {useMessageStore} from "@/stores/messageStore.js";
import {XMarkIcon} from "@heroicons/vue/20/solid/index.js";
let messageStore = useMessageStore();
messageStore.initializeMessage();
</script>
<template>

  <!--  Notification  -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 border-2 border-green-500">
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

  <div v-if="loading">
    <div class="grid h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm pb-8 sm:pb-24">
        <img class="mx-auto h-24 sm:h-48 w-auto" src="/images/unlistened.me_white_300.png" alt="Unlistened.me logo" />
      </div>
      <div class="text-center">
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Hang tight!</h1>
        <p class="mt-6 text-base leading-7 text-gray-900">We're getting the latest updates to bring you the freshest podcast</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <button type="button" class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-indigo-700 bg-white hover:bg-white transition ease-in-out duration-150 cursor-not-allowed" disabled="">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            loading...
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <div class="bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-4xl">
          <p class="text-base font-semibold leading-7 text-indigo-600">Welcome!</p>
          <h1 class="mt-2 mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Dive into the podcast world</h1>
          <p class="mt-2 text-lg leading-6 text-gray-900">
            Here, you can browse through our comprehensive list of podcast feeds,
            featuring a variety of genres that cater to all tastes and interests.
            <br><br>
            Whether you're in the mood for thrilling mysteries, educational content, or light-hearted comedy,
            our expansive library has something for everyone.
            Dive in, explore at your leisure, and uncover new favorites that resonate with your unique preferences.
            Happy listening!
          </p>
          <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            <article v-for="(feed, index) in visiblePodcasts" :key="index"  class="relative isolate flex flex-col gap-8 lg:flex-row">
              <div class="relative aspect-square lg:w-64 lg:shrink-0">
                <img :src="feed.image || '/images/image_not_available_500.webp'" alt="" class="absolute inset-0 aspect-square w-full rounded-2xl bg-gray-50 object-cover" />
                <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10 aspect-square w-full" />
              </div>
              <div>
                <div class="flex items-center gap-x-4 text-xs">
                  <time :datetime="feed.newestItemPubdate" class="text-gray-500">{{ getReadableDate( feed.newestItemPublishTime) }}</time>
                </div>
                <div class="group relative max-w-xl">
                  <h3 class="mt-3 text-lg font-bold leading-6 text-gray-900 group-hover:text-indigo-600">
                    <router-link :to="'/feed/' + feed.id">
                        <span class="text-gray-900 font-bold hover:text-indigo-600">
                        {{ feed.title }}
                        </span>
                    </router-link>
                  </h3>
                  <p class="mt-5 text-sm leading-6 text-gray-600 text-ellipsis overflow-hidden">{{ stripHtmlTags(feed.description ) }}</p>
                  <div class="mt-5">
                    <span class="font-semibold text-gray-900">Categories:</span>
                  </div>
                  <div class="flex items-center gap-x-1" v-for="category in feed.categories">
                    <span  class="text-gray-600">{{ category }}</span>
                  </div>
                </div>
                <div class="mt-6 flex border-t border-gray-900/5 pt-6">
                  <div class="relative flex items-center gap-x-6">
                    <img :src="feed.artwork || '/images/image_not_available_170.webp'" alt="" class="h-10 w-10 rounded-full bg-gray-50" />
                    <div class="text-sm leading-6">
                      <div>
                        <span  class="text-gray-600">Author:</span>
                      </div>
                      <p class="font-semibold text-gray-900">
                          {{ feed.author }}
                      </p>
                    </div>
                    <div class="text-sm leading-6 flex">
                      <button @click="addFavourite(feed.id, feed.title)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                        <StarIcon class="h-5 w-5" />
                      </button>
                      <router-link :to="'/feed/' + feed.id" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full flex">
                        <ArrowRightIcon class="h-5 w-5" />
                      </router-link>
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
      loading: true // Flag to indicate loading state
    };
  },
  computed: {
    visiblePodcasts() {
      return this.feeds.slice(0, this.visibleCount);
    }
  },

  created() {
    this.fetchPodcasts();
  },

  methods: {
     fetchPodcasts() {
      this.axios.get(base_Url + 'api/index')
          .then(response => {
            this.feeds= response.data.feeds
            this.loading = false;
          })
          .catch(error => {
            console.error(error, 'nothing to display');
            this.loading = false;
          });
    },

    loadMore() {
      const increment = 5; // Number of podcasts to add each time
      this.visibleCount = Math.min(this.visibleCount + increment, this.feeds.length);
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
    },

    stripHtmlTags(str) {
      if (!str) return '';
      return str.replace(/<[^>]*>/g, ''); // Regular expression to remove HTML tags
    },

    getReadableDate(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);
      // Format the date as you need
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

}
</script>