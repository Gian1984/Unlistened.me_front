<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import {useAuthStore} from "@/stores/authStore.js";
import { useMessageStore } from '@/stores/messageStore'
import {XMarkIcon, XCircleIcon, ArrowLongLeftIcon, ArrowLongRightIcon} from "@heroicons/vue/20/solid/index.js";
import {UserIcon, CheckCircleIcon , WrenchScrewdriverIcon} from "@heroicons/vue/24/outline/index.js";

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


  <div class="min-h-full bg-black">
    <div class="py-10">

      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl text-white">Dashboard</h1>
      </div>

      <!-- Activity list -->

      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="bg-gray-900">
          <div class="mx-auto max-w-7xl">
            <div class="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
              <div v-for="(value, key) in topStats" :key="key" class="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                <p class="text-sm font-medium leading-6 text-gray-400">{{ key }}</p>
                <p class="mt-2 flex items-baseline gap-x-2">
                  <span class="text-4xl font-semibold tracking-tight text-white">{{ value }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity list -->

      <!-- Charts list -->

      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="py-10">
          <h3 class="text-2xl font-bold leading-7 text-white">Statistics per month</h3>
        </div>
        <div class="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1">
          <div class="relative sm:flex sm:justify-center py-10 px-8" v-if="downloadChartData">
            <h2 class="sm:pb-4 text-sm font-semibold leading-6 text-white">Downloaded</h2>
            <Pie :options="chartOptions" :data="downloadChartData" />
          </div>
          <div class="relative sm:flex sm:justify-center py-10 px-8" v-if="playChartData">
            <h3 class="sm:pb-4 text-sm font-semibold leading-6 text-white">Played</h3>
            <Pie :options="chartOptions" :data="playChartData" />
          </div>
        </div>
      </div>

      <!-- Charts list -->

      <!-- Questions list -->

      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold leading-7 text-white">Questions received</h2>
        <div class="pb-2 pt-6">
          <label for="search" class="block text-sm font-medium leading-6 text-white">Quick search</label>
          <div class="relative mt-2 flex items-center">
            <input v-model="faqFilter" type="text" name="search" id="search" placeholder="Filter by email" class="block w-full rounded-md border-0 py-1.5 pr-14 text-white bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <ul role="list" class="divide-y divide-gray-100">
          <li v-for="(faq, index) in paginatedFaqs" :key="index" class="flex items-center justify-between gap-x-6 py-5">
            <div class="min-w-0">
              <div class="flex items-start gap-x-3">
                <p class="text-sm font-semibold leading-6 text-white">{{ faq.username }}</p>
                <a :href="`mailto:${faq.email}?subject=Unlistened.me user info`" class="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset hover:text-white">{{ faq.email }}</a>
              </div>
              <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p class="whitespace-nowrap">
                  Created at <time :datetime="faq.created_at">{{ new Date(faq.created_at).toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
                </p>
                <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                  <circle cx="1" cy="1" r="1" />
                </svg>
                <p class="truncate">{{faq.message_obj}}</p>
              </div>
              <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p class="text-white">
                  {{faq.message_desc}}
                </p>
              </div>
            </div>
            <div class="flex flex-none items-center gap-x-4">
              <button @click="toggleFaqStatus(faq)"  class="flex">
                <component :is="faq.was_answered ? CheckCircleIcon : XCircleIcon" :class="faq.was_answered ? 'h-6 w-6 text-green-700 hover:text-green-400' : 'h-6 w-6 text-red-800 hover:text-red-400'" aria-hidden="true" />
              </button>
              <Menu as="div" class="relative flex-none">
                <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-pink-500">
                  <span class="sr-only">Open options</span>
                  <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                </MenuButton>
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none bg-red-400 hover:bg-red-600 text-gray-900 hover:text-white">
                    <MenuItem v-slot="{ active }">
                      <button @click="deleteFaq(faq.id, index)" :class="[active ? 'bg-red-400 hover:bg-red-600' : '', 'block px-3 py-1 text-sm leading-6']"> Delete message<span class="sr-only">from {{ faq.username }}</span></button>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </li>
        </ul>

        <div class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
          <div class="-mt-px flex w-0 flex-1">
            <button @click="prevPage('faqs')" :disabled="currentPageFaqs === 1" :class="{'inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-white hover:border-pink-500 hover:text-pink-500': currentPageFaqs !== 1, 'inline-flex items-center border-t-2 border-gray-600 pr-1 pt-4 text-sm font-medium text-gray-600 cursor-default': currentPageFaqs === 1}">
              <ArrowLongLeftIcon class="mr-3 h-5 w-5" aria-hidden="true" />
              Previous
            </button>
          </div>
          <div class="hidden md:-mt-px md:flex">
            <button v-for="page in visiblePagesFaqs" :key="page" @click="goToPage('faqs', page)" :class="{'inline-flex items-center border-t-2 border-indigo-500 text-indigo-500 px-4 pt-4 text-sm font-medium': currentPageFaqs === page, 'inline-flex items-center border-t-2 border-transparent text-white hover:text-pink-500 hover:border-pink-500 px-4 pt-4 text-sm font-medium': currentPageFaqs !== page}" aria-current="page">{{ page }}</button>
            <button v-if="showNextButtonFaqs" @click="nextPageSet('faqs')" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-white hover:text-pink-500">...</button>
          </div>
          <div class="-mt-px flex w-0 flex-1 justify-end">
            <button @click="nextPage('faqs')" :disabled="currentPageFaqs * faqsPerPage >= filteredFaqs.length" :class="{'inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-white hover:border-pink-500 hover:text-pink-500': currentPageFaqs * faqsPerPage < filteredFaqs.length, 'inline-flex items-center border-t-2 border-gray-600 pl-1 pt-4 text-sm font-medium text-gray-600 cursor-default': currentPageFaqs * faqsPerPage >= filteredFaqs.length}">
              Next
              <ArrowLongRightIcon class="ml-3 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

      </div>

      <!-- Questions list -->

      <!-- Users list -->

      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold leading-7 text-white">Users list</h2>
        <div class="pb-2 pt-6">
          <label for="search" class="block text-sm font-medium leading-6 text-white">Quick search</label>
          <div class="relative mt-2 flex items-center">
            <input v-model="userFilter" type="text" name="search" id="search" placeholder="Filter by email" class="block w-full rounded-md border-0 py-1.5 pr-14 text-white bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <ul role="list" class="divide-y divide-gray-100">
          <li v-for="(user, index) in paginatedUsers" :key="index" class="flex items-center justify-between gap-x-6 py-5">
            <div class="min-w-0">
              <div class="flex items-start gap-x-3">
                <p class="text-sm font-semibold leading-6 text-white">{{ user.name }}</p>
                <a :href="`mailto:${user.email}?subject=Unlistened.me user info`" class="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset hover:text-white">{{ user.email }}</a>
              </div>
              <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p class="whitespace-nowrap">
                  Created at <time :datetime="user.created_at">{{ new Date(user.created_at).toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
                </p>
                <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                  <circle cx="1" cy="1" r="1" />
                </svg>
                <p class="truncate">Role: {{ user.is_admin === 1 ? 'Admin' : 'User' }}</p>
              </div>
            </div>
            <div class="flex flex-none items-center gap-x-4">

              <button @click="toggleAdminStatus(user)"  class="flex">
                <component :is="user.is_admin ? WrenchScrewdriverIcon : UserIcon" :class="user.is_admin ? 'h-6 w-6 text-pink-700 hover:text-pink-400' : 'h-6 w-6 text-green-700 hover:text-green-400'" aria-hidden="true" />
              </button>

              <Menu as="div" class="relative flex-none">
                <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-pink-500">
                  <span class="sr-only">Open options</span>
                  <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                </MenuButton>
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none bg-red-400 hover:bg-red-600 text-gray-900 hover:text-white">
                    <MenuItem v-slot="{ active }">
                      <button @click="deleteAccount(user.id, index)" :class="[active ? 'bg-red-400 hover:bg-red-600' : '', 'block px-3 py-1 text-sm leading-6']">Delete user<span class="sr-only">, {{ user.name }}</span></button>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </li>
        </ul>

        <div class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
          <div class="-mt-px flex w-0 flex-1">
            <button @click="prevPage('users')" :disabled="currentPageUsers === 1" :class="{'inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-white hover:border-pink-500 hover:text-pink-500': currentPageUsers !== 1, 'inline-flex items-center border-t-2 border-gray-600 pr-1 pt-4 text-sm font-medium text-gray-600 cursor-default': currentPageUsers === 1}">
              <ArrowLongLeftIcon class="mr-3 h-5 w-5" aria-hidden="true" />
              Previous
            </button>
          </div>
          <div class="hidden md:-mt-px md:flex">
            <button v-for="page in visiblePagesUsers" :key="page" @click="goToPage('users', page)" :class="{'inline-flex items-center border-t-2 border-indigo-500 text-indigo-500 px-4 pt-4 text-sm font-medium': currentPageUsers === page, 'inline-flex items-center border-t-2 border-transparent text-white hover:text-pink-500 hover:border-pink-500 px-4 pt-4 text-sm font-medium': currentPageUsers !== page}" aria-current="page">{{ page }}</button>
            <button v-if="showNextButtonUsers" @click="nextPageSet('users')" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-white hover:text-indigo-500">...</button>
          </div>
          <div class="-mt-px flex w-0 flex-1 justify-end">
            <button @click="nextPage('users')" :disabled="currentPageUsers * usersPerPage >= filteredUsers.length" :class="{'inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-white hover:border-pink-500 hover:text-pink-500': currentPageUsers * usersPerPage < filteredUsers.length, 'inline-flex items-center border-t-2 border-gray-600 pl-1 pt-4 text-sm font-medium text-gray-600 cursor-default': currentPageUsers * usersPerPage >= filteredUsers.length}">
              Next
              <ArrowLongRightIcon class="ml-3 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

      </div>

      <!-- Users list -->


    </div>
  </div>
</template>

<script>
const base_Url = import.meta.env.VITE_BASE_URL
import {useAuthStore} from "@/stores/authStore.js";
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)
import { ref } from 'vue'
const show = ref(false)
const message = ref('');
const notificationType = ref('success');


export default {

  name: 'BarChart',
  components: { Pie },
  data() {
    return {
      downloadChartData: null,
      playChartData: null,
      chartOptions: {
        responsive: true,
      },
      topStats:null,

      faqs:[],
      currentPageFaqs: 1,
      faqsPerPage: 5,
      maxVisiblePagesFaqs: 3,
      faqFilter: '',

      users:[],
      currentPageUsers: 1,
      usersPerPage: 5,
      maxVisiblePagesUsers: 3,
      userFilter: '',
    }
  },

  computed: {
    paginatedFaqs() {
      const start = (this.currentPageFaqs - 1) * this.faqsPerPage;
      const end = start + this.faqsPerPage;
      return this.filteredFaqs.slice(start, end);
    },
    totalPagesFaqs() {
      return Math.ceil(this.filteredFaqs.length / this.faqsPerPage);
    },
    visiblePagesFaqs() {
      const pages = [];
      const startPage = Math.max(1, this.currentPageFaqs - Math.floor(this.maxVisiblePagesFaqs / 2));
      const endPage = Math.min(this.totalPagesFaqs, startPage + this.maxVisiblePagesFaqs - 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
    showNextButtonFaqs() {
      return this.currentPageFaqs + Math.floor(this.maxVisiblePagesFaqs / 2) < this.totalPagesFaqs;
    },
    filteredFaqs() {
      return this.faqs.filter(faq => faq.email.toLowerCase().includes(this.faqFilter.toLowerCase()));
    },


    paginatedUsers() {
      const start = (this.currentPageUsers - 1) * this.usersPerPage;
      const end = start + this.usersPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPagesUsers() {
      return Math.ceil(this.filteredUsers.length / this.usersPerPage);
    },
    visiblePagesUsers() {
      const pages = [];
      const startPage = Math.max(1, this.currentPageUsers - Math.floor(this.maxVisiblePagesUsers / 2));
      const endPage = Math.min(this.totalPagesUsers, startPage + this.maxVisiblePagesUsers - 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
    showNextButtonUsers() {
      return this.currentPageUsers + Math.floor(this.maxVisiblePagesUsers / 2) < this.totalPagesUsers;
    },
    filteredUsers() {
      return this.users.filter(user => user.email.toLowerCase().includes(this.userFilter.toLowerCase()));
    },
  },

  watch: {
    userFilter() {
      this.currentPageUsers = 1;
    },
    faqFilter() {
      this.currentPageFaqs = 1;
    }
  },


  created() {
    this.fetchStats();
    this.getAllUsers();
    this.getAllFaqs();
  },

  methods: {

    // Stats methods start

    fetchStats() {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.get(base_Url + 'api/get_stats'))
          .then(response => {

            const {  'Podcasts downloaded per month': clicksDownloadPerMonth, 'Podcasts listened per month': clicksPlayPerMonth, ...filteredData } = response.data;
            this.topStats = filteredData;

            const currentYear = new Date().getFullYear();
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            const prepareChartData = (data, backgroundColor) => ({
              labels: data.map(item => monthNames[item.month - 1]),
              datasets: [{
                backgroundColor,
                data: data.map(item => item.clicks),
              }]
            });

            this.downloadChartData = prepareChartData(
                clicksDownloadPerMonth.filter(item => item.year === currentYear),
                ['#41B883', '#E46651', '#00D8FF', '#DD1B16','#f94144','#f3722c','#f8961e','#f9c74f','#43aa8b','#577590','#6a4c93','#ffa600']
            );

            this.playChartData = prepareChartData(
                clicksPlayPerMonth.filter(item => item.year === currentYear),
                ['#41B883', '#E46651', '#00D8FF', '#DD1B16','#f94144','#f3722c','#f8961e','#f9c74f','#43aa8b','#577590','#6a4c93','#ffa600']
            );

          })
          .catch(error => {
            const authStore = useAuthStore();
            const messageStore = useMessageStore();
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
              authStore.clearUser();
              messageStore.setMessage('Your session has expired due to lack of activity.');
              this.$router.push({ name: 'Login' });
            } else {
              authStore.clearUser();
              messageStore.setMessage('Something went wrong, please try again.');
              this.$router.push({ name: 'Login' });
            }
          });
    },

    // Stats methods end

    // Faqs methods start

    getAllFaqs() {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.get(base_Url + 'api/faqs'))
          .then(response => {
            console.log(response.data)
            this.faqs = response.data;
          })
          .catch(error => {
            message.value = 'Error getting faqs list. Please try later.';
            notificationType.value = 'error';
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          });
    },
    toggleFaqStatus(faq) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/update-faq-status', {
            faq_id: faq.id,
            was_answered: faq.was_answered ? 0 : 1
          }))
          .then(response => {
            faq.was_answered = response.data.was_answered;
            show.value = true;
            message.value = response.data.message;
            notificationType.value = 'success';

            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          })
          .catch(error => {
            message.value = 'Error updating status. Please try later.';
            notificationType.value = 'error';
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          });
    },

    deleteFaq(id, index) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.delete(base_Url + `api/delete_faq/${id}`))
          .then(response => {
            this.faqs.splice(index, 1);
            notificationType.value = 'success';
            message.value = response.data.message;
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          })

          .catch(error => {
            message.value = 'Error while deleting question. Please try later.';
            notificationType.value = 'error';
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          });
    },

    // Faqs methods end

    // Users methods start

    getAllUsers() {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.get(base_Url + 'api/users'))
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            message.value = 'Error getting users list. Please try later.';
            notificationType.value = 'error';
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          });
    },

    toggleAdminStatus(user) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/update-status', {
            user_id: user.id,
            is_admin: user.is_admin ? 0 : 1
          }))
          .then(response => {
            user.is_admin = response.data.is_admin;
            show.value = true;
            message.value = response.data.message;
            notificationType.value = 'success';

            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          })
          .catch(error => {
            message.value = 'Error updating status. Please try later.';
            notificationType.value = 'error';
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          });
    },

    deleteAccount(id, index) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.delete(base_Url + `api/delete_users/${id}`))
          .then(response => {
            this.users.splice(index, 1);
            notificationType.value = 'success';
            message.value = 'User deleted successfully!'
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          })

          .catch(error => {
            message.value = 'Error while deleting user. Please try later.';
            notificationType.value = 'error';
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          });
    },

    // Users methods ends

    // Methods pagination start

    nextPage(type) {
      if (type === 'users' && this.currentPageUsers * this.usersPerPage < this.filteredUsers.length) {
        this.currentPageUsers += 1;
      } else if (type === 'faqs' && this.currentPageFaqs * this.faqsPerPage < this.filteredFaqs.length) {
        this.currentPageFaqs += 1;
      }
    },

    prevPage(type) {
      if (type === 'users' && this.currentPageUsers > 1) {
        this.currentPageUsers -= 1;
      } else if (type === 'faqs' && this.currentPageFaqs > 1) {
        this.currentPageFaqs -= 1;
      }
    },

    goToPage(type, page) {
      if (type === 'users') {
        this.currentPageUsers = page;
      } else if (type === 'faqs') {
        this.currentPageFaqs = page;
      }
    },

    nextPageSet(type) {
      if (type === 'users') {
        this.currentPageUsers = Math.min(this.totalPagesUsers, this.currentPageUsers + this.maxVisiblePagesUsers);
      } else if (type === 'faqs') {
        this.currentPageFaqs = Math.min(this.totalPagesFaqs, this.currentPageFaqs + this.maxVisiblePagesFaqs);
      }
    },

    // Methods pagination end

  },

}
</script>