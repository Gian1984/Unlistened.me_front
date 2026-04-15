<script setup>
import { ref, computed } from 'vue'
import { XCircleIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/authStore.js'
import { useMessageStore } from '@/stores/messageStore.js'
import { authService } from '@/services/authService.js'
import { useSeo } from '@/seo/composables/useSeo.js'
import { loginSeo } from '@/seo/registry/index.js'

useSeo(loginSeo)

const authStore = useAuthStore()
const messageStore = useMessageStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errors = ref(false)
const sending = ref(false)

const message = computed(() => messageStore.message)

async function login() {
  sending.value = true
  try {
    const response = await authService.login(email.value, password.value)
    authStore.setUser(response.data.user)
    messageStore.clearMessage()
    sending.value = false
    router.push('/')
  } catch (error) {
    messageStore.clearMessage()
    sending.value = false
    errors.value = error.response.data
    setTimeout(() => {
      errors.value = null
      email.value = ''
      password.value = ''
    }, 5000)
  }
}

function closeAlert() {
  errors.value = ''
}
</script>

<template>
  <div class="flex min-h-screen flex-col justify-center bg-gray-950 px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-28 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Unlistened.me logo" />
      <p class="mt-6 text-center text-sm font-semibold text-indigo-400">Welcome back</p>
      <h1 class="mt-2 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Sign in to your account
      </h1>
      <p class="mt-3 text-center text-sm text-gray-400">
        Pick up where you left off and access your saved podcasts.
      </p>
      <p v-if="message" class="mt-4 text-center text-sm text-gray-400">{{ message }}</p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
        <form @submit.prevent="login" class="space-y-6">
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
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-white">Password</label>
              <NuxtLink
                  to="/forgot_password"
                  class="text-sm font-semibold text-indigo-400 transition-colors hover:text-pink-400"
              >
                Forgot password?
              </NuxtLink>
            </div>
            <div class="mt-2">
              <input
                  v-model="password"
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div v-if="errors" class="rounded-lg border border-red-500/40 bg-red-500/10 p-4">
            <div class="flex items-start gap-3">
              <XCircleIcon class="h-5 w-5 flex-none text-red-400" aria-hidden="true" />
              <div class="flex-1 text-sm text-red-300">
                {{ errors.error }}
              </div>
              <button @click="closeAlert" type="button" class="text-red-400 hover:text-red-300">
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
            Sign in
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
            Signing in...
          </button>
        </form>
      </div>

      <p class="mt-6 text-center text-sm text-gray-500">
        New to Unlistened.me?
        <NuxtLink to="/sign_up" class="font-semibold text-indigo-400 transition-colors hover:text-pink-400">
          Create an account
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
