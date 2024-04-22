<template>
  <div>
    <h1>Podcasts</h1>
    <ul>
      <li v-for="podcast in podcasts" :key="podcast.id">
        <router-link :to="'/podcast/' + podcast.id">{{ podcast.title }}</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
const base_Url = import.meta.env.VITE_BASE_URL
export default {

  data() {
    return {
      podcasts: [] // Array to store podcasts
    };
  },

  beforeMount() {

    this.axios.get(base_Url + 'api/data')
        .then(response => {
          console.log(response.data.feeds)
          this.podcasts= response.data.feeds
        })
        .catch(error => {
          console.error(error, 'nothing to display');
        });

  },

}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
