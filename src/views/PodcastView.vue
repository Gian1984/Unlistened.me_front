<script setup>
import Footer from '../components/Footer.vue'
import { StarIcon, PlayIcon } from '@heroicons/vue/24/outline/index.js'
</script>
<template>


  <div v-if="loading">
    <div class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div class="text-center">
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">We are looking for</h1>
        <p class="mt-6 text-base leading-7 text-gray-600">the most listened podcasts for you.</p>
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
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
          <p class="mt-2 text-lg leading-8 text-gray-600">Learn how to grow your business with our expert advice.</p>
          <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            <article v-for="(podcast, index) in visiblePodcasts" :key="podcast.id"  class="relative isolate flex flex-col gap-8 lg:flex-row">
              <div class="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                <img :src="podcast.image" alt="" class="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover" />
                <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div>
                <div class="flex items-center gap-x-4 text-xs">
                  <time :datetime="podcast.newestItemPubdate" class="text-gray-500">{{ getReadableDate( podcast.newestItemPublishTime) }}</time>
                </div>
                <div class="group relative max-w-xl">
                  <h3 class="mt-3 text-lg font-bold leading-6 text-gray-900 group-hover:text-indigo-600">
                    <router-link :to="'/podcast/' + podcast.id">
                        <span class="text-gray-900 font-bold hover:text-indigo-600">
                        {{ podcast.title }}
                        </span>
                    </router-link>
                  </h3>
                  <p class="mt-5 text-sm leading-6 text-gray-600 text-ellipsis overflow-hidden">{{ stripHtmlTags(podcast.description ) }}</p>
                  <div class="mt-5">
                    <span class="font-semibold text-gray-900">Categories:</span>
                  </div>
                  <div class="flex items-center gap-x-1" v-for="category in podcast.categories">
                    <span  class="text-gray-600">{{ category }}</span>
                  </div>
                </div>
                <div class="mt-6 flex border-t border-gray-900/5 pt-6">
                  <div class="relative flex items-center gap-x-6">
                    <img :src="podcast.artwork" alt="" class="h-10 w-10 rounded-full bg-gray-50" />
                    <div class="text-sm leading-6">
                      <div>
                        <span  class="text-gray-600">Author:</span>
                      </div>
                      <p class="font-semibold text-gray-900">
                          <span class="" />
                          {{ podcast.author }}
                      </p>
                    </div>
                    <div class="text-sm leading-6 flex">
                      <router-link :to="'/podcast/' + podcast.id" class="bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded-full flex">
                        <play-icon class="h-5 w-5" />
                      </router-link>
                      <button @click="addFavourite(podcast.id, podcast.title)" class="bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                        <StarIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <button class="text-gray-600" v-if="visibleCount < podcasts.length" @click="loadMore">Load More</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
<script>
const base_Url = import.meta.env.VITE_BASE_URL
export default {

  data() {
    return {
      podcasts: [], // Array to store podcasts
      visibleCount: 5,
      loading: true // Flag to indicate loading state
    };
  },
  computed: {
    visiblePodcasts() {
      return this.podcasts.slice(0, this.visibleCount);
    }
  },

  created() {
    this.fetchPodcasts();
  },

  methods: {
     fetchPodcasts() {
      this.axios.get(base_Url + 'api/index')
          .then(response => {
            this.podcasts= response.data.feeds
            console.log(this.podcasts)
            this.loading = false;
          })
          .catch(error => {
            console.error(error, 'nothing to display');
            this.loading = false;
          });
    },

    loadMore() {
      const increment = 5; // Number of podcasts to add each time
      this.visibleCount = Math.min(this.visibleCount + increment, this.podcasts.length);
    },

    async addFavourite(podcastId, podcastTitle) {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        const response = await this.axios.post(base_Url + 'api/add-favorite', {
          podcast_id: podcastId,
          title: podcastTitle,
        });
        console.log(' successful', response.data);

      } catch (error) {

        console.error('Login error', error);

      }
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