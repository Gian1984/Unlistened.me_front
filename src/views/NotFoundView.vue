<script setup>
import Footer from '../components/Footer.vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { BookmarkSquareIcon, BookOpenIcon, UserGroupIcon } from '@heroicons/vue/24/solid'

const links = [
  {
    name: 'Documentation',
    href: '/documentation',
    description: 'Learn more about the app.',
    icon: BookOpenIcon,
  },
  { name: 'About', href: '/about', description: 'Discover more about us.', icon: UserGroupIcon },
  {
    name: 'Terms and Conditions',
    href: '/terms',
    description: 'Read the terms and conditions of Unlistened.',
    icon: BookmarkSquareIcon,
  },
]
</script>
<template>
  <div class="bg-white">
    <div class="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
      <img class="mx-auto h-24 w-auto sm:h-24" src="/images/unlistened.me_white_300.png" alt="Unlistened.me logo" />
      <div class="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
        <p class="text-base font-semibold leading-8 text-indigo-600">404</p>
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">This page does not exist</h1>
        <p class="mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">Sorry, we couldn’t find the page you’re looking for.</p>
      </div>
      <div class="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
        <h2 class="sr-only">Popular pages</h2>
        <ul role="list" class="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5">
          <li v-for="(link, linkIdx) in links" :key="linkIdx" class="relative flex gap-x-6 py-6">
            <div class="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-900/10">
              <component :is="link.icon" class="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </div>
            <div class="flex-auto">
              <h3 class="text-sm font-semibold leading-6 text-gray-900">
                <router-link :to="link.href">
                  <span class="absolute inset-0" aria-hidden="true" />
                  {{ link.name }}
                </router-link>
              </h3>
              <p class="mt-2 text-sm leading-6 text-gray-600">{{ link.description }}</p>
            </div>
            <div class="flex-none self-center">
              <ChevronRightIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </li>
        </ul>
        <div class="mt-10 flex justify-center">
          <router-link to="/" class="text-sm font-semibold leading-6 text-indigo-600 hover:text-pink-500">
            <span aria-hidden="true">&larr;</span>
            Back to home
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
