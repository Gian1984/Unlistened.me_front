<script setup>
import { ref } from 'vue'
import { XCircleIcon } from '@heroicons/vue/20/solid'
import { authService } from '@/services/authService.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const checked = ref(false)
const errorsRegister = ref('')
const empty = ref('')
const sending = ref(false)

async function signup() {
  sending.value = true

  if (checked.value) {
    try {
      await authService.register(username.value, email.value, password.value)
      sending.value = false
      router.push('/login')
    } catch (error) {
      sending.value = false
      errorsRegister.value = error.response.data
      setTimeout(() => {
        errorsRegister.value = null
        email.value = ''
        password.value = ''
        checked.value = false
      }, 5000)
    }
  } else {
    sending.value = false
    password.value = ''
    empty.value = 'Please accept the terms and conditions.'
    setTimeout(() => {
      empty.value = null
    }, 5000)
  }
}

function closeAlert() {
  errorsRegister.value = ''
}

function closeAlertEmpty() {
  empty.value = ''
}
</script>

<template>
  <div class="flex min-h-screen flex-col justify-center bg-gray-950 px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-28 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Unlistened.me logo" />
      <p class="mt-6 text-center text-sm font-semibold text-indigo-400">Join Unlistened</p>
      <h1 class="mt-2 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Create your account
      </h1>
      <p class="mt-3 text-center text-sm text-gray-400">
        Save your favorite shows and pick up where you left off. Free, forever.
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
        <form @submit.prevent="signup" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium leading-6 text-white">Username</label>
            <div class="mt-2">
              <input
                  v-model="username"
                  type="text"
                  name="username"
                  id="username"
                  autocomplete="username"
                  required
                  class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

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

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-white">Password</label>
            <div class="mt-2">
              <input
                  v-model="password"
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <input
                v-model="checked"
                id="terms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
            />
            <label for="terms" class="text-sm text-gray-300">
              I accept the
              <router-link to="/terms" class="font-semibold text-indigo-400 transition-colors hover:text-pink-400">
                terms and conditions
              </router-link>
            </label>
          </div>

          <div v-if="errorsRegister" class="rounded-lg border border-red-500/40 bg-red-500/10 p-4">
            <div class="flex items-start gap-3">
              <XCircleIcon class="h-5 w-5 flex-none text-red-400" aria-hidden="true" />
              <ul class="flex-1 list-disc space-y-1 pl-4 text-sm text-red-300">
                <li v-if="errorsRegister.password">{{ errorsRegister.password[0] }}</li>
                <li v-if="errorsRegister.email">{{ errorsRegister.email[0] }}</li>
              </ul>
              <button @click="closeAlert" type="button" class="text-red-400 hover:text-red-300">
                <span class="sr-only">Close</span>
                <XCircleIcon class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div v-if="empty" class="rounded-lg border border-red-500/40 bg-red-500/10 p-4">
            <div class="flex items-start gap-3">
              <XCircleIcon class="h-5 w-5 flex-none text-red-400" aria-hidden="true" />
              <p class="flex-1 text-sm text-red-300">{{ empty }}</p>
              <button @click="closeAlertEmpty" type="button" class="text-red-400 hover:text-red-300">
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
            Sign up
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
            Creating account...
          </button>
        </form>
      </div>

      <p class="mt-6 text-center text-sm text-gray-500">
        Already have an account?
        <router-link to="/login" class="font-semibold text-indigo-400 transition-colors hover:text-pink-400">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>
