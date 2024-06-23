<script setup>
import {TrashIcon, PaperAirplaneIcon, CheckCircleIcon} from "@heroicons/vue/24/outline/index.js";
import {ArrowPathIcon} from "@heroicons/vue/24/solid/index.js";
import {useAuthStore} from "@/stores/authStore.js";
import { XCircleIcon, XMarkIcon} from "@heroicons/vue/20/solid/index.js";
let authStore = useAuthStore();
</script>
<template>


  <!--  Notification  -->
  <div aria-live="assertive" class="pointer-events-none fixed z-10 inset-0 flex items-end px-4 py-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component :is="notificationType === 'success' ? CheckCircleIcon : XCircleIcon" :class="notificationType === 'success' ? 'h-6 w-6 text-green-400' : 'h-6 w-6 text-red-500'" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">{{message}}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="show = false" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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


  <div class="mx-auto max-w-7xl px-6 lg:px-8 bg-black py-24 sm:py-32">
    <div class="mx-auto max-w-2xl lg:max-w-4xl">
      <div class="px-4 sm:px-0">
        <h1 class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">Personal information</h1>
        <p class="mt-8 max-w-2xl text-base leading-6 text-white">
          Welcome to the Settings page of Unlistened.me. From here, you can easily update your personal information to better tailor your podcast listening experience. Modify your profile details, and customize your preferences to ensure Unlistened meets your needs.<br><br>
          Take control of your account and make the most out of your podcast journey with Unlistened.
        </p>
      </div>
      <div class="mt-6 border-t border-gray-100">
        <dl class="divide-y divide-gray-100">

          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-white">Username</dt>
            <dd class="mt-1 sm:col-span-2 sm:mt-0">
              <div class="max-w-xl">
                <label for="email" class="sr-only">Username</label>
                <div>
                  <input v-model="username" type="text" name="username" id="username" :placeholder="authStore.user.name" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
                </div>
              </div>
            </dd>
          </div>

          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-white">Email address</dt>
            <dd class="mt-1 sm:col-span-2 sm:mt-0">
              <div class="max-w-xl">
                <label for="email" class="sr-only">Email address</label>
                <div>
                  <input v-model="email" id="email" name="email" type="email" :placeholder="authStore.user.email" autocomplete="email" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
                </div>
              </div>
            </dd>
          </div>

          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-white">Language</dt>
            <dd class="mt-1 sm:col-span-2 sm:mt-0">
              <div class="max-w-xl">
                <label for="location" class="sr-only">Languages</label>
                <div>
                  <select id="location" v-model="preferred_language" name="location" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6">
                    <option v-if="authStore.user.preferred_language" selected class="text-gray-500" value="">{{ languages[authStore.user.preferred_language] || authStore.user.preferred_language }}</option>
                    <option v-else selected class="text-gray-500" value="">Your language</option>
                    <option v-for="(lang, code) in languages" :key="code" :value="code">
                      {{ lang }}
                    </option>
                  </select>
                </div>
              </div>
            </dd>
          </div>

          <div class="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900"></dt>
            <dd class="mt-1 sm:col-span-2 sm:mt-0">
              <div class="flex">
                <button @click="updateAccount()" class="flex bg-pink-500 text-white hover:bg-indigo-600 font-bold text-sm py-2 px-4 mx-1 rounded-full">
                  <ArrowPathIcon class="h-5 w-5 mr-1" />
                  Update
                </button>
                <button v-if="updating" type="button" class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-pink-500 bg-black transition ease-in-out duration-150 cursor-not-allowed" disabled="">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Upadating...
                </button>
              </div>
            </dd>
          </div>
        </dl>
      </div>
      <div class="px-4 sm:px-0 mt-20">
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Contact us</h2>
        <p class="mt-3 max-w-2xl text-base leading-6 text-white">
          If you have any questions or need assistance, please fill out the form below and our support team will get back to you as soon as possible.
        </p>
      </div>
      <div class="mt-6 border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-white">Object</dt>
            <dd class="mt-1 sm:col-span-2 sm:mt-0">
              <div class="max-w-xl">
                <label for="object" class="sr-only">Object</label>
                <div class="mt-2">
                  <input v-model="object" type="text" name="object" id="object" placeholder="Object" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
                </div>
              </div>
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-white">Description</dt>
            <dd class="mt-1 sm:col-span-2 sm:mt-0">
              <div class="max-w-xl">
                <label for="description" class="sr-only">Email address</label>
                <div class="mt-2">
                  <textarea v-model="description"  maxlength="255"  id="description" name="description" type="text" rows="6" placeholder="Enter your message (max 255 characters)" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
                </div>
              </div>
            </dd>
          </div>

          <div class="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900"></dt>
            <dd class="mt-1 sm:col-span-2 sm:mt-0">
              <div class="flex">
                <button @click="sendReq()" class="flex bg-pink-500 text-white hover:bg-indigo-600 font-bold text-sm py-2 px-4 mx-1 rounded-full">
                  <PaperAirplaneIcon class="h-5 w-5 mr-1" />
                  Send
                </button>
                <button v-if="sending" type="button" class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-pink-500 bg-black transition ease-in-out duration-150 cursor-not-allowed" disabled="">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </button>
              </div>
            </dd>
          </div>
        </dl>
      </div>
      <div class="px-4 sm:px-0 mt-20">
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Delete account</h2>
        <p class="mt-3 max-w-2xl text-base leading-6 text-white">
          We're sorry to see you go. By deleting your account, you will permanently lose access to your profile, saved podcasts, bookmarks, and all personalized settings. This action cannot be undone.<br><br>
          If you are certain you want to proceed, please confirm your decision below. Should you have any questions or need assistance, feel free to reach out to our support team before finalizing this action.<br><br>
          Thank you for being a part of Unlistened.me. We hope to see you again in the future.
        </p>
      </div>
      <div class="mt-6 border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-gray-900 sr-only">Delete</dt>
            <dd class="mt-1 sm:col-span-2 sm:mt-0">
              <button @click="deleteAccount(authStore.user)" class="flex bg-red-500 text-white hover:bg-red-50 hover:text-gray-900 font-bold text-sm py-2 px-4 mx-1 rounded-full">
                <TrashIcon class="h-5 w-5 mr-1" />
                Delete
              </button>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import {useAuthStore} from "@/stores/authStore.js";

const base_Url = import.meta.env.VITE_BASE_URL
import { ref } from 'vue'
const show = ref(false)
const message = ref('');
const notificationType = ref('success');


export default {
  data() {
    return {
      username: '',
      email: '',
      object: '',
      description: '',
      sending: false,
      updating: false,
      preferred_language: '',
      languages: {
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
      },
    };
  },
  methods: {
    updateAccount() {

      this.updating = true
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => {
            const payload = {};
            if (this.username) {
              payload.name = this.username;
            }
            if (this.email) {
              payload.email = this.email;
            }
            if (this.preferred_language){
              payload.preferred_language = this.preferred_language;
            }
            return this.axios.post(base_Url + 'api/update_user', payload);
          })
          .then(response => {
            const payload = {};
            if (this.username) {
              payload.name = this.username;
            }
            if (this.email) {
              payload.email = this.email;
            }
            if (this.preferred_language){
              payload.preferred_language = this.preferred_language;
            }

            const authStore = useAuthStore();
            authStore.updateUser(payload);

            this.updating = false
            show.value = true;
            message.value = response.data.message;
            notificationType.value = 'success';

            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);

          })
          .catch(error => {
            if (error.response && error.response.data && error.response.data.errors) {

              message.value = Object.values(error.response.data.errors).join(', ');
              notificationType.value = 'error';

              this.updating = false
              show.value = true;
              setTimeout(() => {
                show.value = false;
                message.value = null;
              }, 5000);

            } else {

              message.value = 'There was an error updating your information. Please try later.';
              notificationType.value = 'error';

              this.updating = false
              show.value = true;
              setTimeout(() => {
                show.value = false;
                message.value = null;
              }, 5000);

            }

            message.value = 'There was an error updating your information. Please try later.';
            notificationType.value = 'error';

            this.updating = false
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          });
    },

    sendReq() {
      this.sending = true

      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.post(base_Url + 'api/new-faq', {
            message_obj: this.object,
            message_desc: this.description,
          }))
          .then(response => {

            this.sending = false
            show.value = true;
            message.value = response.data.message;
            notificationType.value = 'success';
            this.object = null;
            this.description = null;

            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);

          })
          .catch(error => {
            this.object = null;
            this.description = null;
            message.value = 'Error while sending. Please try later.';
            notificationType.value = 'error';
            this.sending = false
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);
          });
    },

    deleteAccount(user) {
      this.axios.defaults.withCredentials = true;
      this.axios.defaults.withXSRFToken = true;

      this.axios.get(base_Url + 'sanctum/csrf-cookie')
          .then(() => this.axios.delete(base_Url + `api/delete_users/${user.id}`))
          .then(response => {
            const authStore = useAuthStore();
            authStore.clearUser();
            this.$router.push({ name: 'SignIn' });
          })
          .catch(error => {
            message.value = 'There was an error while deleting your account, please try later.';
            notificationType.value = 'error';
            show.value = true;
            setTimeout(() => {
              show.value = false;
              message.value = null;
            }, 5000);

          });
    },

  }
};
</script>