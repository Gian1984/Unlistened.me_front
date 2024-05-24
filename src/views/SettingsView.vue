<script setup>
import {TrashIcon, PaperAirplaneIcon} from "@heroicons/vue/24/outline/index.js";
import {ArrowPathIcon} from "@heroicons/vue/24/solid/index.js";
import {useAuthStore} from "@/stores/authStore.js";
import {XCircleIcon} from "@heroicons/vue/20/solid/index.js";
let authStore = useAuthStore();
</script>
<template>
  <div class=" px-6 py-24 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm pb-12">
      <img class="mx-auto h-24 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Unlistened.me logo" />
    </div>
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
              <div class="mt-2">
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
              <div class="mt-2">
                <input v-model="email" id="email" name="email" type="email" :placeholder="authStore.user.email" autocomplete="email" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
              </div>
            </div>
          </dd>
        </div>
        <div v-if="successUpdate" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Success</dt>
          <dd class="mt-1 sm:col-span-2 sm:mt-0">
            <div class="max-w-xl">
              <div class="rounded-md bg-green-50 p-4">
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
                        <li>{{successUpdate}}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dd>
        </div>
        <div v-if="errorUpdate" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Error</dt>
          <dd class="mt-1 sm:col-span-2 sm:mt-0">
            <div class="max-w-xl">
              <div class="rounded-md bg-red-50 p-4">
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
                        <li>{{errorUpdate}}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Update</dt>
          <dd class="mt-1 sm:col-span-2 sm:mt-0">
            <button @click="updateAccount()" class="flex bg-pink-500 text-white hover:bg-indigo-600 font-bold text-sm py-2 px-4 mx-1 rounded-full">
              <ArrowPathIcon class="h-5 w-5 mr-1" />
              Update
            </button>
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
                <textarea v-model="description" id="description" name="description" type="text" rows="6" placeholder="Your questions here ..." class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" required/>
              </div>
            </div>
          </dd>
        </div>
        <div v-if="successFaq" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Success</dt>
          <dd class="mt-1 sm:col-span-2 sm:mt-0">
            <div class="max-w-xl">
              <div class="rounded-md bg-green-50 p-4">
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
                        <li>{{successFaq}}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dd>
        </div>
        <div v-if="errorFaq" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Error</dt>
          <dd class="mt-1 sm:col-span-2 sm:mt-0">
            <div class="max-w-xl">
              <div class="rounded-md bg-red-50 p-4">
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
                        <li>{{errorFaq}}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Send</dt>
          <dd class="mt-1 sm:col-span-2 sm:mt-0">
            <button @click="sendReq()" class="flex bg-pink-500 text-white hover:bg-indigo-600 font-bold text-sm py-2 px-4 mx-1 rounded-full">
              <PaperAirplaneIcon class="h-5 w-5 mr-1" />
              Send
            </button>
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

      <div v-if="errorDelete" class="max-w-xl mt-3">
        <div class="rounded-md bg-red-50 p-4">
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
                  <li>{{errorDelete}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
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
</template>

<script>
import {useAuthStore} from "@/stores/authStore.js";

const base_Url = import.meta.env.VITE_BASE_URL
export default {
  data() {
    return {
      username: '',
      email: '',
      successUpdate:'',
      errorUpdate:'',
      object: '',
      description: '',
      successFaq:'',
      errorFaq:'',
      errorDelete:'',
    };
  },
  methods: {
    async updateAccount() {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        const authStore = useAuthStore();

        const payload = {};
        if (this.username) {
          payload.name = this.username;
        }
        if (this.email) {
          payload.email = this.email;
        }

        const response = await this.axios.post(base_Url +'api/update_user', payload);
        authStore.updateUser(payload);
        this.successUpdate = response.data.message;
        this.errorUpdate = '';
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.errorUpdate = Object.values(error.response.data.errors).join(', ');
        } else {
          this.errorUpdate = 'There was an error updating your information. Please try again.';
        }
        this.successUpdate = '';
        console.error('Update error', error);
      }
    },
    async sendReq() {
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        const response = await this.axios.post(base_Url + 'api/new-faq', {
          message_obj:this.object,
          message_desc:this.description,
        });

        this.successFaq = 'Your message has been sent successfully.';
        this.errorFaq = ''; // Clear any previous error message

        this.object = '';
        this.description= '';

      } catch (error) {
        this.errorFaq = 'There was an error sending your message. Please try again.';
        this.successFaq = ''; // Clear any previous success message

        this.object = '';
        this.description= '';
        console.error('Login error', error);

      }
    },
    async deleteAccount(user){
      console.log('deleteAccount',user);
      try {
        this.axios.defaults.withCredentials = true;
        this.axios.defaults.withXSRFToken = true;
        await this.axios.get(base_Url + 'sanctum/csrf-cookie');

        const response = await this.axios.delete(base_Url + `api/delete_users/${user.id}`);
        const authStore = useAuthStore();
        authStore.clearUser();
        this.$router.push({ name: 'SignIn' });

      } catch (error) {
        console.error(error);
        this.errorDelete = 'User not find, please try again later.'
      }
    },
    closeAlert: function () {
      this.errorFaq = '';
      this.successFaq = '';
      this.successUpdate = '';
      this.errorUpdate = '';
      this.errorDelete = '';
    },
  }
};
</script>