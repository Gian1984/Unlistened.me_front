<script setup>
import {
  BookOpenIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  PlayCircleIcon,
  StarIcon,
  BookmarkIcon,
  ClockIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline'
import PageHero from '~/src/components/PageHero.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('documentation')

const sections = [
  {
    id: 'getting-started',
    number: '01',
    title: 'Create your account',
    intro: 'Sign up in a few seconds and unlock favourites, bookmarks, listening history and personal settings.',
    icon: UserPlusIcon,
    accent: 'indigo',
    steps: [
      'Click Sign up in the top right of the page, or open the sign up page directly.',
      'Enter your name, email and a password. Confirm the password to avoid typos.',
      'Submit the form. You will be signed in automatically and redirected to the home page.',
      'Already have an account? Use the Sign in link to access your library from any device.',
    ],
    tip: 'Forgot your password? Use the Reset password link on the sign in page to receive a recovery email.',
  },
  {
    id: 'discover',
    number: '02',
    title: 'Discover podcasts',
    intro: 'Browse trending shows, explore by category, or use the search bar to find exactly what you are looking for.',
    icon: MagnifyingGlassIcon,
    accent: 'emerald',
    steps: [
      'The Home page shows trending podcasts grouped in a clean grid of cards.',
      'Open the Categories page to filter shows by topic — technology, culture, education and more.',
      'Type a keyword in the search bar at the top of Home to look for a specific podcast or topic.',
      'Click any card to open the podcast page and see the full list of episodes.',
    ],
    tip: 'The card grid loads progressively: scroll and click Load more at the bottom to see additional results.',
  },
  {
    id: 'listen',
    number: '03',
    title: 'Listen with the audio player',
    intro: 'The player lives at the bottom of the screen and follows you through the whole app.',
    icon: PlayCircleIcon,
    accent: 'pink',
    steps: [
      'Click the play button on any episode card or on the episode detail page to start listening.',
      'The full-width sticky player at the bottom lets you pause, resume and drag the seek bar to any position.',
      'Use the ±15s and ±30s buttons to jump back or skip ahead. Change the playback speed if you prefer a faster pace.',
      'The player keeps running while you browse other pages. Your phone lockscreen shows the current episode too.',
    ],
    tip: 'The player uses the Media Session API, so hardware keys (play/pause, next, previous) work natively on most devices.',
  },
  {
    id: 'favourites',
    number: '04',
    title: 'Save podcasts to favourites',
    intro: 'Keep your favourite shows one click away and organize them into custom sections.',
    icon: StarIcon,
    accent: 'amber',
    steps: [
      'On any podcast page, click the star icon to add the show to your favourites.',
      'Open the Favourites page from the sidebar to see everything you saved.',
      'Drag and drop podcasts between the main area and custom sections to organize them the way you like.',
      'Create a new section from the dropdown (for example "To listen next" or "All-time favourites") and drag shows into it.',
    ],
    tip: 'Your sections are saved on the server, so they follow you across devices once you are signed in.',
  },
  {
    id: 'bookmarks',
    number: '05',
    title: 'Bookmark individual episodes',
    intro: 'Saved an interesting episode but do not want to follow the whole show? Use bookmarks.',
    icon: BookmarkIcon,
    accent: 'sky',
    steps: [
      'Open an episode page and click the bookmark icon to save it for later.',
      'Open the Bookmarks page to see every episode you bookmarked.',
      'Drag episodes into sections — the same flow as favourites — to group them by mood, project, or priority.',
      'Click the arrow on any bookmark to jump straight to the episode page and resume listening.',
    ],
    tip: 'Bookmarks are perfect for one-off episodes you discovered through search or categories.',
  },
  {
    id: 'history',
    number: '06',
    title: 'Resume where you left off',
    intro: 'Unlistened.me quietly remembers the episodes you recently listened to.',
    icon: ClockIcon,
    accent: 'violet',
    steps: [
      'As you listen, your progress is stored on your device so you can pick up exactly where you stopped.',
      'Recently played episodes are shown on the home page with a progress bar on each card.',
      'Click a recent episode to resume playback at the last position.',
      'History stays private and local — nothing is uploaded to the server.',
    ],
    tip: 'Clearing your browser data will also clear your listening history, since it is stored locally.',
  },
  {
    id: 'settings',
    number: '07',
    title: 'Personalize your account',
    intro: 'Update your profile, choose a preferred language and manage your account from a single page.',
    icon: Cog6ToothIcon,
    accent: 'indigo',
    steps: [
      'Open the Settings page from the sidebar to see your profile card, language selector and account actions.',
      'Change your username, email or preferred language, then click Update to save your changes.',
      'Use the Contact us form to send the team a message if you have a question or need support.',
      'Danger zone: if you want to delete your account, a confirmation dialog will make sure the action is intentional.',
    ],
    tip: 'Your preferred language is used to personalize the content shown on the home page.',
  },
  {
    id: 'help',
    number: '08',
    title: 'Need help?',
    intro: 'A few ways to get unstuck or share feedback with the team.',
    icon: LifebuoyIcon,
    accent: 'emerald',
    steps: [
      'Use the Contact us form on the Settings page to send a message directly from your account.',
      'Write to support@unlistened.me for general questions, bug reports or suggestions.',
      'Check the About page to learn more about the project, the stack behind it and the people involved.',
      'Feedback is genuinely appreciated — it helps improve the experience for everyone.',
    ],
    tip: 'The clearer the report, the faster the fix. Describe what you did, what you expected and what happened instead.',
  },
]

const faqItems = [
  {
    question: 'Do I need an account to start listening?',
    answer: 'No. You can browse and listen without an account. An account is only needed for saved features such as favorites, bookmarks, and playlists.',
  },
  {
    question: 'Where can I save podcasts and episodes?',
    answer: 'Podcasts can be saved to favorites and episodes can be saved to bookmarks. Both areas are available from the library section once you are signed in.',
  },
  {
    question: 'Does Unlistened.me remember where I stopped listening?',
    answer: 'Yes. Listening progress is stored so you can resume from where you left off. For podcasts this history is kept locally on your device.',
  },
  {
    question: 'Can I create playlists for music?',
    answer: 'Yes. Signed in users can like tracks, create playlists, and organize Creative Commons music into personal collections.',
  },
]

const accentClasses = {
  indigo: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  pink: 'bg-pink-500/10 text-pink-400 ring-pink-500/20',
  amber: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  sky: 'bg-sky-500/10 text-sky-400 ring-sky-500/20',
  violet: 'bg-violet-500/10 text-violet-400 ring-violet-500/20',
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mx-auto">
        <!-- Header -->
        <PageHero
          eyebrow="User guide"
          :eyebrow-icon="BookOpenIcon"
          title="How to use Unlistened.me"
          description="A practical walkthrough of every feature you will find in the app, from creating your account to organizing favorites, using the player, and getting help when you need it."
          :breadcrumbs="[
            { label: 'Home', to: '/' },
            { label: 'Documentation' },
          ]"
        />

        <!-- Table of contents -->
        <section class="mb-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400">In this guide</h2>
          <ul class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <li v-for="section in sections" :key="section.id">
              <button
                  type="button"
                  @click="scrollToSection(section.id)"
                  class="group flex w-full items-center gap-3 rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2.5 text-left transition-colors hover:border-indigo-500/40 hover:bg-gray-900"
              >
                <div
                    :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset', accentClasses[section.accent]]"
                >
                  <component :is="section.icon" class="h-4 w-4" />
                </div>
                <span class="flex-1 text-sm font-medium text-gray-200 group-hover:text-white">
                  {{ section.title }}
                </span>
                <span class="text-xs font-mono text-gray-600">{{ section.number }}</span>
              </button>
            </li>
          </ul>
        </section>

        <!-- Sections -->
        <section
            v-for="section in sections"
            :id="section.id"
            :key="section.id"
            class="mb-10 scroll-mt-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8"
        >
          <div class="flex items-start gap-4">
            <div
                :class="['flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset', accentClasses[section.accent]]"
            >
              <component :is="section.icon" class="h-6 w-6" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-mono font-semibold tracking-wider text-gray-500">STEP {{ section.number }}</p>
              <h2 class="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {{ section.title }}
              </h2>
              <p class="mt-2 text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
                {{ section.intro }}
              </p>
            </div>
          </div>

          <ul role="list" class="mt-6 space-y-3">
            <li
                v-for="(step, idx) in section.steps"
                :key="idx"
                class="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-950/60 p-4"
            >
              <CheckCircleIcon class="mt-0.5 h-5 w-5 flex-none text-indigo-400" />
              <p class="text-sm leading-6 text-gray-300">{{ step }}</p>
            </li>
          </ul>

          <div
              v-if="section.tip"
              class="mt-5 flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              <LifebuoyIcon class="h-4 w-4" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-indigo-400">Tip</p>
              <p class="mt-1 text-sm leading-6 text-gray-300">{{ section.tip }}</p>
            </div>
          </div>
        </section>

        <section class="mb-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="mb-6">
            <h2 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Frequently asked questions
            </h2>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-gray-400 sm:text-base">
              Quick answers to the most common questions about accounts, saved items, history, and music playlists.
            </p>
          </div>

          <div class="space-y-4">
            <article
              v-for="item in faqItems"
              :key="item.question"
              class="rounded-xl border border-gray-800 bg-gray-950/60 p-5"
            >
              <h3 class="text-base font-semibold text-white">
                {{ item.question }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-gray-400 sm:text-base">
                {{ item.answer }}
              </p>
            </article>
          </div>
        </section>

        <!-- Call to action -->
        <section class="mb-10 overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-indigo-500/10 via-gray-900/60 to-gray-900/60 p-6 sm:p-8">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div class="max-w-2xl">
              <h2 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Ready to start listening?
              </h2>
              <p class="mt-2 text-sm leading-6 text-gray-400 sm:text-base">
                Head back to the home page and explore the podcast library. Your next favourite show is just a click away.
              </p>
            </div>
            <NuxtLink
                to="/"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Open Home
              <ArrowRightIcon class="h-4 w-4" />
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
