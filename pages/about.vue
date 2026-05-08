<script setup>
import {
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  CodeBracketIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  HeartIcon,
  ScaleIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'
import PageHero from '@/components/PageHero.vue'
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo('about')

const highlights = [
  {
    id: 1,
    title: 'Podcasts and music together',
    description:
        'Unlistened.me brings together trending podcasts and free Creative Commons music in one calm listening space. You can move between spoken audio and music without changing apps or losing context.',
    icon: BookOpenIcon,
    accent: 'indigo',
  },
  {
    id: 2,
    title: 'Privacy first',
    description:
        'Unlistened.me is built with respect for your privacy. The platform only uses the information needed to provide the service, without invasive tracking or unnecessary data collection.',
    icon: ShieldCheckIcon,
    accent: 'emerald',
  },
  {
    id: 3,
    title: 'Built with purpose',
    description:
        'This project was created to make audio discovery simpler, calmer, and more meaningful. The goal is to support access to culture, learning, independent voices, and artists who share their work openly.',
    icon: SparklesIcon,
    accent: 'pink',
  },
]

const technologies = [
  {
    id: 1,
    title: 'Vue.js',
    description:
        'Vue powers the frontend interface and helps create a fast, reactive, and clean user experience. A great fit for building dynamic views and reusable components.',
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
        'MySQL stores and manages the application data in a reliable and structured way, making it suitable for user accounts, saved podcasts, playlists, bookmarks, and platform operations.',
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
    title: 'Podcast discovery and listening',
    description:
        'The platform makes it easy to browse, search, open podcast pages, explore episodes, and continue listening where you left off.',
  },
  {
    id: 3,
    title: 'Free music discovery',
    description:
        'Users can explore Jamendo powered tracks, filter by genre, like songs, and build their own music playlists.',
  },
  {
    id: 4,
    title: 'Saved library and responsive playback',
    description:
        'Listeners can save favourites, bookmark episodes, organize playlists, and keep playback smooth across desktop and mobile devices.',
  },
]

const accentClasses = {
  indigo: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  pink: 'bg-pink-500/10 text-pink-400 ring-pink-500/20',
}
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mx-auto max-w-6xl">
        <!-- Hero -->
        <section class="mb-12">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:items-center">
            <div class="lg:col-span-3">
              <PageHero
                eyebrow="About the project"
                :eyebrow-icon="SparklesIcon"
                title="Unlistened.me"
                description="Unlistened.me is a listening platform designed to make discovery simple, pleasant, and focused. It combines podcasts and free Creative Commons music in one interface, so you can move from learning, conversation, and storytelling to independent tracks without friction."
                :breadcrumbs="[
                  { label: 'Home', to: '/' },
                  { label: 'About' },
                ]"
                max-width-class="max-w-2xl"
              />
              <p class="mt-4 max-w-2xl text-base leading-7 text-gray-500">
                The idea behind the project is straightforward. Give people a better way to explore audio, save what matters to them, and enjoy listening without noise, clutter, or unnecessary friction.
              </p>
            </div>

            <div class="flex justify-center lg:col-span-2 lg:justify-end">
              <div class="rounded-3xl border border-gray-800 bg-gradient-to-br from-indigo-500/10 via-gray-900/60 to-gray-900/60 p-6 shadow-lg">
                <img
                    class="mx-auto w-56 sm:w-64"
                    src="/images/unlistened_transparen_logo_1563.png"
                    alt="Unlistened.me logo"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Overview -->
        <section class="mb-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              <BookOpenIcon class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white sm:text-2xl">Overview</h2>
              <p class="mt-1 text-sm text-gray-400">What Unlistened.me is and what it tries to be.</p>
            </div>
          </div>

          <div class="mt-5 max-w-4xl space-y-4 text-base leading-7 text-gray-400">
            <p>
              Unlistened.me is an audio discovery application created to provide a modern and enjoyable listening experience. The platform focuses on podcast discovery, free music exploration, saved content, and an interface that feels simple and comfortable to use.
            </p>
            <p>
              Podcasts are sourced through PodcastIndex, while music discovery is powered by Jamendo and centered on Creative Commons licensed tracks from independent artists. The result is a mixed listening experience that supports both long form content and lightweight music discovery.
            </p>
            <p>
              The application combines a modern frontend stack with a structured backend architecture. This makes it possible to deliver a responsive user experience while keeping the codebase organized and scalable.
            </p>
          </div>
        </section>

        <!-- Highlights -->
        <section class="mb-10">
          <div class="mb-6">
            <h2 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Why Unlistened.me
            </h2>
            <p class="mt-2 max-w-3xl text-sm text-gray-400">
              The platform is built around a few simple values that shape the overall experience.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article
                v-for="item in highlights"
                :key="item.id"
                class="group rounded-2xl border border-gray-800 bg-gray-900/50 p-5 transition-all hover:border-gray-700 hover:bg-gray-900/80"
            >
              <div
                  :class="['mb-4 flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset', accentClasses[item.accent]]"
              >
                <component :is="item.icon" class="h-5 w-5" />
              </div>
              <h3 class="text-base font-semibold text-white">
                {{ item.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-gray-400">
                {{ item.description }}
              </p>
            </article>
          </div>
        </section>

        <!-- Technologies -->
        <section class="mb-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              <CpuChipIcon class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white sm:text-2xl">Technologies used</h2>
              <p class="mt-1 text-sm text-gray-400">
                The project relies on a modern web stack chosen for clarity, maintainability, performance, and reliable audio delivery.
              </p>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article
                v-for="item in technologies"
                :key="item.id"
                class="rounded-xl border border-gray-800 bg-gray-950/60 p-5 transition-colors hover:border-indigo-500/40"
            >
              <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-inset ring-indigo-500/20">
                <component :is="item.icon" class="h-5 w-5 text-indigo-400" />
              </div>
              <h3 class="text-base font-semibold text-white">
                {{ item.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-gray-400">
                {{ item.description }}
              </p>
            </article>
          </div>
        </section>

        <!-- Key features -->
        <section class="mb-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 ring-1 ring-inset ring-pink-500/20">
              <SparklesIcon class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white sm:text-2xl">Key features</h2>
              <p class="mt-1 text-sm text-gray-400">These are some of the core elements that define the platform.</p>
            </div>
          </div>

          <ul role="list" class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <li
                v-for="feature in features"
                :key="feature.id"
                class="rounded-xl border border-gray-800 bg-gray-950/60 p-5"
            >
              <div class="flex gap-3">
                <CheckCircleIcon class="mt-0.5 h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                <div>
                  <h3 class="text-base font-semibold text-white">
                    {{ feature.title }}
                  </h3>
                  <p class="mt-2 text-sm leading-6 text-gray-400">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </li>
          </ul>

          <div class="mt-6">
            <NuxtLink
                to="/documentation"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-indigo-500/40 hover:text-white"
            >
              <BookOpenIcon class="h-4 w-4" />
              Read the user guide
              <span aria-hidden="true">&rarr;</span>
            </NuxtLink>
          </div>
        </section>

        <!-- About the creator -->
        <section class="mb-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20">
              <UserCircleIcon class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-amber-400">About the creator</p>
              <h2 class="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Gianluca Tiengo
              </h2>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div class="space-y-4 text-base leading-7 text-gray-400">
              <p>
                Hi, I am Gianluca Tiengo, a developer passionate about building digital products that are useful, clear, and enjoyable to use. Unlistened.me was born from my interest in podcasts and from the desire to create a better listening experience.
              </p>
              <p>
                My path into development has been shaped by curiosity, persistence, and a lot of hands on learning. Step by step, I worked on turning that passion into real projects, always trying to improve both the quality of the code and the value delivered to people.
              </p>
            </div>

            <div class="space-y-4 text-base leading-7 text-gray-400">
              <p>
                With Unlistened.me, my goal is to offer a space where listeners can explore meaningful content in a more intentional way. I am always improving the project and I genuinely value feedback from the people who use it.
              </p>
              <p>
                If you would like to share an idea, a suggestion, or simply get in touch, you can write to
                <a
                    class="font-semibold text-indigo-400 transition-colors hover:text-pink-400"
                    href="mailto:support@unlistened.me?subject=Mail from about unlistened.me"
                >
                  support@unlistened.me
                </a>.
              </p>
            </div>
          </div>
        </section>

        <!-- Contribution -->
        <section class="mb-10 overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-indigo-500/10 via-gray-900/60 to-gray-900/60 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 ring-1 ring-inset ring-pink-500/20">
              <HeartIcon class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-pink-400">Contribution</p>
              <h2 class="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Community contributions are welcome
              </h2>
            </div>
          </div>

          <div class="mt-5 max-w-4xl space-y-4 text-base leading-7 text-gray-400">
            <p>
              If you would like to contribute to the project, you can fork the repository and submit your changes through a pull request. Clear commit messages and consistent coding practices help keep the project easier to review and maintain.
            </p>
            <p>
              Thoughtful improvements, bug fixes, interface refinements, and technical suggestions are all valuable contributions.
            </p>
          </div>
        </section>

        <!-- Resources -->
        <section class="mb-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-500/20">
              <BookOpenIcon class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-sky-400">Resources</p>
              <h2 class="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Useful tools and resources I recommend
              </h2>
            </div>
          </div>

          <div class="mt-5 max-w-4xl space-y-4 text-base leading-7 text-gray-400">
            <p>
              Over time, I have collected tools, references, and practical resources that helped me learn, build, and improve as a developer. I wanted to keep this part separate because it is not only about Unlistened.me. It is also about sharing things that can genuinely help others grow.
            </p>
            <p>
              I am not affiliated with these resources. I simply use them myself and I believe they can be valuable, especially for self taught developers looking for solid and practical support.
            </p>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a
                href="https://codehelper.me/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Explore CodeHelper
              <ArrowTopRightOnSquareIcon class="h-4 w-4" />
            </a>

            <div class="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-gray-400">
              <CheckCircleIcon class="h-4 w-4 text-emerald-400" />
              Personally recommended resources
            </div>
          </div>
        </section>

        <!-- License -->
        <section class="mb-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-500/10 text-gray-300 ring-1 ring-inset ring-gray-500/20">
              <ScaleIcon class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-gray-300">License</p>
              <h2 class="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                MIT license
              </h2>
            </div>
          </div>

          <div class="mt-5 max-w-4xl space-y-4 text-base leading-7 text-gray-400">
            <p>
              Unlistened.me is released under the MIT license. This means the software is provided as is, without warranty of any kind, whether express or implied.
            </p>
            <p>
              This includes, among other things, no guarantee of merchantability, fitness for a particular purpose, or non infringement. The authors and copyright holders cannot be held liable for claims, damages, or other liability arising from the use of the software or related dealings.
            </p>
          </div>
        </section>

        <!-- Terms link -->
        <section class="pb-6">
          <div class="border-t border-gray-800 pt-6">
            <NuxtLink
                to="/terms"
                class="text-sm font-semibold text-indigo-400 transition-colors hover:text-pink-400"
            >
              Read our terms and conditions &rarr;
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
