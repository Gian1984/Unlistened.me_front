<template>
  <div v-if="isVisible" class="fixed bottom-0 w-full p-4 bg-white border-t-2 border-gray-300">
    <!-- Your player content here -->
    <p class="text-teal-950 mb-5 leading-6 text-sm lg:text-lg">
      <span class="text-gray-900 font-semibold">Now playing :</span> {{ currentEpisode.title }}</p>
    <audio ref="audioPlayer" controls :src="currentEpisode.enclosureUrl">
      Your browser does not support the audio element.
    </audio>

    <button class="bg-pink-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 mx-1 rounded-full mt-5 inline-flex" @click="closePlayer">Close</button>
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
