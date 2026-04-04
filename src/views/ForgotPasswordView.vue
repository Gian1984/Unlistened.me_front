<script setup>
import { ref } from 'vue'
import { XCircleIcon } from '@heroicons/vue/20/solid'
import { authService } from '@/services/authService.js'

const email = ref('')
const validation = ref('')
const errors = ref('')
const resetting = ref(false)

async function reset() {
  resetting.value = true
  try {
    const response = await authService.forgotPassword(email.value)
    email.value = ''
    resetting.value = false
    validation.value = response.data.message
  } catch (error) {
    email.value = ''
    resetting.value = false
    errors.value = error.response.data.message
    setTimeout(() => {
      errors.value = null
    }, 5000)
  }
}

function closeAlert() {
  errors.value = ''
  validation.value = ''
}
</script>

<template>
  <div class="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-black">
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

        <div class="mx-auto text-center" v-if="!validation">
          <button v-if="resetting" type="button" class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-pink-500 bg-black transition ease-in-out duration-150 cursor-not-allowed" disabled="">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Working...
          </button>
          <button @click="reset" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Proceed
          </button>
        </div>
        <div v-else>
          <router-link to="/login" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Go to login
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>
