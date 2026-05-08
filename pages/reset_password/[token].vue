<script setup>
import { ref } from 'vue'
import { XCircleIcon } from '@heroicons/vue/20/solid'
import { authService } from '@/services/authService.js'

definePageMeta({
  middleware: ['guest'],
  layout: false,
})

useSeoMeta({
  title: 'Reset Password',
  description: 'Set a new password for your Unlistened.me account.',
})

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const errors = ref('')
const match = ref('')
const empty = ref('')
const sending = ref(false)

async function resetPassword() {
  if (password.value !== passwordConfirmation.value || password.value.length <= 0) {
    password.value = ''
    passwordConfirmation.value = ''
    match.value = 'Passwords do not match'
    return
  }
  sending.value = true
  try {
    await authService.resetPassword(email.value, password.value, passwordConfirmation.value, route.params.token)
    sending.value = false
    router.push('/login')
  } catch (error) {
    sending.value = false
    errors.value = error.response ? error.response.data : 'An error occurred'
    setTimeout(() => {
      errors.value = null
      email.value = ''
      password.value = ''
    }, 5000)
  }
}

function closeAlert() {
  errors.value = ''
  match.value = ''
}

function closeAlertEmpty() {
  empty.value = ''
}
</script>

<template>
  <div class="flex min-h-screen flex-col justify-center bg-gray-950 px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-28 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Unlistened.me logo" />
      <p class="mt-6 text-center text-sm font-semibold text-indigo-400">Account recovery</p>
      <h1 class="mt-2 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Select a new password
      </h1>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
        <form class="space-y-6" @submit.prevent="resetPassword">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
            <div class="mt-2">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-white">Password</label>
            <div class="mt-2">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium leading-6 text-white">Confirm password</label>
            <div class="mt-2">
              <input
                id="password_confirmation"
                v-model="passwordConfirmation"
                name="password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div v-if="errors || match" class="rounded-lg border border-red-500/40 bg-red-500/10 p-4">
            <div class="flex items-start gap-3">
              <XCircleIcon class="h-5 w-5 flex-none text-red-400" aria-hidden="true" />
              <ul class="flex-1 list-disc space-y-1 pl-4 text-sm text-red-300">
                <li v-if="match">{{ match }}</li>
                <li v-if="errors.email">{{ errors.email[0] }}</li>
                <li v-if="errors.password">{{ errors.password[0] }}</li>
              </ul>
              <button type="button" class="text-red-400 hover:text-red-300" @click="closeAlert">
                <span class="sr-only">Close</span>
                <XCircleIcon class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div v-if="empty" class="rounded-lg border border-red-500/40 bg-red-500/10 p-4">
            <div class="flex items-start gap-3">
              <XCircleIcon class="h-5 w-5 flex-none text-red-400" aria-hidden="true" />
              <p class="flex-1 text-sm text-red-300">{{ empty }}</p>
              <button type="button" class="text-red-400 hover:text-red-300" @click="closeAlertEmpty">
                <span class="sr-only">Close</span>
                <XCircleIcon class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <button
            v-if="!sending"
            type="submit"
            class="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Reset password
          </button>

          <button
            v-else
            type="button"
            disabled
            class="flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-indigo-600/50 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <svg class="-ml-1 mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Working...
          </button>
        </form>
      </div>

      <p class="mt-6 text-center text-sm text-gray-500">
        Back to
        <NuxtLink to="/login" class="font-semibold text-indigo-400 transition-colors hover:text-pink-400">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
