<script setup>
import ChevronRightIcon from '@heroicons/vue/20/solid/esm/ChevronRightIcon.js'
import BookmarkSquareIcon from '@heroicons/vue/24/solid/esm/BookmarkSquareIcon.js'
import BookOpenIcon from '@heroicons/vue/24/solid/esm/BookOpenIcon.js'
import UserGroupIcon from '@heroicons/vue/24/solid/esm/UserGroupIcon.js'
import Footer from '~/src/components/Footer.vue'
import { useSeo } from '~/src/seo/composables/useSeo.js'
import { notFoundSeo } from '~/src/seo/registry/index.js'

useSeo(notFoundSeo)

const links = [
  {
    name: 'Documentation',
    href: '/documentation',
    description: 'Learn how the app works.',
    icon: BookOpenIcon,
  },
  {
    name: 'About',
    href: '/about',
    description: 'Discover more about us.',
    icon: UserGroupIcon,
  },
  {
    name: 'Terms and conditions',
    href: '/terms',
    description: 'Read our terms and conditions.',
    icon: BookmarkSquareIcon,
  },
]
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <section class="mb-10">
          <div class="max-w-3xl">
            <p class="text-sm font-semibold text-indigo-400">404</p>
            <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              This page does not exist
            </h1>
            <p class="mt-4 text-base leading-7 text-gray-400">
              We could not find the page you were looking for. Try one of the links below or head back home.
            </p>
          </div>
        </section>

        <!-- Popular links -->
        <section class="mb-10">
          <div class="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Popular pages</h2>
            <ul role="list" class="divide-y divide-gray-800">
              <li
                  v-for="(link, linkIdx) in links"
                  :key="linkIdx"
                  class="relative flex items-center gap-x-4 py-4"
              >
                <div class="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-600/10 ring-1 ring-gray-700">
                  <component :is="link.icon" class="h-5 w-5 text-indigo-400" aria-hidden="true" />
                </div>
                <div class="flex-auto min-w-0">
                  <h3 class="text-sm font-semibold text-white">
                    <NuxtLink :to="link.href">
                      <span class="absolute inset-0" aria-hidden="true" />
                      {{ link.name }}
                    </NuxtLink>
                  </h3>
                  <p class="mt-1 text-sm text-gray-400">{{ link.description }}</p>
                </div>
                <ChevronRightIcon class="h-5 w-5 flex-none text-gray-500" aria-hidden="true" />
              </li>
            </ul>
          </div>
        </section>

        <!-- Back to home -->
        <section class="pb-6">
          <NuxtLink
              to="/"
              class="text-sm font-semibold text-indigo-400 transition-colors hover:text-pink-400"
          >
            <span aria-hidden="true">&larr;</span>
            Back to home
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
  <Footer />
</template>
