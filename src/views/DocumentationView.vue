<script setup>
import Footer from '../components/Footer.vue'
import {
  CheckCircleIcon,
  CodeBracketIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline'

const technologies = [
  {
    id: 1,
    title: 'Vue.js',
    description:
        'Vue powers the frontend interface and helps create a fast, reactive, and clean user experience. It is a great fit for building dynamic views and reusable components.',
    icon: CodeBracketIcon,
  },
  {
    id: 2,
    title: 'Tailwind CSS',
    description:
        'Tailwind CSS is used to build a consistent interface with utility classes that make styling faster, cleaner, and easier to maintain across the application.',
    icon: WrenchScrewdriverIcon,
  },
  {
    id: 3,
    title: 'Laravel 11',
    description:
        'Laravel handles the backend logic and provides a solid foundation for routing, authentication, data management, and overall application structure.',
    icon: ShieldCheckIcon,
  },
  {
    id: 4,
    title: 'MySQL',
    description:
        'MySQL stores and manages the application data in a reliable and structured way, making it suitable for user accounts, saved content, and platform operations.',
    icon: CpuChipIcon,
  },
]

const features = [
  {
    id: 1,
    title: 'User authentication',
    description:
        'Users can register, sign in, and access protected features in a secure and simple flow.',
  },
  {
    id: 2,
    title: 'Podcast discovery and management',
    description:
        'The platform makes it easy to browse, search, open podcast pages, and explore episodes.',
  },
  {
    id: 3,
    title: 'Bookmarks and favourites',
    description:
        'Listeners can save podcasts and keep track of content they want to revisit later.',
  },
  {
    id: 4,
    title: 'Responsive experience',
    description:
        'The interface is designed to work smoothly across desktop and mobile devices.',
  },
]
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mx-auto max-w-6xl">
        <!-- Hero -->
        <section class="mb-12">
          <div class="max-w-4xl">
            <p class="text-sm font-semibold text-indigo-400">Documentation</p>
            <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Unlistened.me
            </h1>
            <p class="mt-4 text-lg leading-8 text-gray-400">
              This page gives a clear overview of the project, the technologies behind it, and the main features that shape the platform experience.
            </p>
            <p class="mt-4 text-base leading-7 text-gray-500">
              Unlistened.me is built as a modern podcast application focused on usability, clarity, and performance. The goal is to offer a smooth listening experience with a clean and maintainable technical foundation.
            </p>
          </div>
        </section>

        <!-- Overview -->
        <section class="mb-14">
          <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
            <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Overview
            </h2>
            <div class="mt-5 max-w-4xl space-y-4 text-base leading-7 text-gray-400">
              <p>
                Unlistened.me is a podcast player application created to provide a modern and enjoyable listening experience. The platform focuses on podcast discovery, saved content, and an interface that feels simple and comfortable to use.
              </p>
              <p>
                The application combines a modern frontend stack with a structured backend architecture. This makes it possible to deliver a responsive user experience while keeping the codebase organized and scalable.
              </p>
            </div>
          </div>
        </section>

        <!-- Technologies -->
        <section class="mb-14">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Technologies used
            </h2>
            <p class="mt-3 max-w-3xl text-base leading-7 text-gray-400">
              The project relies on a modern web stack chosen for clarity, maintainability, and performance.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <article
                v-for="item in technologies"
                :key="item.id"
                class="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 transition-colors hover:border-indigo-500"
            >
              <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10">
                <component :is="item.icon" class="h-6 w-6 text-indigo-400" />
              </div>
              <h3 class="text-lg font-semibold text-white">
                {{ item.title }}
              </h3>
              <p class="mt-3 text-sm leading-7 text-gray-400">
                {{ item.description }}
              </p>
            </article>
          </div>
        </section>

        <!-- Features -->
        <section class="mb-14">
          <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
            <div class="mb-6">
              <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Key features
              </h2>
              <p class="mt-3 max-w-3xl text-base leading-7 text-gray-400">
                These are some of the core elements that define the platform.
              </p>
            </div>

            <ul role="list" class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <li
                  v-for="feature in features"
                  :key="feature.id"
                  class="rounded-2xl border border-gray-800 bg-gray-950/60 p-5"
              >
                <div class="flex gap-3">
                  <CheckCircleIcon class="mt-0.5 h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                  <div>
                    <h3 class="text-base font-semibold text-white">
                      {{ feature.title }}
                    </h3>
                    <p class="mt-2 text-sm leading-7 text-gray-400">
                      {{ feature.description }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!-- Contribution -->
        <section class="mb-14">
          <div class="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8">
            <div class="max-w-4xl">
              <p class="text-sm font-semibold text-indigo-400">Contribution</p>
              <h2 class="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                Community contributions are welcome
              </h2>
              <p class="mt-4 text-base leading-7 text-gray-400">
                If you would like to contribute to the project, you can fork the repository and submit your changes through a pull request. Clear commit messages and consistent coding practices help keep the project easier to review and maintain.
              </p>
              <p class="mt-4 text-base leading-7 text-gray-400">
                Thoughtful improvements, bug fixes, interface refinements, and technical suggestions are all valuable contributions.
              </p>
            </div>
          </div>
        </section>

        <!-- License -->
        <section class="pb-6">
          <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
            <p class="text-sm font-semibold text-indigo-400">License</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              MIT license
            </h2>
            <div class="mt-5 max-w-4xl space-y-4 text-base leading-7 text-gray-400">
              <p>
                Unlistened.me is released under the MIT license. This means the software is provided as is, without warranty of any kind, whether express or implied.
              </p>
              <p>
                This includes, among other things, no guarantee of merchantability, fitness for a particular purpose, or non infringement. The authors and copyright holders cannot be held liable for claims, damages, or other liability arising from the use of the software or related dealings.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <Footer />
</template>