<script setup>
import Footer from '../components/Footer.vue'
import {BookmarkIcon, PlayIcon, ArrowDownTrayIcon, StarIcon, CheckCircleIcon} from "@heroicons/vue/24/outline/index.js";
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

  <div v-if="feedInfo && !error" class="bg-white pb-24 sm:pb-32 pt-4 sm:pt-6">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-4xl">
        <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
          <article class="relative isolate flex flex-col gap-8 lg:flex-row">
            <div class="relative aspect-square lg:w-64 lg:shrink-0">
              <img :src="feedInfo.image || '/images/image_not_available_500.webp'" alt="" class="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover" />
              <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10 aspect-square w-full" />
            </div>
            <div>
              <div class="flex items-center gap-x-4 text-xs">
                <time :datetime="feedInfo.newestItemPubdate" class="text-gray-500">{{ feedInfo.datePublishedPretty }}</time>
              </div>
              <div class="group relative max-w-xl">
                <h1 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {{ feedInfo.title }}
                </h1>
                <p class="mt-5 text-sm leading-6 text-gray-600">{{ stripHtmlTags( feedInfo.description ) }}</p>
              </div>
              <div class="mt-6 flex border-t border-gray-900/5 pt-6">
                <div class="relative flex items-center gap-x-4">
                  <img :src="feedInfo.image || '/images/image_not_available_170.webp'" alt="" class="h-10 w-10 rounded-full bg-gray-50" />
                  <div class="text-sm leading-6 flex">
                    <button @click="addFavourite( feedInfo.id, feedInfo.title)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                      <StarIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
          <article v-for="episode in visibleEpisodes" :key="episode.id" class="relative isolate flex flex-col gap-8 lg:flex-row">
            <div>
              <div class="flex items-center gap-x-4 text-xs">
                <time :datetime="episode.datePublishedPretty" class="text-gray-500">{{ episode.datePublishedPretty }}</time>
              </div>
              <div class="group relative max-w-xl">
                <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <span class="text-gray-900 font-bold">
                    {{ episode.title }}
                    </span>
                </h3>
                <p class="mt-5 text-sm leading-6 text-gray-600">{{ stripHtmlTags(episode.description ) }}</p>
              </div>
              <div class="mt-6 flex border-b border-gray-900/5 pt-3 pb-6">
                <div class="relative flex items-center gap-x-4">
                  <div class="text-sm leading-6 flex">
                    <button @click="playEpisode(episode)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full flex">
                      <play-icon class="h-5 w-5" />
                    </button>
                    <button @click="addBookmarks(episode.id, episode.title)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                      <BookmarkIcon class="h-5 w-5"/>
                    </button>
                    <button @click="downloadPodcast(episode.title, episode.enclosureUrl, episode.id)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                      <ArrowDownTrayIcon class="h-5 w-5"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <button class="bg-indigo-700 hover:bg-pink-500 text-white font-bold py-2 px-4 mx-1 rounded-full flex" v-if="visibleCount < episodes.length" @click="loadMore"> Load More ...</button>
        </div>
      </div>
      <OffcanvasPlayer :episode="selectedEpisode" />
    </div>
  </div>

  <div v-else class="bg-white py-32 sm:py-40">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="text-center grid min-h-full place-items-center bg-white pb-24 sm:pb-32">
        <p class="text-base font-semibold text-indigo-600">404</p>
        <h1 class="my-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Not Found</h1>
        <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M331.453,495.829H180.547c-4.466,0-8.084,3.618-8.084,8.084c0,4.466,3.618,8.084,8.084,8.084h150.905 c4.466,0,8.084-3.618,8.084-8.084C339.537,499.447,335.918,495.829,331.453,495.829z"></path> <path d="M471.579,291.031c-3.308,0-6.525,0.399-9.603,1.152l-43.258-72.673c5.128-3.715,10.032-7.885,14.65-12.501 c47.28-47.281,47.28-124.211,0-171.492C398.734,0.884,348.198-8.377,305.054,7.722C289.244,2.597,272.758,0,256,0 C168.333,0,97.011,71.323,97.011,158.988v21.558c0,28.232,22.969,51.2,51.2,51.2h149.419 c34.185,15.426,74.106,14.207,107.386-3.649l42.292,71.052c-9.8,7.383-16.148,19.115-16.148,32.302 c0,0.907,0.029,1.803,0.088,2.695h-51.714l6.961-27.842c2.229-8.917,0.264-18.186-5.393-25.432 c-5.657-7.245-14.173-11.4-23.364-11.4H154.264c-9.192,0-17.708,4.155-23.364,11.4c-5.657,7.246-7.622,16.516-5.393,25.432 l6.961,27.842H80.754c0.059-0.891,0.088-1.788,0.088-2.695c0-22.289-18.132-40.421-40.421-40.421S0,309.162,0,331.451 c0,19.52,13.909,35.853,32.337,39.609v70.875H20.809c-5.557,0-10.803,2.431-14.393,6.67c-3.592,4.238-5.128,9.812-4.215,15.293 l6.892,41.344c0.734,4.403,4.888,7.387,9.303,6.644c4.403-0.734,7.379-4.899,6.645-9.303l-6.891-41.343 c-0.179-1.071,0.301-1.829,0.601-2.185c0.302-0.356,0.97-0.953,2.057-0.953h39.225c1.086,0,1.755,0.597,2.057,0.953 c0.302,0.356,0.78,1.113,0.602,2.184L55.8,502.583c-0.734,4.404,2.242,8.569,6.645,9.303c0.451,0.077,0.898,0.112,1.339,0.112 c3.882,0,7.306-2.802,7.965-6.756l6.892-41.345c0.913-5.48-0.623-11.053-4.215-15.292c-3.592-4.238-8.838-6.67-14.393-6.67 H48.505V371.06c12-2.447,22.085-10.227,27.659-20.746h60.346l17.252,69.006c5.709,22.834,26.134,38.783,49.672,38.783h105.135 c23.538,0,43.963-15.948,49.672-38.782l17.252-69.007h60.345c6.788,12.811,20.263,21.558,35.743,21.558 c22.289,0,40.421-18.132,40.421-40.421C512,309.163,493.868,291.03,471.579,291.031z M148.21,215.578 c-19.317,0-35.032-15.715-35.032-35.032v-21.558c0-78.751,64.069-142.82,142.821-142.82c9.083,0,18.077,0.848,26.899,2.532 c-7.466,4.713-14.526,10.319-21.024,16.816c-14.463,14.464-24.502,31.704-30.116,50.019c-5.77-3.045-12.251-4.693-18.874-4.693 c-22.289,0-40.421,18.131-40.421,40.42s18.132,40.421,40.421,40.421c6.623,0,13.104-1.648,18.874-4.693 c5.615,18.315,15.653,35.554,30.116,50.019c3.054,3.053,6.232,5.91,9.517,8.569H148.21z M227.907,140.305 c-4.256,3.382-9.471,5.211-15.023,5.211c-13.372,0-24.253-10.88-24.253-24.253s10.88-24.253,24.253-24.253 c5.552,0,10.768,1.828,15.023,5.211C225.918,114.83,225.918,127.696,227.907,140.305z M273.309,195.576 c-40.977-40.975-40.977-107.649,0-148.624c20.486-20.489,47.399-30.733,74.312-30.733c26.913,0,53.826,10.244,74.312,30.732 c40.977,40.975,40.977,107.649,0,148.624C380.959,236.552,314.283,236.552,273.309,195.576z M40.421,355.703 c-13.372,0-24.253-10.88-24.253-24.253c0-13.372,10.88-24.253,24.253-24.253c13.372,0,24.253,10.88,24.253,24.253 S53.793,355.703,40.421,355.703z M370.808,302.382l-7.941,31.764h-85.309c-4.466,0-8.084,3.618-8.084,8.084 c0,4.466,3.618,8.084,8.084,8.084h81.265l-16.272,65.084c-3.905,15.624-17.881,26.536-33.985,26.536H203.431 c-16.104,0-30.08-10.912-33.985-26.536l-28.255-113.017c-1.014-4.053-0.121-8.266,2.45-11.559 c2.572-3.294,6.443-5.182,10.62-5.182h203.474c4.178,0,8.049,1.888,10.62,5.182C370.927,294.116,371.821,298.329,370.808,302.382 z M471.579,355.703c-10.488,0-19.442-6.693-22.818-16.03c-0.033-0.096-0.067-0.192-0.102-0.288 c-0.862-2.487-1.332-5.157-1.332-7.934c0-9.803,5.845-18.265,14.235-22.086c0.077-0.033,0.153-0.067,0.23-0.102 c2.994-1.327,6.308-2.064,9.788-2.064c13.372,0,24.253,10.88,24.253,24.253S484.951,355.703,471.579,355.703z"></path> <path d="M191.326,376.184c-4.466,0-8.084,3.618-8.084,8.084v1.078c0,4.466,3.618,8.084,8.084,8.084 c4.466,0,8.084-3.618,8.084-8.084v-1.078C199.411,379.802,195.792,376.184,191.326,376.184z"></path> <path d="M309.895,393.43c4.466,0,8.084-3.618,8.084-8.084v-1.078c0-4.466-3.618-8.084-8.084-8.084 c-4.466,0-8.084,3.618-8.084,8.084v1.078C301.811,389.81,305.429,393.43,309.895,393.43z"></path> <path d="M406.691,62.194c-15.778-15.778-36.756-24.467-59.07-24.467s-43.293,8.69-59.07,24.467 c-15.777,15.777-24.467,36.755-24.467,59.069s8.69,43.292,24.467,59.069c15.778,15.778,36.756,24.467,59.07,24.467 s43.292-8.689,59.07-24.467c15.777-15.777,24.467-36.755,24.467-59.069S422.469,77.972,406.691,62.194z M395.256,168.898 c-12.722,12.726-29.641,19.733-47.635,19.733s-34.912-7.007-47.635-19.733c-12.726-12.723-19.733-29.641-19.733-47.635 s7.007-34.912,19.733-47.634c12.722-12.726,29.641-19.733,47.635-19.733s34.913,7.007,47.635,19.732 c12.726,12.723,19.733,29.641,19.733,47.635C414.989,139.258,407.982,156.176,395.256,168.898z"></path> <path d="M223.663,376.184c-4.466,0-8.084,3.618-8.084,8.084v1.078c0,4.466,3.618,8.084,8.084,8.084 c4.466,0,8.084-3.618,8.084-8.084v-1.078C231.747,379.802,228.129,376.184,223.663,376.184z"></path> <path d="M212.884,301.809h-21.558c-10.401,0-18.863,8.463-18.863,18.863v21.558c0,10.401,8.463,18.863,18.863,18.863h21.558 c10.401,0,18.863-8.463,18.863-18.863v-21.558C231.747,310.271,223.285,301.809,212.884,301.809z M215.579,342.23 c0,1.486-1.208,2.695-2.695,2.695h-21.558c-1.486,0-2.695-1.208-2.695-2.695v-21.558c0-1.486,1.208-2.695,2.695-2.695h21.558 c1.486,0,2.695,1.208,2.695,2.695V342.23z"></path> </g> </g> </g> </g></svg>
        <p class="mt-6 text-base leading-7 text-gray-600">
          We're sorry, but we are unable to find the feed you are looking for. It may have been deleted or moved. Please use the search input field above and enter the title of the podcast to search again. We appreciate your understanding and hope you find what you're looking for!
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <router-link to="/feed_listing" class="bg-pink-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 mx-1 rounded-full">Back to listing &nbsp<span aria-hidden="true">&rarr;</span></router-link>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>
<script>
import OffcanvasPlayer from '../components/OffcanvasPlayer.vue';
const base_Url = import.meta.env.VITE_BASE_URL
import { ref } from 'vue'
const show = ref(false)

export default {
  components: {
    OffcanvasPlayer
  },

  data() {
    return {
      feedInfo:[],
      episodes: [],
      error:null,
      selectedEpisode: null,
      visibleCount: 10,
    };
  },
  computed: {
    visibleEpisodes() {
      return this.episodes.slice(0, this.visibleCount);
    }
  },
  created() {
    const feedId = this.$route.params.id;
    this.fetchFeedInfo(feedId);
    this.fetchEpisodes(feedId);
  },

  methods: {
    loadMore() {
      const increment = 5; // Number of podcasts to add each time
      this.visibleCount = Math.min(this.visibleCount + increment, this.episodes.length);
    },
    playEpisode(episode) {
      this.selectedEpisode = episode;
    },
    stripHtmlTags(str) {
      if (!str) return '';
      return str.replace(/<[^>]*>/g, ''); // Regular expression to remove HTML tags
    },

    fetchFeedInfo(feedId) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.get(base_Url + `api/feed_info/${feedId}`))
          .then(response => {
            this.feedInfo = response.data.feed;
            if (!this.feedInfo || Object.keys(this.feedInfo).length === 0) {
              this.error = "No podcast information found.";
            }
          })
          .catch(error => {
            this.error = error;
            console.error('Error fetching episodes:', error);
          });
    },

    fetchEpisodes(feedId) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.get(base_Url + `api/search_feed/${feedId}`))
          .then(response => {
            this.episodes = response.data.items;
          })
          .catch(error => {
            console.error('Error fetching episodes:', error);
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

            // Auto-hide the notification after 3 seconds
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

    sendDownloadData(id, title) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/add_download_click', {
            episode_id: id,
            episode_title: title,
          }))
          .then(response => {
            console.log('Download data sent');
          })
          .catch(error => {
            console.error('Error sending download data:', error);
          });
    },

    downloadPodcast(title, url, id) {
      //to download
      const sanitizedTitle = this.sanitizeFilename(title) + '.mp3';
      //to DB
      const dbTitle = this.sanitizeFilename(title);

      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', sanitizedTitle); // Suggests a filename to save as
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.sendDownloadData(id, dbTitle);
    },

    sanitizeFilename(title) {
      // Strip any HTML tags
      let cleanTitle = title.replace(/<\/?[^>]+(>|$)/g, "");
      // Remove characters that are not allowed in filenames
      cleanTitle = cleanTitle.replace(/[\?\*\/\\\|:"<>]+/g, '');
      // Trim whitespace and replace spaces with underscores
      cleanTitle = cleanTitle.trim().replace(/\s+/g, '_');
      return cleanTitle;
    },

    addBookmarks(episodeId, episodeTitle) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/add-bookmark', {
            episode_id: episodeId,
            title: episodeTitle,
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
  }
};
</script>