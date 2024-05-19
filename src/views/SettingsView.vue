<script setup>
import {TrashIcon, PaperAirplaneIcon} from "@heroicons/vue/24/outline/index.js";
import {ArrowPathIcon} from "@heroicons/vue/24/solid/index.js";
import {useAuthStore} from "@/stores/authStore.js";
let authStore = useAuthStore();
</script>
<template>
  <div class=" px-6 py-24 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm pb-12">
      <img class="mx-auto h-24 w-auto" src="/images/unlistened_transparen_logo_176.png" alt="Unlistened.me logo" />
    </div>
    <div class="px-4 sm:px-0">
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Personal information</h1>
      <p class="mt-3 max-w-2xl text-base leading-6 text-white">
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
    </div>
    <div class="mt-6 border-t border-gray-100">
      <dl class="divide-y divide-gray-100">
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900 sr-only">Delete</dt>
          <dd class="mt-1 sm:col-span-2 sm:mt-0">
            <button @click="deleteAccount()" class="flex bg-red-500 text-white hover:bg-red-50 hover:text-gray-900 font-bold text-sm py-2 px-4 mx-1 rounded-full">
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
export default {
  data() {
    return {
        username: '',
        email: '',
        object: '',
        description: ''
    };
  },
  methods: {
    updateAccount() {
      console.log('Update');
    },
    sendReq() {
      console.log('sentReq', this.form);
    },
    deleteAccount(){

    }
  }
};
</script>