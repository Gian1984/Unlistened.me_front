<script setup>
import { XCircleIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <div class="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-black">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-32 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Select new password</h2>
    </div>

    <form  @submit.prevent="resetPassword">
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
            <div class="mt-2">
              <input v-model="email" id="email" name="email" type="email" autocomplete="email" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-white">Password</label>
            </div>
            <div class="mt-2">
              <input v-model="password" id="password" name="password" type="password" autocomplete="new-password" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
            </div>
          </div>


          <div>
            <div class="flex items-center justify-between">
              <label for="password_confirmation" class="block text-sm font-medium leading-6 text-white">Confirm password</label>
            </div>
            <div class="mt-2">
              <input v-model="password_confirmation" id="password_confirmation" name="password_confirmation" type="password" autocomplete="new-password" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
            </div>
          </div>


          <div v-if="errors || match" class="rounded-md bg-red-50 p-4">
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
                    <li v-if="match">{{match}}</li>
                    <li v-if="errors.email">{{errors.email[0]}}</li>
                    <li v-if="errors.password">{{errors.password[0]}}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div v-if="empty" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <button v-on:click="closeAlertEmpty()" type="button">
                  <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                </button>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error:</h3>
                <div class="mt-2 text-sm text-red-700">
                  <ul role="list" class="list-disc space-y-1 pl-5">
                    <li>{{empty}}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="mx-auto text-center">
            <button v-if="sending" type="button" class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-pink-500 bg-black transition ease-in-out duration-150 cursor-not-allowed" disabled="">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Working...
            </button>
            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Reset password</button>
          </div>
        </div>

      </div>
    </form>
  </div>


</template>

<script>
const base_Url = import.meta.env.VITE_BASE_URL

export default {

  data(){
    return {
      token: '',
      username:'',
      email : '',
      password :'',
      password_confirmation: '',
      errors:'',
      match:'',
      empty:'',
      sending:false,
    }
  },

  methods : {

    resetPassword(e) {
      e.preventDefault();
      if (this.password !== this.password_confirmation || this.password.length <= 0) {
        this.password = "";
        this.password_confirmation = "";
        this.match = 'Passwords do not match';
        return; // Stop execution if passwords do not match
      }
      this.sending = true
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => {
            let email = this.email;
            let password = this.password;
            let password_confirmation = this.password_confirmation;
            let token = this.$route.params.token;

            return this.axios.post(base_Url + 'api/reset-password', {
              email: email,
              password: password,
              password_confirmation: password_confirmation,
              token: token
            });
          })
          .then(response => {
            this.sending = false
            this.$router.push({ name: 'Login' });
          })
          .catch(error => {
            this.sending = false
            this.errors = error.response ? error.response.data : 'An error occurred';
            setTimeout(() => {
              this.errors = null;
              this.email = null;
              this.password = null;
            }, 5000);
          });
    },

    closeAlert: function () {
      this.errors = '';
      this.match = '';
    },
    closeAlertEmpty:function () {
      this.empty = '';
    },
  },


}
</script>