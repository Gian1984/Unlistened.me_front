<script setup>
import {
  ArrowRightIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import {
  StarIcon
} from '@heroicons/vue/24/solid'
import Footer from '../components/Footer.vue'
import {useAuthStore} from "@/stores/authStore.js";
import { useMessageStore } from '@/stores/messageStore'
import {CheckCircleIcon} from "@heroicons/vue/24/outline/index.js";
import {XCircleIcon, XMarkIcon} from "@heroicons/vue/20/solid/index.js";

</script>

<template>

  <!--  Notification  -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" :class="['pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 border-2', notificationType === 'success' ? 'border-green-500' : 'border-red-500']">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component :is="notificationType === 'success' ? CheckCircleIcon : XCircleIcon" :class="notificationType === 'success' ? 'h-6 w-6 text-green-400' : 'h-6 w-6 text-red-500'" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">{{message}}</p>
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

  <div class="bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-2xl lg:max-w-4xl">
      <p class="text-base font-semibold leading-7 text-indigo-600">Your Favorite</p>
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Feeds</h1>
      <p class="mt-6 text-lg leading-8 text-gray-900">
        Welcome to your personal hub for all things podcast! This special section is designed just for you,
        here you can easily access and manage your favorite feeds. Whether you're revisiting an old favorite or keeping tabs
        on episodes to enjoy later, this is your go-to spot for curated audio content.
        Enjoy seamless browsing of your top picks and never miss a beat in the world of podcasts!
      </p>
    </div>
  </div>


  <div v-if="!favorites[0]" class="bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-2xl lg:max-w-4xl">
      <div class="text-center grid min-h-full place-items-center bg-white pb-24 sm:pb-32">
        <p class="text-base font-semibold text-indigo-600">No Favorites Yet?</p>
        <h1 class="my-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Let's Discover Some!</h1>
        <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M331.453,495.829H180.547c-4.466,0-8.084,3.618-8.084,8.084c0,4.466,3.618,8.084,8.084,8.084h150.905 c4.466,0,8.084-3.618,8.084-8.084C339.537,499.447,335.918,495.829,331.453,495.829z"></path> <path d="M471.579,291.031c-3.308,0-6.525,0.399-9.603,1.152l-43.258-72.673c5.128-3.715,10.032-7.885,14.65-12.501 c47.28-47.281,47.28-124.211,0-171.492C398.734,0.884,348.198-8.377,305.054,7.722C289.244,2.597,272.758,0,256,0 C168.333,0,97.011,71.323,97.011,158.988v21.558c0,28.232,22.969,51.2,51.2,51.2h149.419 c34.185,15.426,74.106,14.207,107.386-3.649l42.292,71.052c-9.8,7.383-16.148,19.115-16.148,32.302 c0,0.907,0.029,1.803,0.088,2.695h-51.714l6.961-27.842c2.229-8.917,0.264-18.186-5.393-25.432 c-5.657-7.245-14.173-11.4-23.364-11.4H154.264c-9.192,0-17.708,4.155-23.364,11.4c-5.657,7.246-7.622,16.516-5.393,25.432 l6.961,27.842H80.754c0.059-0.891,0.088-1.788,0.088-2.695c0-22.289-18.132-40.421-40.421-40.421S0,309.162,0,331.451 c0,19.52,13.909,35.853,32.337,39.609v70.875H20.809c-5.557,0-10.803,2.431-14.393,6.67c-3.592,4.238-5.128,9.812-4.215,15.293 l6.892,41.344c0.734,4.403,4.888,7.387,9.303,6.644c4.403-0.734,7.379-4.899,6.645-9.303l-6.891-41.343 c-0.179-1.071,0.301-1.829,0.601-2.185c0.302-0.356,0.97-0.953,2.057-0.953h39.225c1.086,0,1.755,0.597,2.057,0.953 c0.302,0.356,0.78,1.113,0.602,2.184L55.8,502.583c-0.734,4.404,2.242,8.569,6.645,9.303c0.451,0.077,0.898,0.112,1.339,0.112 c3.882,0,7.306-2.802,7.965-6.756l6.892-41.345c0.913-5.48-0.623-11.053-4.215-15.292c-3.592-4.238-8.838-6.67-14.393-6.67 H48.505V371.06c12-2.447,22.085-10.227,27.659-20.746h60.346l17.252,69.006c5.709,22.834,26.134,38.783,49.672,38.783h105.135 c23.538,0,43.963-15.948,49.672-38.782l17.252-69.007h60.345c6.788,12.811,20.263,21.558,35.743,21.558 c22.289,0,40.421-18.132,40.421-40.421C512,309.163,493.868,291.03,471.579,291.031z M148.21,215.578 c-19.317,0-35.032-15.715-35.032-35.032v-21.558c0-78.751,64.069-142.82,142.821-142.82c9.083,0,18.077,0.848,26.899,2.532 c-7.466,4.713-14.526,10.319-21.024,16.816c-14.463,14.464-24.502,31.704-30.116,50.019c-5.77-3.045-12.251-4.693-18.874-4.693 c-22.289,0-40.421,18.131-40.421,40.42s18.132,40.421,40.421,40.421c6.623,0,13.104-1.648,18.874-4.693 c5.615,18.315,15.653,35.554,30.116,50.019c3.054,3.053,6.232,5.91,9.517,8.569H148.21z M227.907,140.305 c-4.256,3.382-9.471,5.211-15.023,5.211c-13.372,0-24.253-10.88-24.253-24.253s10.88-24.253,24.253-24.253 c5.552,0,10.768,1.828,15.023,5.211C225.918,114.83,225.918,127.696,227.907,140.305z M273.309,195.576 c-40.977-40.975-40.977-107.649,0-148.624c20.486-20.489,47.399-30.733,74.312-30.733c26.913,0,53.826,10.244,74.312,30.732 c40.977,40.975,40.977,107.649,0,148.624C380.959,236.552,314.283,236.552,273.309,195.576z M40.421,355.703 c-13.372,0-24.253-10.88-24.253-24.253c0-13.372,10.88-24.253,24.253-24.253c13.372,0,24.253,10.88,24.253,24.253 S53.793,355.703,40.421,355.703z M370.808,302.382l-7.941,31.764h-85.309c-4.466,0-8.084,3.618-8.084,8.084 c0,4.466,3.618,8.084,8.084,8.084h81.265l-16.272,65.084c-3.905,15.624-17.881,26.536-33.985,26.536H203.431 c-16.104,0-30.08-10.912-33.985-26.536l-28.255-113.017c-1.014-4.053-0.121-8.266,2.45-11.559 c2.572-3.294,6.443-5.182,10.62-5.182h203.474c4.178,0,8.049,1.888,10.62,5.182C370.927,294.116,371.821,298.329,370.808,302.382 z M471.579,355.703c-10.488,0-19.442-6.693-22.818-16.03c-0.033-0.096-0.067-0.192-0.102-0.288 c-0.862-2.487-1.332-5.157-1.332-7.934c0-9.803,5.845-18.265,14.235-22.086c0.077-0.033,0.153-0.067,0.23-0.102 c2.994-1.327,6.308-2.064,9.788-2.064c13.372,0,24.253,10.88,24.253,24.253S484.951,355.703,471.579,355.703z"></path> <path d="M191.326,376.184c-4.466,0-8.084,3.618-8.084,8.084v1.078c0,4.466,3.618,8.084,8.084,8.084 c4.466,0,8.084-3.618,8.084-8.084v-1.078C199.411,379.802,195.792,376.184,191.326,376.184z"></path> <path d="M309.895,393.43c4.466,0,8.084-3.618,8.084-8.084v-1.078c0-4.466-3.618-8.084-8.084-8.084 c-4.466,0-8.084,3.618-8.084,8.084v1.078C301.811,389.81,305.429,393.43,309.895,393.43z"></path> <path d="M406.691,62.194c-15.778-15.778-36.756-24.467-59.07-24.467s-43.293,8.69-59.07,24.467 c-15.777,15.777-24.467,36.755-24.467,59.069s8.69,43.292,24.467,59.069c15.778,15.778,36.756,24.467,59.07,24.467 s43.292-8.689,59.07-24.467c15.777-15.777,24.467-36.755,24.467-59.069S422.469,77.972,406.691,62.194z M395.256,168.898 c-12.722,12.726-29.641,19.733-47.635,19.733s-34.912-7.007-47.635-19.733c-12.726-12.723-19.733-29.641-19.733-47.635 s7.007-34.912,19.733-47.634c12.722-12.726,29.641-19.733,47.635-19.733s34.913,7.007,47.635,19.732 c12.726,12.723,19.733,29.641,19.733,47.635C414.989,139.258,407.982,156.176,395.256,168.898z"></path> <path d="M223.663,376.184c-4.466,0-8.084,3.618-8.084,8.084v1.078c0,4.466,3.618,8.084,8.084,8.084 c4.466,0,8.084-3.618,8.084-8.084v-1.078C231.747,379.802,228.129,376.184,223.663,376.184z"></path> <path d="M212.884,301.809h-21.558c-10.401,0-18.863,8.463-18.863,18.863v21.558c0,10.401,8.463,18.863,18.863,18.863h21.558 c10.401,0,18.863-8.463,18.863-18.863v-21.558C231.747,310.271,223.285,301.809,212.884,301.809z M215.579,342.23 c0,1.486-1.208,2.695-2.695,2.695h-21.558c-1.486,0-2.695-1.208-2.695-2.695v-21.558c0-1.486,1.208-2.695,2.695-2.695h21.558 c1.486,0,2.695,1.208,2.695,2.695V342.23z"></path> </g> </g> </g> </g></svg>
        <p class="mt-6 text-base leading-7 text-gray-600">
          It looks like you haven't added any favorites yet.
          Dive into our diverse library of podcasts and find those standout episodes that speak to you.
          There’s a whole world of stories, insights, and entertainment waiting to be discovered.
          Start exploring now and build your collection of favorites!
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <router-link to="/feed_listing" class="bg-pink-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 mx-1 rounded-full">Start now &nbsp<span aria-hidden="true">&rarr;</span></router-link>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="pb-24 bg-white">
      <div class="bg-white pb-12 sm:pb-12">
        <div class="mx-auto max-w-2xl lg:max-w-4xl px-6 lg:px-8">
          <div class="mx-auto">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Organize your feeds</h2>
            <p class="leading-6 text-base text-gray-900 py-6">
              Welcome to your personalized feeds hub! Here, you can easily manage your favorite feeds by creating and organizing them into custom categories. Whether you want to keep track of feeds to listen to next, highlight your all-time favorites, or archive past feeds, our flexible system allows you to create up to five unique sections. Simply select a category from the dropdown menu and drag your favorite feeds into the desired section for a streamlined and organized listening experience. Enjoy hassle-free podcast management and keep your audio content just the way you like it!
            </p>
            <p for="location" class="text-gray-900 font-bold">Custom categories :</p>
            <div class="mx-auto lg:flex block justify-between align-middle">
              <div class="lg:w-10/12 w-full">
                <label for="location" class="sr-only">Custom categories</label>
                <select v-model="newSection" id="location" name="location" class="mt-2 block w-full border-0 rounded-xl py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <option v-for="section in availableSections" :key="section" :value="section">{{ section }}</option>
                </select>
              </div>
              <button class="lg:mt-1.5 mt-3 bg-indigo-700 hover:bg-pink-500 text-white text-sm font-bold py-2 px-4 mx-1 rounded-full flex align-middle" @click="addSection">Add Section</button>
            </div>
          </div>
          <div class="mx-auto max-w-2xl lg:mx-0 mt-10">
            <h2 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Main area</h2>
          </div>
          <div class="mx-auto mt-6 gap-x-8 gap-y-16 border rounded-2xl border-pink-400 pt-1 pb-10 sm:mt-6 sm:pb-16 lg:mx-0 lg:max-w-none">

            <draggable
                class="list-group"
                v-model="mainAreaItems"
                group="favorites"
                @change="onDragEnd"
                itemKey="id"
            >
              <template #item="{ element, index }">

                <div  class="bg-indigo-600 border-solid border-4 border-white rounded-2xl">
                  <div class="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
                    <div class="flex flex-wrap items-center justify-between">
                      <div class="flex w-0 flex-1 items-center">
                        <span class="flex rounded-lg bg-indigo-800 p-2">
                          <StarIcon class="h-5 w-5 text-white" aria-hidden="true" />
                        </span>
                        <p class="ml-3 truncate font-medium text-white">
                          <span> {{ element.title }}</span>
                        </p>
                      </div>
                      <div class="order-3 mt-2 flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto w-full">
                        <router-link :to="'/feed/' + element.feed_id" type="button" class="items-center justify-center border border-transparent bg-white py-2 px-4 mx-1 rounded-full flex text-sm font-medium text-indigo-600 shadow-sm hover:bg-pink-500 hover:text-white">
                          <span class="sr-only">Visit feed</span>
                          <ArrowRightIcon class="h-5 w-5" aria-hidden="true" />
                        </router-link>
                      </div>
                      <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                        <button @click="deleteFavourite(element.feed_id, 'main')" type="button" class="-mr-1 py-2 px-4 mx-1 rounded-full flex p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 text-white hover:text-red-600">
                          <span class="sr-only">Dismiss</span>
                          <TrashIcon class="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </template>
            </draggable>

          </div>
        </div>
      </div>


      <div v-for="(section, index) in sections" :key="section.name"  :class="['py-6', index % 2 === 0 ? 'bg-gray-200' : 'bg-white']">
        <div class="mx-auto max-w-2xl lg:max-w-4xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:mx-0">
            <h2 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{{ section.name }}</h2>
          </div>
          <div class="mx-auto mt-6 gap-x-8 gap-y-16 border rounded-2xl border-pink-400 pt-1 pb-10 sm:mt-6 sm:pb-16 lg:mx-0 lg:max-w-none">

            <draggable
                class="list-group"
                v-model="section.items"
                group="favorites"
                @change="onDragEnd"
                itemKey="id"
            >
              <template #item="{ element, index }">

                <div  class="bg-indigo-600 border-solid border-4 border-white rounded-2xl">
                  <div class="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
                    <div class="flex flex-wrap items-center justify-between">
                      <div class="flex w-0 flex-1 items-center">
                        <span class="flex rounded-lg bg-indigo-800 p-2">
                          <StarIcon class="h-5 w-5 text-white" aria-hidden="true" />
                        </span>
                        <p class="ml-3 truncate font-medium text-white">
                          <span> {{ element.title }}</span>
                        </p>
                      </div>
                      <div class="order-3 mt-2 flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto w-full">
                        <router-link :to="'/feed/' + element.feed_id" type="button" class="items-center justify-center border border-transparent bg-white py-2 px-4 mx-1 rounded-full flex text-sm font-medium text-indigo-600 shadow-sm hover:bg-pink-500 hover:text-white">
                          <span class="sr-only">Visit feed</span>
                          <ArrowRightIcon class="h-5 w-5" aria-hidden="true" />
                        </router-link>
                      </div>
                      <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                        <button @click="deleteFavourite(element.feed_id, section.name)" type="button" class="-mr-1 py-2 px-4 mx-1 rounded-full flex p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 text-white hover:text-red-600">
                          <span class="sr-only">Dismiss</span>
                          <TrashIcon class="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </template>
            </draggable>

          </div>
        </div>
      </div>
  </div>





  <Footer />
</template>

<script>
const base_Url = import.meta.env.VITE_BASE_URL
import draggable from 'vuedraggable';
import { ref } from 'vue'
const show = ref(false)
const message = ref('');
const notificationType = ref('success');
export default {

  components: {
    draggable
  },

  data() {
    return {
      drag: false,
      favorites: [],
      newSection: '',
      availableSections: ['Current Favorites', 'To Listen Next', 'All-Time Favorites', 'Archived Episodes'],
      sections: [],
      mainAreaItems: [],
    };
  },

  created() {
    this.fetchFavorites();
  },
  methods: {
    fetchFavorites() {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.get(base_Url + 'api/user-favorites'))
          .then(response => {
            this.favorites = response.data;

            this.mainAreaItems = response.data.filter(item => !item.section);
            this.availableSections.forEach(sectionName => {
              const items = response.data.filter(item => item.section === sectionName);
              if (items.length > 0) {
                this.sections.push({ name: sectionName, items });
              }
            });

          })
          .catch(error => {
            if (error.response && error.response.status === 401) {
              const authStore = useAuthStore();
              const messageStore = useMessageStore();
              authStore.clearUser();
              messageStore.setMessage('Your session has expired due to lack of activity.');
              this.$router.push({ name: 'Login' });
            } else {
              console.error('Error fetching favorites');
            }
          });
    },

    addSection() {
      if (this.newSection && !this.sections.find(section => section.name === this.newSection)) {
        this.sections.push({ name: this.newSection, items: [] });
      }
    },
    onDragEnd(evt) {
      if (evt.added || evt.moved) {
        const element = evt.added ? evt.added.element : evt.moved.element;
        const newSection = this.getSectionFromElement(element);
        this.updateFavoriteSection(element.id, newSection);
      }
    },
    getSectionFromElement(element) {
      for (const section of this.sections) {
        if (section.items.includes(element)) {
          return section.name;
        }
      }
      return null; // main area
    },
    updateFavoriteSection(favoriteId, section) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')

          .then(() => this.axios.post(base_Url + `api/favorites/${favoriteId}/update-section`, { section }))
          .then(response => {
            show.value = true;
            message.value = response.data.message;
            notificationType.value = 'success';

            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          })
          .catch(error => {
            console.error('There was an error updating the section:', error);
          });
    },


    deleteFavourite(feedId, sectionName) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/delete-favorite', {
            feed_id: feedId,
          }))
          .then(response => {

            if (sectionName === 'main') {
              this.mainAreaItems = this.mainAreaItems.filter(item => item.feed_id !== feedId);
            } else {
              const section = this.sections.find(sec => sec.name === sectionName);
              if (section) {
                section.items = section.items.filter(item => item.feed_id !== feedId);
              }
            }

            show.value = true;
            message.value = response.data.message;
            notificationType.value = 'success';

            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          })
          .catch(error => {
            const authStore = useAuthStore();
            const messageStore = useMessageStore();

            if (error.response && error.response.status === 401) {
              authStore.clearUser();
              messageStore.setMessage('Your session has expired due to lack of activity.');
              this.$router.push({ name: 'Login' });
            } else {
              message.value = 'There was an while deleting. Please try later.';
              notificationType.value = 'error';
              show.value = true;
              setTimeout(() => {
                show.value = false;
                message.value = null;
              }, 5000);
            }
          });
    },
  }
};
</script>
