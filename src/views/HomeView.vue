<script setup>
import Footer from '../components/Footer.vue'
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
</script>
<template>
  <div class="bg-white px-6 py-24 lg:px-8">
    <div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm pb-24">
        <img class="mx-auto h-64 w-auto" src="/images/unlistened.me_white_300.png" alt="Unlistened.me logo" />
      </div>
      <p class="text-base font-semibold leading-7 text-indigo-600">Introducing</p>
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Unlistened.me</h1>
      <p class="mt-6 text-xl leading-8 text-gray-900">
        Welcome to Unlistened.me, the simplest way to enjoy your favorite podcasts for free! I am committed to providing a user-friendly experience without tracking cookies or profiling our users. Enjoy unrestricted access to a world of stories, insights, and entertainment with complete privacy and zero cost.
      </p>
      <div class="mt-10 max-w-2xl">
        <p class="text-lg leading-6 text-gray-900">
          Podcasts offer a unique avenue to culture, education, and enlightenment—accessible anywhere, anytime. Motivated by the power of podcasts to educate and inspire, I created this app to make these incredible resources freely available to everyone, with a strong commitment to privacy and simplicity.
        </p>
        <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-600">
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span><strong class="font-semibold text-gray-900">Completely Free.</strong> Access a wide range of podcasts without any subscription fees or hidden costs. Our platform is designed to be open and accessible to all, fostering a community of learning and sharing.</span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span><strong class="font-semibold text-gray-900">No Cookies.</strong> I respect your privacy. My app operates without cookies, meaning your listening habits and personal data are never tracked or stored.</span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span><strong class="font-semibold text-gray-900">No Profiling.</strong> Enjoy podcasts without the concern of being profiled. We believe in the pure joy of discovery and learning, free from algorithms or targeted advertising.</span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span><strong class="font-semibold text-gray-900">Privacy-Centric.</strong> Your privacy is paramount. With Unlistened.me, listen to your favorite podcasts with the assurance that your personal information stays private. </span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span><strong class="font-semibold text-gray-900">Sign Up / Log In.</strong> Required only to enable you to save your favorite episodes and manage your bookmarks seamlessly across devices.</span>
          </li>
        </ul>
        <p class="mt-8 text-lg leading-6 text-gray-900">Join me at Unlistened.me to explore, learn, and grow through the vast world of podcasts, completely free and with total privacy.</p>
      </div>
    </div>
  </div>
  <Footer />
</template>

