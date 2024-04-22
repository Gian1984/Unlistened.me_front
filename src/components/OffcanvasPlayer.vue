<template>
  <div v-if="isVisible" class="fixed bottom-0 w-full p-4 bg-white border-t-2 border-gray-300">
    <!-- Your player content here -->
    <p class="text-teal-950">Now playing: {{ currentEpisode.title }}</p>
    <audio ref="audioPlayer" controls :src="currentEpisode.enclosureUrl">
      Your browser does not support the audio element.
    </audio>

    <button class="text-teal-950" @click="closePlayer">Close</button>
  </div>
</template>

<script>
export default {
  props: {
    episode: Object,
  },
  data() {
    return {
      isVisible: false,
      currentEpisode: null
    };
  },
  watch: {
    episode(newEpisode) {
      if (newEpisode) {
        this.currentEpisode = newEpisode;
        this.isVisible = true;
      }
    }
  },
  methods: {
    closePlayer() {
      this.isVisible = false;
    }
  }
};
</script>
