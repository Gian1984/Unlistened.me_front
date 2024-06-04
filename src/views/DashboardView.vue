<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import {useAuthStore} from "@/stores/authStore.js";
import { useMessageStore } from '@/stores/messageStore'

const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

const activityItems = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    commit: '2d89f0c8',
    branch: 'main',
    status: 'Completed',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    commit: '2d89f0c8',
    branch: 'main',
    status: 'Completed',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    commit: '2d89f0c8',
    branch: 'main',
    status: 'Completed',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  // More items...
]
</script>
<template>
  <div class="min-h-full">
    <div class="py-10">

      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl text-white">Dashboard</h1>
      </div>

      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">

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
        <!-- Activity list -->


        <div class="border-t border-white/10 py-24">
          <h2 class="text-2xl font-bold leading-7 text-white">Users list</h2>
          <ul role="list" class="divide-y divide-gray-100">
            <li v-for="user in users" :key="user.id" class="flex items-center justify-between gap-x-6 py-5">
              <div class="min-w-0">
                <div class="flex items-start gap-x-3">
                  <p class="text-sm font-semibold leading-6 text-white">{{ user.name }}</p>
                  <p class="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset">{{ user.email }}</p>
                </div>
                <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p class="whitespace-nowrap">
                    Created at <time :datetime="user.created_at">{{ user.created_at }}</time>
                  </p>
                  <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <p class="truncate">Role: {{ user.is_admin === 1 ? 'Admin' : 'User' }}</p>
                </div>
              </div>
              <div class="flex flex-none items-center gap-x-4">
                <a href="#" class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                >View project<span class="sr-only">, {{ user.name }}</span></a
                >
                <Menu as="div" class="relative flex-none">
                  <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span class="sr-only">Open options</span>
                    <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                  </MenuButton>
                  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <MenuItems class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <MenuItem v-slot="{ active }">
                        <a href="#" :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"
                        >Edit<span class="sr-only">, {{ user.name }}</span></a
                        >
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <a href="#" :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"
                        >Move<span class="sr-only">, {{ user.name }}</span></a
                        >
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <a href="#" :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"
                        >Delete<span class="sr-only">, {{ user.name }}</span></a
                        >
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div class="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1">
          <div class="relative flex">
            <Pie
                :options="chartOptions"
                :data="chartData"
            />
          </div>
          <div class="relative flex">
            <Pie
                :options="chartOptions"
                :data="chartData"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
const base_Url = import.meta.env.VITE_BASE_URL
import {useAuthStore} from "@/stores/authStore.js";
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {

  name: 'BarChart',
  components: { Pie },
  data() {
    return {
      users:null,
      topStats:null,

      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16','#f94144','#f3722c','#f8961e','#f9c74f','#43aa8b','#577590','#6a4c93','#ffa600'],
            data: [65, 59, 80, 81, 56, 55, 40, 59, 60, 62, 70, 72],
          }
        ]
      },
      chartOptions: {
        responsive: true,
      }
    }
  },
  created() {
    this.fetchStats();
    this.getAllUsers();
  },
  methods: {
    fetchStats() {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.get(base_Url + 'api/get_stats'))
          .then(response => {
            const {  'Podcasts downloaded per month': clicksDownloadPerMonth, 'Podcasts listened per month': clicksPlayPerMonth, ...filteredData } = response.data;
            console.log(filteredData);
            this.topStats = filteredData;
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
            console.log(response)
            this.users = response.data;
          })
          .catch(error => {
            console.log(error)
          });
    }
  }
}
</script>