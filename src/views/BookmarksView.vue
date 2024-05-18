<script setup>
import {
  ArrowRightIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import {
  BookmarkIcon,
} from '@heroicons/vue/24/solid'
import Footer from '../components/Footer.vue'
import {useAuthStore} from "@/stores/authStore.js";
import { useMessageStore } from '@/stores/messageStore'
</script>

<template>
  <div class="bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm pb-12">
        <img class="mx-auto h-24 w-auto" src="/images/unlistened.me_white_300.png" alt="Unlistened.me logo" />
      </div>
      <p class="text-base font-semibold leading-7 text-indigo-600">Your Treasure Trove of Tunes & Talks</p>
      <h2 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">& Bookmarks</h2>
      <p class="mt-6 text-lg leading-8 text-gray-900">
        Ahoy there, podcast pirates! Welcome aboard your Bookmark Bonanza, where every saved episode
        is a gem just waiting to be unearthed. Navigate through your treasured collection of mind-boggling mysteries,
        laugh-out-loud comedies, and brain-boosting documentaries.
        Ready to revisit your favorites or discover new audio adventures?
        Your playlist paradise awaits—let the binge-listening begin!
      </p>
    </div>
  </div>

  <div v-if="bookmarks" class="bg-white px-6 pb-24 sm:pb-32 lg:px-8">
    <div v-for="(bookmark, index) in bookmarks" :key="bookmark.id" class="bg-indigo-600 border-solid border-4 border-white rounded-2xl">
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
            <router-link :to="'/podcast/' + bookmark.episode_id" type="button" class="py-2 px-4 mx-1 rounded-full flex items-center justify-center border border-transparent bg-white text-sm font-medium text-indigo-600 shadow-sm hover:bg-pink-500 hover:text-white w-full">
              <ArrowRightIcon class="h-6" aria-hidden="true" />
            </router-link>
          </div>
          <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button @click="deleteBookmark(bookmark.episode_id, index)" type="button" class="-mr-1 py-2 px-4 mx-1 rounded-full flex hover:bg-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 text-white hover:text-red-600">
              <span class="sr-only">Dismiss</span>
              <TrashIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!bookmarks[0]" class="text-center grid min-h-full place-items-center bg-white pb-24 sm:pb-32">
      <p class="text-base font-semibold text-indigo-600">No Bookmarks Yet?</p>
      <h1 class="my-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Let's Discover Some!</h1>
      <svg version="1.1" width="200" height="200" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><g> <path class="st0" d="M133.234,478.948l-21.141-68.984c2.656-3.203,4.141-7.296,3.813-11.671 c-0.688-9.375-9.25-16.438-19.156-15.797c-9.906,0.656-17.375,8.766-16.688,18.141c0.516,6.984,5.406,12.671,11.938,14.875 l21.141,68.984c-2.656,3.188-4.141,7.281-3.813,11.672c0.688,9.359,9.266,16.438,19.156,15.797 c9.906-0.656,17.375-8.781,16.688-18.141C144.656,486.839,139.781,481.151,133.234,478.948z"></path> <path class="st0" d="M40.953,438.651c-7.078,1.844-11.234,8.781-9.297,15.484l7.984,27.422c1.938,6.703,9.266,10.641,16.344,8.797 l38.016-9.5l-15.031-51.703L40.953,438.651z"></path> <path class="st0" d="M192.125,401.527c-37.25,11.296-62.797,16.187-62.797,16.187L144,462.12c0,0,50.578-12.813,112-35.109 c61.422,22.297,112,35.109,112,35.109l14.672-44.406c0,0-25.547-4.891-62.797-16.187c54.813-24.141,107.875-54.375,134.625-88.75 c53.984-69.359,26.734-125.938,26.734-125.938s-4.125-9.469-9.656,8.75c-32.203,92.281-132,150.094-215.578,183.547 c-83.578-33.453-183.375-91.266-215.578-183.547c-5.531-18.219-9.656-8.75-9.656-8.75S3.516,243.417,57.5,312.777 C84.25,347.152,137.313,377.386,192.125,401.527z"></path> <path class="st0" d="M420,415.511c6.531-2.203,11.422-7.89,11.938-14.875c0.688-9.375-6.781-17.484-16.688-18.141 c-9.906-0.641-18.469,6.422-19.156,15.797c-0.328,4.375,1.156,8.469,3.813,11.671l-21.141,68.984 c-6.547,2.203-11.422,7.891-11.938,14.875c-0.688,9.359,6.781,17.484,16.688,18.141c9.891,0.641,18.469-6.438,19.156-15.797 c0.328-4.391-1.156-8.484-3.813-11.672L420,415.511z"></path> <path class="st0" d="M471.047,438.651l-38.016-9.5L418,480.854l38.016,9.5c7.078,1.844,14.406-2.094,16.344-8.797l7.984-27.422 C482.281,447.433,478.125,440.495,471.047,438.651z"></path> <path class="st0" d="M187.141,274.871v28.578c0,5.156,4.188,9.344,9.359,9.344h22.813c5.172,0,9.359-4.188,9.359-9.344v-23.922 h7.797v23.922c0,5.156,4.188,9.344,9.344,9.344h22.828c5.172,0,9.359-4.188,9.359-9.344v-23.922h7.781v23.922 c0,5.156,4.188,9.344,9.359,9.344h22.828c5.156,0,9.344-4.188,9.344-9.344v-28.578c23.781-7.219,63.5-23.984,77-57.859 c9.828-24.641,5.984-57.063-8.719-119.578C380.875,34.917,338.125-0.004,257.234-0.004c-80.906,0-123.656,34.922-138.359,97.438 c-14.719,62.516-18.563,94.938-8.734,119.578C123.641,250.886,163.359,267.652,187.141,274.871z M313.672,112.808 c21.516-3.672,42.5,14.031,46.859,39.547s-9.547,49.188-31.063,52.875c-21.516,3.672-42.5-14.031-46.859-39.547 C278.25,140.152,292.156,116.496,313.672,112.808z M257.234,197.558l20.672,25.859h-20.672h-20.688L257.234,197.558z M153.922,152.355c4.375-25.516,25.344-43.219,46.859-39.547c21.531,3.688,35.438,27.344,31.063,52.875 c-4.359,25.516-25.344,43.219-46.859,39.547C163.469,201.542,149.563,177.871,153.922,152.355z"></path> </g> </g></svg>
      <p class="mt-6 text-base leading-7 text-gray-600">
        Ahoy, mateys! Set sail and embark on a quest to unearth hidden treasures and bountiful booty!
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <router-link to="/podcast_listing" class="bg-pink-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 mx-1 rounded-full">Start now &nbsp<span aria-hidden="true">&rarr;</span></router-link>
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
        if (error.response.status === 401) {
          const authStore = useAuthStore();
          authStore.clearUser();
          const messageStore = useMessageStore()
          messageStore.setMessage('Yours session has expire due to lack of activity.')
          this.$router.push({name: 'Login'});
        }
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
        if (error.response.status === 401) {
          const authStore = useAuthStore();
          authStore.clearUser();
          const messageStore = useMessageStore()
          messageStore.setMessage('Yours session has expire due to lack of activity.')
          this.$router.push({ name: 'Login' });
        } else {
          const authStore = useAuthStore();
          authStore.clearUser();
          const messageStore = useMessageStore()
          messageStore.setMessage('Something went wrong, please try again.')
          this.$router.push({ name: 'Login' });
        }
      }
    },
  }
};
</script>