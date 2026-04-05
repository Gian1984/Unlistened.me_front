<script setup>
import Footer from '../components/Footer.vue'
import {
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BookOpenIcon,
} from '@heroicons/vue/24/outline'

const highlights = [
  {
    id: 1,
    title: 'A diverse podcast library',
    description:
        'Explore podcasts from many categories, topics, and creators. From education and technology to arts, culture, and personal growth, there is always something new to discover.',
    icon: BookOpenIcon,
  },
  {
    id: 2,
    title: 'Privacy first',
    description:
        'Unlistened.me is built with respect for your privacy. The platform only uses the information needed to provide the service, without invasive tracking or unnecessary data collection.',
    icon: ShieldCheckIcon,
  },
  {
    id: 3,
    title: 'Built with purpose',
    description:
        'This project was created to make podcast discovery simpler, calmer, and more meaningful. The goal is to support access to culture, learning, and independent voices.',
    icon: SparklesIcon,
  },
]
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mx-auto max-w-6xl">
        <!-- Hero -->
        <section class="mb-12">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p class="text-sm font-semibold text-indigo-400">About</p>
              <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Unlistened.me
              </h1>
              <p class="mt-4 max-w-2xl text-lg leading-8 text-gray-400">
                Unlistened.me is a podcast player designed to make discovery simple, pleasant, and focused.
                Whether you listen every day or only from time to time, the platform helps you find shows worth your attention in a clean and private environment.
              </p>
              <p class="mt-4 max-w-2xl text-base leading-7 text-gray-500">
                The idea behind the project is straightforward. Give people a better way to explore podcasts, save what matters to them, and enjoy listening without noise, clutter, or unnecessary friction.
              </p>
            </div>

            <div class="flex justify-center lg:justify-end">
              <div class="rounded-3xl border border-gray-800 bg-gray-900/60 p-6 shadow-lg">
                <img
                    class="mx-auto w-56 sm:w-72"
                    src="/images/unlistened_transparen_logo_1563.png"
                    alt="Unlistened.me logo"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Highlights -->
        <section class="mb-14">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Why Unlistened.me
            </h2>
            <p class="mt-3 max-w-3xl text-base leading-7 text-gray-400">
              The platform is built around a few simple values that shape the overall experience.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article
                v-for="item in highlights"
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

        <!-- About me -->
        <section class="mb-14">
          <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
            <div class="mb-6">
              <p class="text-sm font-semibold text-indigo-400">About the creator</p>
              <h2 class="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                Gianluca Tiengo
              </h2>
            </div>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div class="space-y-6 text-base leading-7 text-gray-400">
                <p>
                  Hi, I am Gianluca Tiengo, a developer passionate about building digital products that are useful, clear, and enjoyable to use. Unlistened.me was born from my interest in podcasts and from the desire to create a better listening experience.
                </p>
                <p>
                  My path into development has been shaped by curiosity, persistence, and a lot of hands on learning. Step by step, I worked on turning that passion into real projects, always trying to improve both the quality of the code and the value delivered to people.
                </p>
              </div>

              <div class="space-y-6 text-base leading-7 text-gray-400">
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
          </div>
        </section>

        <!-- Resources / separate section -->
        <section class="mb-12">
          <div class="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8">
            <div class="max-w-3xl">
              <p class="text-sm font-semibold text-indigo-400">Resources</p>
              <h2 class="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                Useful tools and resources I recommend
              </h2>
              <p class="mt-4 text-base leading-7 text-gray-400">
                Over time, I have collected tools, references, and practical resources that helped me learn, build, and improve as a developer. I wanted to keep this part separate because it is not only about Unlistened.me. It is also about sharing things that can genuinely help others grow.
              </p>
              <p class="mt-4 text-base leading-7 text-gray-400">
                I am not affiliated with these resources. I simply use them myself and I believe they can be valuable, especially for self taught developers looking for solid and practical support.
              </p>
            </div>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <a
                  href="https://codehelper.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-500"
              >
                Explore CodeHelper
                <ArrowTopRightOnSquareIcon class="h-4 w-4" />
              </a>

              <div class="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-gray-400">
                <CheckCircleIcon class="h-4 w-4 text-green-400" />
                Personally recommended resources
              </div>
            </div>
          </div>
        </section>

        <!-- Terms link -->
        <section class="pb-6">
          <div class="border-t border-gray-800 pt-6">
            <router-link
                to="/terms"
                class="text-sm font-semibold text-indigo-400 transition-colors hover:text-pink-400"
            >
              Read our terms and conditions →
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </div>

  <Footer />
</template>