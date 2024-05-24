<script setup>
import Footer from '../components/Footer.vue'
const jobOpenings = [
  {
    id: 1,
    role: 'Diverse Library:',
    description:
        'Access a wide range of podcasts from various genres and creators around the globe.',
  },
  {
    id: 2,
    role: 'User Privacy:',
    description:
        'We respect your privacy. Unlistened.me only collects your email to provide you with the best service, without tracking your habits or personal data.',
  },
  {
    id: 3,
    role: 'Non-Profit Service:',
    description:
        'Our platform is a labor of love aimed at promoting public culture and knowledge dissemination. We do not generate any revenue from this service.',
  },
]
</script>
<template>
  <div class="bg-white py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto flex max-w-2xl flex-col items-end justify-between gap-16 lg:mx-0 lg:max-w-none lg:flex-row">
        <div class="w-full lg:max-w-lg lg:flex-auto">
          <p class="text-base font-semibold leading-7 text-indigo-600">About</p>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Unlistened.me</h1>
          <p class="mt-6 text-xl leading-8 text-gray-900">Welcome to Unlistened.me, a podcast player designed to enhance your listening experience. Whether you're a podcast enthusiast or a casual listener, Unlistened.me offers a seamless and personalized platform to discover, enjoy, and share your favorite podcasts.</p>
          <img src="/images/unlistened_transparen_logo_1563.png" alt="" class="mt-16 lg:max-w-75 mx-auto object-cover" />
        </div>
        <div class="w-full lg:max-w-xl lg:flex-auto">
          <h3 class="sr-only">Job openings</h3>
          <ul class="-my-8 divide-y divide-gray-100">
            <li v-for="opening in jobOpenings" :key="opening.id" class="py-8">
              <dl class="relative flex flex-wrap gap-x-3">
                <dt class="sr-only">Role</dt>
                <dd class="w-full flex-none text-lg font-semibold tracking-tight text-gray-900">
                    {{ opening.role }}
                    <span class="absolute inset-0" aria-hidden="true" />
                </dd>
                <dt class="sr-only">Description</dt>
                <dd class="mt-2 w-full flex-none text-base leading-7 text-gray-600">{{ opening.description }}</dd>
              </dl>
            </li>
          </ul>
          <div class="mt-8 flex border-t border-gray-100 pt-8">
            <router-link to="/terms" class="text-sm font-semibold leading-6 text-indigo-600 hover:text-pink-500">Read our terms & conditions <span aria-hidden="true">&rarr;</span></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white pb-24 sm:pb-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <p class="text-base font-semibold leading-7 text-indigo-600">About</p>
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Me</h2>
        <div class="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-900 lg:max-w-none lg:grid-cols-2">
          <div>
            <p>Hi there! I am Gianluca Tiengo, a passionate developer with a keen interest in creating innovative digital solutions that enrich people's lives. With a strong background in software development and a deep love for podcasts, I've embarked on a journey to revolutionize the way we discover and enjoy podcast content.</p>
            <p class="mt-8">
              As a self-made developer, I've poured heart and determination into mastering the craft of web development. It's been a challenging journey, filled with endless learning and growth. Every line of code I write is a reflection of the effort it took to transform my passion into my profession, bringing me to where I am today.
            </p>
          </div>
          <div>
            <p>
              At Unlistened.me, my mission is to create a community of informed, engaged, and curious listeners. I'm constantly evolving and would love to hear your feedback on how i can improve. Feel free to reach out with any suggestions or questions!
            </p>
            <p class="mt-8">Here bellow you can find some important resources that I've collected during my experience and that i want to share. I am not affiliated with any of it, I am just using them personally and would want to share it with you, especially to all self-taught developer.</p>
          </div>
        </div>
        <div class="mt-10 flex justify-end">
          <a href="https://letudev.com/" target="_blank" class="rounded-full bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Learn more</a>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>
