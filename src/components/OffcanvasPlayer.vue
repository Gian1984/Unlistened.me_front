<script setup>
import { PauseIcon, XMarkIcon} from "@heroicons/vue/24/solid/index.js";
import {PlayIcon} from "@heroicons/vue/24/outline/index.js";
</script>


<template>


  <!-- Global player live region, render this permanently at the end of the document -->
  <div v-if="isVisible" aria-live="assertive" class="pointer-events-none fixed bottom-0 inset-0 flex items-end px-4 py-6 sm:p-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Player panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-indigo-100 shadow-lg ring-1 ring-black ring-opacity-5 border-2 border-indigo-500">
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <button @click="togglePlayPause" class="bg-indigo-600 hover:bg-pink-500 text-white font-bold py-2 px-2 rounded-full">
                  <component :is="isPlaying ? PauseIcon : PlayIcon" class="h-5 w-5 text-white"/>
                </button>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <div class="flex justify-between align-middle">
                  <p class="truncate">
                    <span class="text-gray-900 font-semibold">Now playing:</span>
                  </p>
                  <button class="bg-indigo-100 font-bold text-gray-900 hover:bg-pink-500 hover:text-white py-1.5 px-1.5 rounded-full block ml-0" @click="closePlayer">
                    <XMarkIcon class="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p class="mb-2 truncate text-gray-600">
                  {{ currentEpisode.title }}
                </p>
                <audio ref="audioPlayer" :src="currentEpisode.enclosureUrl" @loadedmetadata="initializePlayer" @timeupdate="updateProgress">
                  Your browser does not support the audio element.
                </audio>
                <div class="relative w-full bg-white rounded-full h-2 cursor-pointer mb-2 overflow-hidden max-" @click="seek">
                  <div class="bg-pink-500 h-2 rounded-full absolute top-0 left-0" :style="{ width: progressBarWidth }"></div>
                </div>
                <p class="text-sm font-medium text-gray-900">{{ currentTime }} / {{ duration }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

</template>

<script>
const base_Url = import.meta.env.VITE_BASE_URL
export default {
  props: {
    episode: Object,
  },
  data() {
    return {
      isVisible: false,
      currentEpisode: null,
      isPlaying: false,
      progressBarWidth: '0%',
      currentTime: '0:00',
      duration: '0:00',
    };
  },
  watch: {
    episode(newEpisode) {
      if (newEpisode) {
        this.currentEpisode = newEpisode;
        this.isVisible = true;
        this.isPlaying = false;
        this.progressBarWidth = '0%';
        this.$nextTick(() => {
          if (this.$refs.audioPlayer) {
            this.$refs.audioPlayer.load(); // Reload the new audio source
          }
        });
      }
    },
  },
  methods: {

    sendPlayData() {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      let epID = this.currentEpisode.id
      let epTI = this.currentEpisode.title

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/add_play_click', {
            episode_id: epID,
            episode_title: epTI,
          }))
          .catch(error => {
            console.error('Play data fail');
          });
    },


    initializePlayer() {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        audioPlayer.addEventListener('play', this.onPlay);
        audioPlayer.addEventListener('pause', this.onPause);
        audioPlayer.addEventListener('ended', this.onEnded);
        audioPlayer.addEventListener('timeupdate', this.updateProgress);
        this.duration = this.formatTime(audioPlayer.duration);
      }
    },
    togglePlayPause() {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        if (audioPlayer.paused) {
          audioPlayer.play();
          this.sendPlayData();
        } else {
          audioPlayer.pause();
        }
      }
    },
    onPlay() {
      this.isPlaying = true;
    },
    onPause() {
      this.isPlaying = false;
    },
    onEnded() {
      this.isPlaying = false;
      this.progressBarWidth = '0%';
    },
    updateProgress() {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        this.progressBarWidth = `${progress}%`;
        this.currentTime = this.formatTime(audioPlayer.currentTime);
      }
    },
    seek(event) {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        const rect = event.target.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const newTime = (offsetX / rect.width) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
      }
    },
    closePlayer() {
      this.isVisible = false;
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Reset the current time
        this.isPlaying = false;
        this.progressBarWidth = '0%';
        this.currentTime = '0:00';
        this.duration = '0:00';
      }
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    },

  },
  mounted() {
    this.initializePlayer();
  },
  beforeDestroy() {
    const audioPlayer = this.$refs.audioPlayer;
    if (audioPlayer) {
      audioPlayer.removeEventListener('play', this.onPlay);
      audioPlayer.removeEventListener('pause', this.onPause);
      audioPlayer.removeEventListener('ended', this.onEnded);
      audioPlayer.removeEventListener('timeupdate', this.updateProgress);
    }
  },
};
</script>

<style scoped>
.audio-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

