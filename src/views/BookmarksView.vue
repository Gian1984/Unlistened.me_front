<script setup>
import {
  PlayIcon,
  BookmarkIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <p class="text-base font-semibold leading-7 text-indigo-600">Yours</p>
      <h2 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Bookmarks</h2>
      <p class="mt-6 text-lg leading-8 text-gray-600">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
    </div>
  </div>


  <div v-for="(bookmark, index) in bookmarks" :key="bookmark.id" class="bg-indigo-600 border-solid border-4 border-white">
    <div class="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-center justify-between">
        <div class="flex w-0 flex-1 items-center">
            <span class="flex rounded-lg bg-indigo-800 p-2">
              <BookmarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </span>
          <p class="ml-3 truncate font-medium text-white">
            <span>{{bookmark.title}}</span>
          </p>
        </div>
        <div class="order-3 mt-2 flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto w-full">
          <router-link :to="'/podcast/' + bookmark.episode_id" type="button" class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 w-full">
            <play-icon class="h-6 text-indigo-800" aria-hidden="true" />
          </router-link>
        </div>
        <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <button @click="deleteBookmark(bookmark.episode_id, index)" type="button" class="-mr-1 flex rounded-md p-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
            <span class="sr-only">Dismiss</span>
            <TrashIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </button>
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
      bookmarks: [],
    };
  },

  created() {
    const podcastId = this.$route.params.id;
    this.fetchBookmarks();
  },
  methods: {
    loadMore() {
      const increment = 5; // Number of podcasts to add each time
      this.visibleCount = Math.min(this.visibleCount + increment, this.episodes.length);
    },

    async fetchBookmarks() {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url+'sanctum/csrf-cookie');

        const response = await this.axios.get(base_Url+'api/user-bookmarks');

        console.log('get bookmarks successful', response);
        this.bookmarks = response.data

      } catch (error) {
        console.error('Login error', error);

      }
    },
    async deleteBookmark(episodeId, index) {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        const response = await this.axios.post(base_Url + 'api/delete-bookmark', {
          episode_id: episodeId,
        });
        this.bookmarks.splice(index, 1);

      } catch (error) {
        console.error('Error removing', error);
      }
    },
  }
};
</script>