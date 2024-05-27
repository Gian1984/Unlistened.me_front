<script setup>
import Footer from '../components/Footer.vue'
import OffcanvasPlayer from '../components/OffcanvasPlayer.vue';
import {ArrowDownTrayIcon, ArrowRightIcon, BookmarkIcon, PlayIcon, StarIcon} from "@heroicons/vue/24/outline/index.js";
</script>
<template>
  <div class="bg-white pb-24 sm:pb-32 pt-4 sm:pt-6">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-4xl">
        <div class="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
          <article class="relative isolate flex flex-col gap-8 lg:flex-row">
            <div class="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
              <img :src="episode.image" alt="" class="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover" />
              <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
            </div>
            <div>
              <div class="flex items-center gap-x-4 text-xs">
                <time :datetime="episode.newestItemPubdate" class="text-gray-500">{{ episode.datePublishedPretty }}</time>
              </div>
              <div class="group relative max-w-xl">
                <h1 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {{ episode.title }}
                </h1>
                <p class="mt-5 text-sm leading-6 text-gray-600">{{ stripHtmlTags(episode.description ) }}</p>
              </div>
              <div class="mt-6 flex border-t border-gray-900/5 pt-6">
                <div class="relative flex items-center gap-x-4">
                  <img :src="episode.image" alt="" class="h-10 w-10 rounded-full bg-gray-50" />
                  <div class="text-sm leading-6 flex">
                    <div class="text-sm leading-6 flex">
                      <button @click="playEpisode(episode)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full flex">
                        <play-icon class="h-5 w-5" />
                      </button>
                      <button @click="downloadPodcast(episode.title, episode.enclosureUrl)" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full">
                        <ArrowDownTrayIcon class="h-5 w-5"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

      </div>
    </div>
  </div>
  <OffcanvasPlayer :episode="selectedEpisode" />
  <Footer />
</template>
<script>
const base_Url = import.meta.env.VITE_BASE_URL
export default {
  data() {
    return {
      episode: [],
      selectedEpisode: null,
    };
  },
  async created() {
    const podcastId = this.$route.params.id;
    await this.fetchEpisode(podcastId);
  },

  methods: {
    playEpisode(episode) {
      this.selectedEpisode = episode;
    },
    stripHtmlTags(str) {
      if (!str) return '';
      return str.replace(/<[^>]*>/g, ''); // Regular expression to remove HTML tags
    },

    async fetchEpisode(podcastId) {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        const response = await this.axios.get(base_Url + `api/search_episode/${podcastId}`);
        this.episode = response.data.episode;
        console.log(response)

      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    },

    downloadPodcast(title, url) {
      const sanitizedTitle = this.sanitizeFilename(title) + '.mp3';

      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', sanitizedTitle); // Suggests a filename to save as
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

    async addBookmarks(episodeId, episodeTitle) {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        const response = await this.axios.post(base_Url + 'api/add-bookmark', {
          episode_id: episodeId,
          title: episodeTitle,
        });

      } catch (error) {

        console.error('Login error', error);

      }
    },
  }
};
</script>