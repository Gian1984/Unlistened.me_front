<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import {useAuthStore} from "@/stores/authStore.js";
import { useMessageStore } from '@/stores/messageStore'
import {XMarkIcon, XCircleIcon} from "@heroicons/vue/20/solid/index.js";
import {UserIcon, CheckCircleIcon , WrenchScrewdriverIcon} from "@heroicons/vue/24/outline/index.js";

</script>
<template>

  <!--  Notification  -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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


  <div class="min-h-full">
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
        <ul role="list" class="divide-y divide-gray-100">
          <li v-for="(faq, index) in faqs" :key="index" class="flex items-center justify-between gap-x-6 py-5">
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
      </div>

      <!-- Questions list -->

      <!-- Users list -->

      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold leading-7 text-white">Users list</h2>
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
        <div class="flex justify-between mt-4">
          <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-500 text-white px-4 py-2 rounded">Previous</button>
          <button @click="nextPage" :disabled="currentPage * usersPerPage >= users.length" class="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
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
      users:[],
      faqs:null,
      downloadChartData: null,
      playChartData: null,
      chartOptions: {
        responsive: true,
      },
      topStats:null,
      currentPage: 1,
      usersPerPage: 2,
    }
  },

  computed: {
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.usersPerPage;
      const end = start + this.usersPerPage;
      return this.users.slice(start, end);
    },
  },


  created() {
    this.fetchStats();
    this.getAllUsers();
    this.getAllFaqs();
  },

  methods: {
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

    nextPage() {
      if (this.currentPage * this.usersPerPage < this.users.length) {
        this.currentPage += 1;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },

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
  },

}
</script>