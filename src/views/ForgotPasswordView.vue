<script setup>
import { XCircleIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-32 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="unlistened.me logo" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Reset Your Password</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-white">Email verification</label>
          <div class="mt-2">
            <input v-model="email" id="email" name="email" type="email" autocomplete="email" required="" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
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
                  <li>{{errors}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div v-if="validation" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <button v-on:click="closeAlert()" type="button">
                <XCircleIcon class="h-5 w-5 text-green-800" aria-hidden="true" />
              </button>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Success!</h3>
              <div class="mt-2 text-sm text-green-700">
                <ul role="list" class="list-disc space-y-1 pl-5">
                  <li>{{validation}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!validation">
          <button @click="reset" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Proceed
          </button>
        </div>
        <div v-if="validation">
          <router-link to="/login" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Go to login
          </router-link>
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
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      validation:"",
      errors:"",
    };
  },
  methods: {
    login(){
      if (this.email.length > 0) {
        let email = this.email

        this.axios.post(base_Url+'api/forgot-password',{email}).then(response=>{
          this.validation = response.data.message
        }).catch((error)=>{
          this.errors = error
          setTimeout(() => {
            this.errors = null;
          }, 5000);
        });
      }
    },

    reset() {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/forgot-password', {
            email: this.email,
          }))
          .then(response => {
            this.email = '';
            this.validation = response.data.message;
          })
          .catch(error => {
            this.email = '';
            this.errors = error.response.data.message;
            setTimeout(() => {
              this.errors = null;
            }, 5000);
          });
    },

    closeAlert: function () {
      this.errors = '';
      this.validation = '';
    },
  }
};
</script>