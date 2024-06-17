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
      <div class="mx-auto grid max-w-2xl lg:max-w-4xl grid-cols-1 gap-2 px-1 sm:grid-cols-2 sm:gap-x-1 sm:gap-y-0 sm:pt-24 lg:grid-cols-4 lg:gap-1 lg:px-3 xl:gap-1 pt-24">
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
          })
          .catch(error => {
            console.error('Error fetching search results:', error);
          });
    },
    onClick(id) {
      this.$router.push({ name: 'SearchResults', query: { s: id } });
    },
  },
};
</script>