<script setup>
import { XCircleIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/authStore';
import { useMessageStore } from '@/stores/messageStore';
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-32 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
      <p v-if="message" class="mt-5 text-center text-white font-bold">{{ message }}</p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
          <div class="mt-2">
            <input v-model="email" id="email" name="email" type="email" autocomplete="email" required="" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-white">Password</label>
            <div class="text-sm">
              <router-link  to="/forgot_password" class="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</router-link>
            </div>
          </div>
          <div class="mt-2">
            <input  v-model="password" id="password" name="password" type="password"  required="" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div v-if="errors" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <button v-on:click="closeAlert()" type="button">
                <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
              </button>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <div class="mt-2 text-sm text-red-700">
                <ul role="list" class="list-disc space-y-1 pl-5">
                  <li>{{errors.error}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button @click="login" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Login</button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>

const base_Url = import.meta.env.VITE_BASE_URL

export default {
  data() {
    return {
      email: '',
      password: '',
      errors: false,
    };
  },
  computed: {
    message() {
      const messageStore = useMessageStore()
      return messageStore.message
    },
  },
  methods: {
    login() {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/login', {
            email: this.email,
            password: this.password
          }))
          .then(response => {
            const authStore = useAuthStore();
            authStore.setUser(response.data.user);
            const messageStore = useMessageStore();
            messageStore.clearMessage();
            this.$router.push('/');
          })
          .catch(error => {
            const messageStore = useMessageStore();
            messageStore.clearMessage();
            this.errors = error.response.data;
            setTimeout(() => {
                  this.errors = null;
                  this.email = null;
                  this.password = null;
            }, 5000);
          });
    },

    closeAlert: function () {
      this.errors = '';
    },
  }
};
</script>
