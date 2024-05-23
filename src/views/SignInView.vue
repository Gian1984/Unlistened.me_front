<script setup>
import { XCircleIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-32 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-white">Username</label>
          <div class="mt-2">
            <input v-model="username" type="text" name="username" id="username" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
          </div>
        </div>
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
            <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <label for="terms" class="block text-sm font-medium leading-6"><router-link to="/terms" class="text-indigo-400 hover:text-indigo-300">Terms & conditions</router-link></label>
          </div>
          <div class="mt-2 flex items-center">
            <input v-model="checked" name="terms" id="terms" type="checkbox" checked required />
            <p id="candidates-description" class="text-white text-sm ml-2">
              I understand and accept
            </p>
          </div>
        </div>

        <div v-if="errorsRegister" class="rounded-md bg-red-50 p-4">
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
                  <li v-if="errorsRegister.password">{{errorsRegister.password[0]}}</li>
                  <li v-if="errorsRegister.email">{{errorsRegister.email[0]}}</li>
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

        <div>
          <button @click="signup" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign up</button>
        </div>
      </div>

    </div>
  </div>


</template>

<script>
const base_Url = import.meta.env.VITE_BASE_URL

export default {

  data(){
    return {
      username:'',
      email : '',
      password :'',
      submitted: false,
      errorsRegister:'',
      checked: false,
      alertOpen: true,
      empty:''
    }
  },

  methods : {

    async signup() {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        if ( this.checked != false ) {

          const response = await this.axios.post(base_Url + 'api/register', {
            name: this.username,
            email: this.email,
            password: this.password
          });
          this.$router.push('/login');
          console.log('Sign up successful', response.data);

        } else{
          this.password = ''
          this.empty = 'Please accept Terms & conditions'
        }

      } catch (error) {
        console.error('Login error', error);
        this.errorsRegister = error.response.data
        this.password = ''
        this.checked = false
      }
    },

    closeAlert: function () {
      this.errorsRegister = '';
    },
    closeAlertEmpty:function () {
      this.empty = '';
    },
  },


}
</script>
