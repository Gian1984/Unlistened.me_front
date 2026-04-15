<script setup>
import { ref, computed } from 'vue'
import {
  TrashIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  UserCircleIcon,
  EnvelopeIcon,
  LanguageIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline/index.js'
import { ArrowPathIcon } from '@heroicons/vue/24/solid/index.js'
import { XCircleIcon, XMarkIcon } from '@heroicons/vue/20/solid/index.js'
import PageHero from '~/src/components/PageHero.vue'
import { usePageSeo } from '~/composables/usePageSeo'
import { useAuthStore } from '~/src/stores/authStore.js'
import { userService } from '~/src/services/userService.js'

definePageMeta({
  middleware: ['auth'],
})

usePageSeo('settings')

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const object = ref('')
const description = ref('')
const sending = ref(false)
const updating = ref(false)
const preferred_language = ref('')
const show = ref(false)
const message = ref('')
const notificationType = ref('success')
const confirmDeleteOpen = ref(false)

const userInitials = computed(() => {
  const source = authStore.user?.name || authStore.user?.email || ''
  return source
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
})

const currentLanguageLabel = computed(() => {
  const code = authStore.user?.preferred_language
  return code ? (languages[code] || code) : 'Not set'
})

const descriptionLength = computed(() => description.value?.length || 0)

const languages = {
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'eu': 'Basque',
  'be': 'Belarusian',
  'bg': 'Bulgarian',
  'ca': 'Catalan',
  'zh-cn': 'Chinese (Simplified)',
  'zh-tw': 'Chinese (Traditional)',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'nl-be': 'Dutch (Belgium)',
  'nl-nl': 'Dutch (Netherlands)',
  'en': 'English',
  'en-au': 'English (Australia)',
  'en-bz': 'English (Belize)',
  'en-ca': 'English (Canada)',
  'en-ie': 'English (Ireland)',
  'en-jm': 'English (Jamaica)',
  'en-nz': 'English (New Zealand)',
  'en-ph': 'English (Philippines)',
  'en-za': 'English (South Africa)',
  'en-tt': 'English (Trinidad)',
  'en-gb': 'English (United Kingdom)',
  'en-us': 'English (United States)',
  'en-zw': 'English (Zimbabwe)',
  'et': 'Estonian',
  'fo': 'Faeroese',
  'fi': 'Finnish',
  'fr': 'French',
  'fr-be': 'French (Belgium)',
  'fr-ca': 'French (Canada)',
  'fr-fr': 'French (France)',
  'fr-lu': 'French (Luxembourg)',
  'fr-mc': 'French (Monaco)',
  'fr-ch': 'French (Switzerland)',
  'gl': 'Galician',
  'gd': 'Gaelic',
  'de': 'German',
  'de-at': 'German (Austria)',
  'de-de': 'German (Germany)',
  'de-li': 'German (Liechtenstein)',
  'de-lu': 'German (Luxembourg)',
  'de-ch': 'German (Switzerland)',
  'el': 'Greek',
  'haw': 'Hawaiian',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'in': 'Indonesian',
  'ga': 'Irish',
  'it': 'Italian',
  'it-it': 'Italian (Italy)',
  'it-ch': 'Italian (Switzerland)',
  'ja': 'Japanese',
  'ko': 'Korean',
  'mk': 'Macedonian',
  'no': 'Norwegian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'pt-br': 'Portuguese (Brazil)',
  'pt-pt': 'Portuguese (Portugal)',
  'ro': 'Romanian',
  'ro-mo': 'Romanian (Moldova)',
  'ro-ro': 'Romanian (Romania)',
  'ru': 'Russian',
  'ru-mo': 'Russian (Moldova)',
  'ru-ru': 'Russian (Russia)',
  'sr': 'Serbian',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'es': 'Spanish',
  'es-ar': 'Spanish (Argentina)',
  'es-bo': 'Spanish (Bolivia)',
  'es-cl': 'Spanish (Chile)',
  'es-co': 'Spanish (Colombia)',
  'es-cr': 'Spanish (Costa Rica)',
  'es-do': 'Spanish (Dominican Republic)',
  'es-ec': 'Spanish (Ecuador)',
  'es-sv': 'Spanish (El Salvador)',
  'es-gt': 'Spanish (Guatemala)',
  'es-hn': 'Spanish (Honduras)',
  'es-mx': 'Spanish (Mexico)',
  'es-ni': 'Spanish (Nicaragua)',
  'es-pa': 'Spanish (Panama)',
  'es-py': 'Spanish (Paraguay)',
  'es-pe': 'Spanish (Peru)',
  'es-pr': 'Spanish (Puerto Rico)',
  'es-es': 'Spanish (Spain)',
  'es-uy': 'Spanish (Uruguay)',
  'es-ve': 'Spanish (Venezuela)',
  'sv': 'Swedish',
  'sv-fi': 'Swedish (Finland)',
  'sv-se': 'Swedish (Sweden)',
  'tr': 'Turkish',
  'uk': 'Ukrainian',
}

function showNotification(msg, type = 'success') {
  message.value = msg
  notificationType.value = type
  show.value = true
  setTimeout(() => {
    show.value = false
    message.value = null
  }, 5000)
}

async function updateAccount() {
  updating.value = true
  try {
    const payload = {}
    if (username.value) payload.name = username.value
    if (email.value) payload.email = email.value
    if (preferred_language.value) payload.preferred_language = preferred_language.value

    const response = await userService.updateAccount(payload)
    authStore.updateUser(payload)
    updating.value = false
    showNotification(response.data.message, 'success')
  } catch (error) {
    updating.value = false
    if (error.response && error.response.data && error.response.data.errors) {
      showNotification(Object.values(error.response.data.errors).join(', '), 'error')
    } else {
      showNotification('There was an error updating your information. Please try later.', 'error')
    }
  }
}

async function sendReq() {
  sending.value = true
  try {
    const response = await userService.sendFaq(object.value, description.value)
    sending.value = false
    showNotification(response.data.message, 'success')
    object.value = null
    description.value = null
  } catch (error) {
    object.value = null
    description.value = null
    sending.value = false
    showNotification('Error while sending. Please try later.', 'error')
  }
}

function openDeleteConfirm() {
  confirmDeleteOpen.value = true
}

function closeDeleteConfirm() {
  confirmDeleteOpen.value = false
}

async function confirmDeleteAccount() {
  if (!authStore.user?.id) {
    confirmDeleteOpen.value = false
    showNotification('No authenticated user available.', 'error')
    return
  }

  try {
    await userService.deleteAccount(authStore.user.id)
    authStore.clearUser()
    router.push('/login')
  } catch (error) {
    confirmDeleteOpen.value = false
    showNotification('There was an error while deleting your account, please try later.', 'error')
  }
}
</script>
<template>


  <!--  Notification  -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component :is="notificationType === 'success' ? CheckCircleIcon : XCircleIcon" :class="notificationType === 'success' ? 'h-6 w-6 text-green-400' : 'h-6 w-6 text-red-500'" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-white">{{message}}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="show = false" class="inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
  <!--  Notification  -->


  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mx-auto max-w-4xl">
        <!-- Header -->
        <PageHero
          eyebrow="Your account"
          title="Settings"
          description="Update your personal information, reach out for support, or manage your account."
          :breadcrumbs="[
            { label: 'Home', to: '/' },
            { label: 'Settings' },
          ]"
        />

        <!-- Profile hero -->
        <section class="mb-8 overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-indigo-500/10 via-gray-900/50 to-gray-900/50 p-6 sm:p-8">
          <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
              {{ userInitials }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-lg font-semibold text-white">{{ authStore.user?.name }}</p>
              <p class="mt-0.5 truncate text-sm text-gray-400">{{ authStore.user?.email }}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-700">
                  <LanguageIcon class="h-3.5 w-3.5" />
                  {{ currentLanguageLabel }}
                </span>
                <span
                    v-if="authStore.user?.is_admin"
                    class="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-2.5 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-500/20"
                >
                  Admin
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Personal information -->
        <section class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              <UserCircleIcon class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white">Personal information</h2>
              <p class="mt-1 text-sm leading-6 text-gray-400">
                Update your username, email, and language preferences.
              </p>
            </div>
          </div>

          <div class="mt-6 space-y-5">
            <div>
              <label for="username" class="block text-sm font-medium leading-6 text-white">Username</label>
              <div class="mt-2 max-w-xl">
                <input
                    v-model="username"
                    type="text"
                    name="username"
                    id="username"
                    :placeholder="authStore.user?.name || 'Username'"
                    required
                    class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
              <div class="mt-2 max-w-xl">
                <input
                    v-model="email"
                    id="email"
                    name="email"
                    type="email"
                    :placeholder="authStore.user?.email || 'Email address'"
                    autocomplete="email"
                    required
                    class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label for="location" class="block text-sm font-medium leading-6 text-white">Language</label>
              <div class="mt-2 max-w-xl">
                <select
                    id="location"
                    v-model="preferred_language"
                    name="location"
                    class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option v-if="authStore.user?.preferred_language" selected value="">{{ languages[authStore.user.preferred_language] || authStore.user.preferred_language }}</option>
                  <option v-else selected value="">Your language</option>
                  <option v-for="(lang, code) in languages" :key="code" :value="code">
                    {{ lang }}
                  </option>
                </select>
              </div>
            </div>

            <div class="pt-2">
              <button
                  v-if="!updating"
                  @click="updateAccount()"
                  class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                <ArrowPathIcon class="h-4 w-4" />
                Update
              </button>
              <button
                  v-else
                  type="button"
                  disabled
                  class="inline-flex items-center gap-2 rounded-lg bg-indigo-600/50 px-4 py-2.5 text-sm font-medium text-white cursor-not-allowed"
              >
                <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </button>
            </div>
          </div>
        </section>

        <!-- Contact us -->
        <section class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              <ChatBubbleLeftRightIcon class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white">Contact us</h2>
              <p class="mt-1 text-sm leading-6 text-gray-400">
                Have a question or need help? Send us a message and we will get back to you soon.
              </p>
            </div>
          </div>

          <div class="mt-6 space-y-5">
            <div>
              <label for="object" class="block text-sm font-medium leading-6 text-white">Subject</label>
              <div class="mt-2 max-w-xl">
                <input
                    v-model="object"
                    type="text"
                    name="object"
                    id="object"
                    placeholder="Subject"
                    required
                    class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label for="description" class="block text-sm font-medium leading-6 text-white">Description</label>
                <span class="text-xs text-gray-500">{{ descriptionLength }} / 255</span>
              </div>
              <div class="mt-2 max-w-xl">
                <textarea
                    v-model="description"
                    maxlength="255"
                    id="description"
                    name="description"
                    rows="6"
                    placeholder="Enter your message (max 255 characters)"
                    required
                    class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div class="pt-2">
              <button
                  v-if="!sending"
                  @click="sendReq()"
                  class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                <PaperAirplaneIcon class="h-4 w-4" />
                Send
              </button>
              <button
                  v-else
                  type="button"
                  disabled
                  class="inline-flex items-center gap-2 rounded-lg bg-indigo-600/50 px-4 py-2.5 text-sm font-medium text-white cursor-not-allowed"
              >
                <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </button>
            </div>
          </div>
        </section>

        <!-- Danger zone -->
        <section class="mb-10 rounded-2xl border border-red-500/30 bg-red-500/5 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20">
              <ExclamationTriangleIcon class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white">Delete account</h2>
              <p class="mt-1 max-w-3xl text-sm leading-6 text-gray-400">
                Deleting your account permanently removes your profile, saved podcasts, bookmarks, and preferences. This action cannot be undone.
              </p>
            </div>
          </div>

          <div class="mt-6">
            <button
                @click="openDeleteConfirm"
                class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
            >
              <TrashIcon class="h-4 w-4" />
              Delete account
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>

  <!-- Delete confirmation modal -->
  <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
  >
    <div
        v-if="confirmDeleteOpen"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        @click.self="closeDeleteConfirm"
    >
      <div class="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <div class="flex items-start gap-4">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20">
            <ExclamationTriangleIcon class="h-6 w-6" />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-white">Delete your account?</h3>
            <p class="mt-2 text-sm leading-6 text-gray-400">
              This will permanently remove your profile, saved podcasts, bookmarks and preferences. This action cannot be undone.
            </p>
          </div>
        </div>

        <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
              type="button"
              @click="closeDeleteConfirm"
              class="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
              type="button"
              @click="confirmDeleteAccount"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
          >
            <TrashIcon class="h-4 w-4" />
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
