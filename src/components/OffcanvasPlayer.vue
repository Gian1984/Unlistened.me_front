<script setup>
import {PlayIcon, PauseIcon, XMarkIcon} from "@heroicons/vue/24/solid/index.js";
</script>


<template>
  <div v-if="isVisible" class="fixed mx-auto max-w-xs md:max-w-md lg:max-w-xl bottom-1 p-4 border-2 bg-gray-400 border-gray-400 overflow-hidden object-contain right-1 rounded-2xl">
    <div class="flex justify-end mb-5">
      <button class="bg-pink-500 hover:bg-indigo-500 text-white font-bold py-2 px-2 rounded-full block ml-0" @click="closePlayer">
        <XMarkIcon class="h-4 w-4 text-white" aria-hidden="true" />
      </button>
    </div>
    <p class="text-teal-950 mb-5 truncate">
      <span class="text-gray-900 font-semibold">Now playing:</span> {{ currentEpisode.title }}
    </p>
    <audio ref="audioPlayer" :src="currentEpisode.enclosureUrl" @loadedmetadata="initializePlayer" @timeupdate="updateProgress">
      Your browser does not support the audio element.
    </audio>
    <div class="flex items-center">
      <div class="audio-player flex items-center justify-center mb-4">
        <button @click="togglePlayPause" class="bg-indigo-500 hover:bg-pink-500 text-white font-bold py-4 px-4 rounded-full mr-5">
          <component :is="isPlaying ? PauseIcon : PlayIcon" class="h-6 w-6 text-white"/>
        </button>
      </div>
      <div class="relative w-full bg-gray-200 rounded-full h-2 cursor-pointer mb-4 overflow-hidden max-" @click="seek">
        <div class="bg-pink-500 h-2 rounded-full absolute top-0 left-0" :style="{ width: progressBarWidth }"></div>
      </div>
    </div>
    <div class="time-display text-gray-600 text-sm mb-4">
      <span>{{ currentTime }} / {{ duration }}</span>
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
    async sendPlayData() {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        let epID = this.currentEpisode.id
        let epTI = this.currentEpisode.title

        const response = await this.axios.post(base_Url + 'api/add_click', {
          episode_id: epID,
          episode_title: epTI,
        });

        console.log('Play data sent:', response.data);

      } catch (error) {
        console.error('Error sending play data:', error);
      }
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

