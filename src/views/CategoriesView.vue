<script setup>
import Footer from '../components/Footer.vue'
import {MagnifyingGlassIcon} from "@heroicons/vue/20/solid/index.js";
</script>
<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-4xl">
        <h1 class="mt-2 mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Explore Our Podcast Categories</h1>
        <p class="mt-2 text-lg leading-6 text-gray-900">
          Discover a wide range of podcast categories tailored to your interests. Whether you're into technology, health,
          entertainment, or education, we have something for everyone. Browse through our categories to find your next favorite podcast and dive into a world of engaging content.
        </p>
      </div>

      <div v-if="loading">
        <div class="grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div class="text-center">
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <button type="button" class="inline-flex items-center px-4 py-2 font-semibold leading-6 sm:text-3xl rounded-md text-3xl  text-indigo-700 bg-white hover:bg-white transition ease-in-out duration-150 cursor-not-allowed" disabled="">
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

      <div v-else class="mx-auto grid max-w-2xl lg:max-w-4xl grid-cols-1 gap-2 px-1 sm:grid-cols-2 sm:gap-x-1 sm:gap-y-0 sm:pt-24 lg:grid-cols-4 lg:gap-1 lg:px-3 xl:gap-1 pt-24">
        <div v-for="item in categories" :key="item.name" class="group relative -mx-1 flex gap-1 rounded-lg p-1 text-sm sm:flex-col sm:p-1">
          <div class="flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-pink-500 px-1 w-full">
            <MagnifyingGlassIcon class="h-3 w-3 text-gray-900 mr-2"/>
            <button @click="onClick(item.id)" class="font-semibold text-gray-900 py-1">
              {{ item.name }}
              <span class="absolute inset-0" />
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
export default {
  data() {
    return {
      categories:[],
      loading: true // Flag to indicate loading state
    };
  },

  created() {
    this.fetchSearchCat()
  },

  methods: {
    fetchSearchCat() {
      this.axios.get(base_Url + `api/feed-cat`)
          .then(response => {
            this.categories = response.data.feeds
            this.loading = false;
          })
          .catch(error => {
            console.error('Error fetching search results:', error);
            this.loading = false;
          });
    },
    onClick(id) {
      this.$router.push({ name: 'SearchResults', query: { s: id } });
    },
  },
};
</script>