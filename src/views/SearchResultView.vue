<script setup>
import Footer from '../components/Footer.vue'
import {PlayIcon, StarIcon} from "@heroicons/vue/24/outline/index.js";
</script>
<template>

  <div v-if="noResult">
    <div class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div class="text-center">
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Sorry</h1>
        <p class="mt-6 text-xl font-bold  leading-7 text-gray-900">but your search returned no results.</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.7071 4.69719C19.0976 4.30667 19.7308 4.30667 20.1213 4.69719L28.6066 13.1825C28.9971 13.573 28.9971 14.2062 28.6066 14.5967C28.216 14.9872 27.5829 14.9872 27.1924 14.5967L18.7071 6.1114C18.3166 5.72088 18.3166 5.08771 18.7071 4.69719Z" fill="#333333"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M28.7071 4.7068C29.0976 5.09733 29.0976 5.73049 28.7071 6.12102L20.2218 14.6063C19.8313 14.9968 19.1981 14.9968 18.8076 14.6063C18.4171 14.2158 18.4171 13.5826 18.8076 13.1921L27.2929 4.7068C27.6834 4.31628 28.3166 4.31628 28.7071 4.7068Z" fill="#333333"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M24.3162 15.0513C24.111 14.9829 23.8891 14.9829 23.6838 15.0513L8.86851 19.9889C8.64603 20.063 8.463 20.2102 8.34247 20.3985L4.39805 25.4613C4.1985 25.7175 4.13573 26.0545 4.2297 26.3653C4.32367 26.6761 4.56269 26.922 4.87072 27.0246L8.19325 28.1319L8.19595 36.7634C8.19636 38.0544 9.02257 39.2003 10.2473 39.6085L23.6291 44.0691C23.7475 44.1164 23.8738 44.1406 24.0009 44.1405C24.1293 44.141 24.2569 44.1168 24.3765 44.069L37.7577 39.6086C38.9827 39.2003 39.8089 38.054 39.809 36.7628L39.8096 28.1328L43.1346 27.0246C43.4427 26.922 43.6817 26.6761 43.7757 26.3653C43.8696 26.0545 43.8069 25.7175 43.6073 25.4613L39.6117 20.3327C39.4927 20.176 39.3274 20.0542 39.1315 19.9889L24.3162 15.0513ZM9.54341 22.1112L22.346 26.378L19.6478 29.8413L6.8452 25.5745L9.54341 22.1112ZM24.0025 24.8203L35.6526 20.9376L24 17.0541L12.35 20.9367L24.0025 24.8203ZM10.196 36.7628L10.1935 28.7986L19.686 31.9622C20.088 32.0962 20.5307 31.9623 20.7911 31.6281L23.0003 28.7924L23.0001 41.7513L10.8797 37.7112C10.4715 37.5751 10.1961 37.1931 10.196 36.7628ZM37.8095 28.7993L28.3193 31.9622C27.9174 32.0962 27.4747 31.9623 27.2143 31.6281L25.0013 28.7876L25.0049 41.7514L37.1252 37.7113C37.5336 37.5752 37.809 37.1931 37.809 36.7627L37.8095 28.7993ZM28.3576 29.8413L25.6583 26.3767L38.4609 22.1099L41.1602 25.5745L28.3576 29.8413Z" fill="#333333"></path> <path d="M34.8163 33.5348L31.103 34.9561C30.9783 35.0029 30.866 35.1482 30.8521 35.2806C30.8382 35.4131 30.928 35.4825 31.0527 35.4357L34.766 34.0144C34.8906 33.9676 35.003 33.8223 35.0169 33.6899C35.0308 33.5574 34.941 33.488 34.8163 33.5348Z" fill="#333333"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M35.0634 32.0995C35.9145 31.7803 36.5276 32.2544 36.4327 33.1585C36.3378 34.0625 35.5709 35.0542 34.7197 35.3735L28.705 37.6581C27.8538 37.9774 27.2408 37.5033 27.3357 36.5992C27.4306 35.6951 28.1975 34.7034 29.0486 34.3842L35.0634 32.0995ZM28.2066 36.2729C28.2303 36.0469 28.4722 35.7801 28.7469 35.6771C29.0216 35.5741 29.225 35.6738 29.2013 35.8998C29.1776 36.1258 28.9357 36.3926 28.661 36.4956C28.3863 36.5986 28.1829 36.4989 28.2066 36.2729ZM29.7175 35.5334C29.5802 35.5849 29.4592 35.7183 29.4473 35.8313C29.4355 35.9443 29.5372 35.9942 29.6745 35.9427C29.8119 35.8912 29.9328 35.7578 29.9447 35.6448C29.9566 35.5318 29.8548 35.4819 29.7175 35.5334ZM34.7052 34.5931C35.1308 34.4334 35.5142 33.9376 35.5617 33.4855C35.6091 33.0335 35.3026 32.7965 34.877 32.9561L31.1638 34.3774C30.7382 34.5371 30.3547 35.0329 30.3073 35.485C30.2598 35.937 30.5664 36.1741 30.9919 36.0144L34.7052 34.5931Z" fill="#333333"></path> </g></svg>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-4xl">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Search result:</h2>
        <p class="mt-2 text-lg leading-8 text-gray-600">Learn how to grow your business with our expert advice.</p>
        <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
          <article v-for="podcast in podcasts" :key="podcast.id" class="relative isolate flex flex-col gap-8 lg:flex-row">
            <div class="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
              <img :src="podcast.image" alt="" class="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover" />
              <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
            </div>
            <div>
              <div class="flex items-center gap-x-4 text-xs">
                <time :datetime="podcast.newestItemPubdate" class="text-gray-500">{{ getReadableDate( podcast.newestItemPubdate) }}</time>
              </div>
              <div class="group relative max-w-xl">
                <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <router-link :to="'/podcast/' + podcast.id">
                    <span class="absolute inset-0" />
                    {{ podcast.title }}
                  </router-link>
                </h3>
                <p class="mt-5 text-sm leading-6 text-gray-600">{{ podcast.description }}</p>
              </div>
              <div class="mt-6 flex border-t border-gray-900/5 pt-6">
                <div class="relative flex items-center gap-x-4">
                  <img :src="podcast.artwork" alt="" class="h-10 w-10 rounded-full bg-gray-50" />
                  <div class="text-sm leading-6">
                    <p class="font-semibold text-gray-900">
                        {{ podcast.author }}
                    </p>
                  </div>
                  <div class="text-sm leading-6 flex">
                    <router-link :to="'/podcast/' + podcast.id" class="bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded-full flex">
                      <play-icon class="h-5 w-5" />
                    </router-link>
                    <button @click="addFavourite(podcast.id, podcast.title)" class="bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                      <StarIcon class="h-5 w-5"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
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
      noResult:false,
    };
  },
  watch: {
    '$route.query.q': function(newQuery) {
      this.fetchSearchResults(newQuery);
      this.noResult = false;
      this.error = false;
    }
  },
  created() {
    const podcastTitle = this.$route.query.q;
    this.fetchSearchResults(podcastTitle);
  },
  methods: {
    fetchSearchResults(podcastTitle) {
      this.axios.get(base_Url + `api/search-podcast/${podcastTitle}`)
          .then(response => {
            this.podcasts = ''
            console.log(response.data.feeds)
            this.podcasts = response.data.feeds
            if (this.podcasts == ''){
              this.noResult = true;
            }
          })
          .catch(error => {
            console.error('Error fetching search results:', error);
            this.noResult = true;
          });
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
    },

    async addFavourite(podcastId, podcastTitle) {
      console.log(podcastId, podcastTitle)
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
  },


  mounted() {
    this.noResult = false; // Reset data when the component is mounted
  }


}
</script>