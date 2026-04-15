<script setup>
import {
  ShieldCheckIcon,
  UserCircleIcon,
  ServerStackIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  ScaleIcon,
  EnvelopeIcon,
  HeartIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'
import PageHero from '~/src/components/PageHero.vue'
import { useStaticPageSeo } from '~/composables/useStaticPageSeo'

useStaticPageSeo('privacy')

const lastUpdated = 'April 2026'

const sections = [
  {
    id: 'who-we-are',
    icon: UserCircleIcon,
    accent: 'indigo',
    title: 'Who we are',
    body: `Unlistened.me is an independent, non-commercial project created and maintained by a single developer, Gianluca Tiengo. The platform is a podcast player built as a personal project and offered to the community free of charge. There are no advertisers, no paid partnerships, and no monetization of your data.`,
  },
  {
    id: 'what-we-collect',
    icon: ServerStackIcon,
    accent: 'emerald',
    title: 'What information we collect',
    body: `We only collect the information that is strictly needed to provide the service.`,
    bullets: [
      'Account data: if you create an account, we store your name, email address and a hashed password. Your password is never stored in plain text.',
      'Account preferences: your preferred language and the podcasts, episodes or sections you have chosen to save in your library (favourites and bookmarks).',
      'Technical data: standard request metadata such as IP address and user-agent, used only to run and secure the service.',
      'Support messages: if you contact us through the form or by email, we keep the message to reply to you.',
    ],
  },
  {
    id: 'how-we-use',
    icon: Cog6ToothIcon,
    accent: 'pink',
    title: 'How we use your information',
    body: `Your data is used to operate the service and nothing else.`,
    bullets: [
      'To authenticate you and keep your session active.',
      'To display your favourites, bookmarks and listening preferences.',
      'To send you operational emails such as password reset messages when you request them.',
      'To keep the service secure and to fix technical problems when they occur.',
    ],
    footer: `We never sell, rent or trade your personal information. We do not use your data for advertising or profiling.`,
  },
  {
    id: 'cookies',
    icon: ShieldCheckIcon,
    accent: 'amber',
    title: 'Cookies and similar technologies',
    body: `We use a small number of cookies, grouped into three categories you can manage from the cookie banner at any time.`,
    bullets: [
      'Strictly necessary: required for authentication, session and security (for example the Laravel Sanctum session cookie and the CSRF token). These cannot be disabled because the site would not work without them.',
      'Analytics: optional. Anonymous usage statistics that help understand how the site is used and what to improve.',
      'Marketing: optional. Currently not used for advertising. This category exists so that, if any marketing tag is ever added in the future, it will remain disabled by default until you opt in.',
    ],
    footer: `You can review and change your choices at any time by clicking the small cookie icon at the bottom right of any page.`,
  },
  {
    id: 'third-parties',
    icon: GlobeAltIcon,
    accent: 'sky',
    title: 'Third-party services',
    body: `Unlistened.me is built with open-source libraries (Vue, Pinia, Vue Router, Tailwind CSS, Headless UI, Heroicons, Chart.js, Vuedraggable, Axios). None of these libraries collect personal data on their own — they simply run in your browser as part of the app.`,
    bullets: [
      'Google Tag Manager: loaded from googletagmanager.com with Google Consent Mode v2. By default, analytics_storage, ad_storage, ad_user_data and ad_personalization are set to denied. Nothing is tracked until you explicitly accept from the cookie banner.',
      'Unlistened.me API (api.unlistened.me): our own backend, powered by Laravel. It stores your account data and handles authentication via a secure session cookie.',
      'Podcast audio and images: some podcast covers and audio files are hosted by the podcasts themselves, which means your browser may load content directly from their servers when you play or display an episode.',
    ],
    footer: `We do not embed tracking pixels, social media widgets, or third-party advertising networks.`,
  },
  {
    id: 'retention',
    icon: ScaleIcon,
    accent: 'violet',
    title: 'How long we keep your data',
    body: `We keep your data only for as long as your account exists. If you delete your account from the Settings page, your profile, favourites, bookmarks and preferences are permanently removed from our database. Support messages are kept only as long as needed to answer your request.`,
  },
  {
    id: 'your-rights',
    icon: HeartIcon,
    accent: 'pink',
    title: 'Your rights',
    body: `You are in control of your data. At any time you can:`,
    bullets: [
      'Access and update your profile information from the Settings page.',
      'Change your cookie preferences from the cookie icon at the bottom right of the page.',
      'Delete your account and all the data associated with it from the Settings page.',
      'Contact us to ask any question about your data or request its removal.',
    ],
  },
  {
    id: 'changes',
    icon: InformationCircleIcon,
    accent: 'indigo',
    title: 'Changes to this policy',
    body: `This policy may be updated occasionally to reflect improvements to the service or changes in the tools we use. When a meaningful change is made, we will update the "last updated" date at the top of this page. Significant changes will be communicated through the app itself.`,
  },
  {
    id: 'contact',
    icon: EnvelopeIcon,
    accent: 'emerald',
    title: 'Contact',
    body: `If you have any question about this privacy policy or about how your data is handled, you can reach out at support@unlistened.me. We read every message personally.`,
  },
]

const faqItems = [
  {
    question: 'Does Unlistened.me track my listening activity?',
    answer: 'No. Unlistened.me does not use tracking cookies to profile your listening habits. Optional analytics remain disabled until you explicitly accept them.',
  },
  {
    question: 'What personal data is stored if I create an account?',
    answer: 'If you create an account, Unlistened.me stores your name, email address, hashed password, preferences, and the items you choose to save in your library.',
  },
  {
    question: 'Can I delete my account and saved data?',
    answer: 'Yes. You can delete your account from the Settings page. Your profile, favorites, bookmarks, and related preferences are then permanently removed.',
  },
  {
    question: 'Are podcast audio files hosted by Unlistened.me?',
    answer: 'Not always. Some podcast covers and audio files are hosted by the podcasts themselves, which means your browser may connect directly to those servers when you play or display an episode.',
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
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mx-auto max-w-4xl">
        <!-- Header -->
        <PageHero
          eyebrow="Privacy"
          :eyebrow-icon="ShieldCheckIcon"
          title="Privacy policy"
          description="Unlistened.me is a non-commercial project built with respect for your privacy. This page explains what information is collected, how it is used, and how you can stay in control of your data."
          :breadcrumbs="[
            { label: 'Home', to: '/' },
            { label: 'Privacy' },
          ]"
        />
        <section class="mb-10">
          <p class="mt-3 text-sm text-gray-500">Last updated: {{ lastUpdated }}</p>
        </section>

        <!-- Non-commercial callout -->
        <section class="mb-10 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
          <div class="flex items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              <HeartIcon class="h-6 w-6" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">A non-commercial project</h2>
              <p class="mt-2 text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
                Unlistened.me is not a commercial product. There are no ads, no paid partnerships, no affiliate links, and no monetization of user data. The project exists because podcasts deserve a calmer listening experience — that is the only goal.
              </p>
            </div>
          </div>
        </section>

        <!-- Sections -->
        <section
            v-for="section in sections"
            :id="section.id"
            :key="section.id"
            class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8"
        >
          <div class="flex items-start gap-3">
            <div
                :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset', accentClasses[section.accent]]"
            >
              <component :is="section.icon" class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <h2 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {{ section.title }}
              </h2>
            </div>
          </div>

          <div class="mt-5 max-w-3xl space-y-4 text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
            <p>{{ section.body }}</p>

            <ul v-if="section.bullets" role="list" class="space-y-2 pl-1">
              <li
                  v-for="(bullet, idx) in section.bullets"
                  :key="idx"
                  class="flex gap-3"
              >
                <span class="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                <span>{{ bullet }}</span>
              </li>
            </ul>

            <p v-if="section.footer" class="text-gray-300">{{ section.footer }}</p>
          </div>
        </section>

        <section class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
          <div class="mb-5">
            <h2 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Frequently asked questions
            </h2>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-gray-400 sm:text-base">
              Short answers to the privacy questions people usually ask first.
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
