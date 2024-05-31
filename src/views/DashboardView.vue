<script setup>
import {useAuthStore} from "@/stores/authStore.js";
import { useMessageStore } from '@/stores/messageStore'

const stats = [
  { name: 'Number of deploys', value: '405' },
  { name: 'Average deploy time', value: '3.65', unit: 'mins' },
  { name: 'Number of servers', value: '3' },
  { name: 'Success rate', value: '98.5%' },
]
const statuses = { Completed: 'text-green-400 bg-green-400/10', Error: 'text-rose-400 bg-rose-400/10' }
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
              <div v-for="stat in stats" :key="stat.name" class="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                <p class="text-sm font-medium leading-6 text-gray-400">{{ stat.name }}</p>
                <p class="mt-2 flex items-baseline gap-x-2">
                  <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.value }}</span>
                  <span v-if="stat.unit" class="text-sm text-gray-400">{{ stat.unit }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Activity list -->
        <div class="border-t border-white/10 pt-11">
          <h2 class="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">Latest activity</h2>
          <table class="mt-6 w-full whitespace-nowrap text-left">
            <colgroup>
              <col class="w-full sm:w-4/12" />
              <col class="lg:w-4/12" />
              <col class="lg:w-2/12" />
              <col class="lg:w-1/12" />
              <col class="lg:w-1/12" />
            </colgroup>
            <thead class="border-b border-white/10 text-sm leading-6 text-white">
            <tr>
              <th scope="col" class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">User</th>
              <th scope="col" class="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">Commit</th>
              <th scope="col" class="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">Status</th>
              <th scope="col" class="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">Duration</th>
              <th scope="col" class="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">Deployed at</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
            <tr v-for="item in activityItems" :key="item.commit">
              <td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div class="flex items-center gap-x-4">
                  <img :src="item.user.imageUrl" alt="" class="h-8 w-8 rounded-full bg-gray-800" />
                  <div class="truncate text-sm font-medium leading-6 text-white">{{ item.user.name }}</div>
                </div>
              </td>
              <td class="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div class="flex gap-x-3">
                  <div class="font-mono text-sm leading-6 text-gray-400">{{ item.commit }}</div>
                  <span class="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">{{ item.branch }}</span>
                </div>
              </td>
              <td class="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                <div class="flex items-center justify-end gap-x-2 sm:justify-start">
                  <time class="text-gray-400 sm:hidden" :datetime="item.dateTime">{{ item.date }}</time>
                  <div :class="[statuses[item.status], 'flex-none rounded-full p-1']">
                    <div class="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <div class="hidden text-white sm:block">{{ item.status }}</div>
                </div>
              </td>
              <td class="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">{{ item.duration }}</td>
              <td class="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                <time :datetime="item.dateTime">{{ item.date }}</time>
              </td>
            </tr>
            </tbody>
          </table>
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
      status:null,

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
  },
  methods: {
    async fetchStats() {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        const response = await this.axios.get(base_Url + 'api/get_stats');
        console.log(response)
        this.status = response.data;

      } catch (error) {
        if (error.response.status === 401) {
          const authStore = useAuthStore();
          authStore.clearUser();
          const messageStore = useMessageStore()
          messageStore.setMessage('Yours session has expire due to lack of activity.')
          this.$router.push({ name: 'Login' });
        } else if (error.response.status === 403){
          const authStore = useAuthStore();
          authStore.clearUser();
          const messageStore = useMessageStore()
          messageStore.setMessage('Yours session has expire due to lack of activity.')
          this.$router.push({ name: 'Login' });
        } else {
          const authStore = useAuthStore();
          authStore.clearUser();
          const messageStore = useMessageStore()
          messageStore.setMessage('Something went wrong, please try again.')
          this.$router.push({ name: 'Login' });
        }
      }
    },
  }
}
</script>