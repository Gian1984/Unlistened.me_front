<script setup>
import { ref } from 'vue'
import { XCircleIcon, CheckCircleIcon } from '@heroicons/vue/20/solid'
import { authService } from '@/services/authService.js'
import { useSeo } from '@/seo/composables/useSeo.js'
import { forgotSeo } from '@/seo/registry/index.js'

useSeo(forgotSeo)

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
  <div class="flex min-h-screen flex-col justify-center bg-gray-950 px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-28 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Unlistened.me logo" />
      <p class="mt-6 text-center text-sm font-semibold text-indigo-400">Account recovery</p>
      <h1 class="mt-2 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Reset your password
      </h1>
      <p class="mt-4 text-center text-sm text-gray-400">
        Enter your email and we will send you a link to reset your password.
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
        <div class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
            <div class="mt-2">
              <input
                  v-model="email"
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div v-if="errors" class="rounded-lg border border-red-500/40 bg-red-500/10 p-4">
            <div class="flex items-start gap-3">
              <XCircleIcon class="h-5 w-5 flex-none text-red-400" aria-hidden="true" />
              <p class="flex-1 text-sm text-red-300">{{ errors }}</p>
              <button @click="closeAlert" type="button" class="text-red-400 hover:text-red-300">
                <span class="sr-only">Close</span>
                <XCircleIcon class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div v-if="validation" class="rounded-lg border border-green-500/40 bg-green-500/10 p-4">
            <div class="flex items-start gap-3">
              <CheckCircleIcon class="h-5 w-5 flex-none text-green-400" aria-hidden="true" />
              <p class="flex-1 text-sm text-green-300">{{ validation }}</p>
              <button @click="closeAlert" type="button" class="text-green-400 hover:text-green-300">
                <span class="sr-only">Close</span>
                <XCircleIcon class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <template v-if="!validation">
            <button
                v-if="!resetting"
                @click="reset"
                class="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Send reset link
            </button>
            <button
                v-else
                type="button"
                disabled
                class="flex w-full items-center justify-center rounded-lg bg-indigo-600/50 px-4 py-2.5 text-sm font-semibold text-white cursor-not-allowed"
            >
              <svg class="-ml-1 mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Working...
            </button>
          </template>

          <router-link
              v-else
              to="/login"
              class="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Go to login
          </router-link>
        </div>
      </div>

      <p class="mt-6 text-center text-sm text-gray-500">
        Remember your password?
        <router-link to="/login" class="font-semibold text-indigo-400 transition-colors hover:text-pink-400">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>
