<script setup>
import Footer from '../components/Footer.vue'
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/vue/20/solid'
</script>
<template>
  <div class="bg-white px-6 py-32 lg:px-8">
    <div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
      <p class="text-base font-semibold leading-7 text-indigo-600">Introducing</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Unlistened.me</h1>
      <p class="mt-6 text-xl leading-8 text-gray-900">
        Welcome to Unlistened.me, the simplest way to enjoy your favorite podcasts for free! I am committed to providing a user-friendly experience without tracking cookies or profiling our users. Enjoy unrestricted access to a world of stories, insights, and entertainment with complete privacy and zero cost.
      </p>
      <div class="mt-10 max-w-2xl">
        <p>
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
        <p class="mt-8">Join me at Unlistened.me to explore, learn, and grow through the vast world of podcasts, completely free and with total privacy."</p>
        <h2 class="mt-16 text-2xl font-bold tracking-tight text-gray-900">
          Hey there!
        </h2>
        <p class="mt-6">
          I’m Gianluca Tiengo, a passionate web developer dedicated to turning complex problems into simple, beautiful, and intuitive website designs. I thrive on creating digital spaces that not only look good but also provide a seamless and engaging user experience.
          <br><br>
          As a self-made developer, I've poured heart and determination into mastering the craft of web development. It's been a challenging journey, filled with endless learning and growth. Every line of code I write is a reflection of the effort it took to
          transform my passion into my profession, bringing me to where I am today.
        </p>
        <figure class="mt-10 border-l border-indigo-600 pl-9">
          <blockquote class="font-semibold text-gray-900">
            <p>“One of the important skills as a Self-taught developer is to be resourceful, my father taught me this skill when I was still very young, and I didn’t know it would take me far in life. I started with wordpress for fun, and my curiosity led me to my first HTML / CSS site. Working during the day,
              at night I took courses on SoloLearn and all the online platforms that could satiate my desire to learn.
              <br><br>
              I realized then that making websites was what I wanted for myself, and I took the time to attend a bootcamp in programming to get better and learn more.
              Through this learning journey that continues to this day, I am happy and I continue to apply the same principles to what is finally my job today.”
            </p>
          </blockquote>
          <figcaption class="mt-6 flex gap-x-4">
            <div class="text-sm leading-6"><strong class="font-semibold text-gray-900">Re-source-ful</strong> – Having the ability to find clever ways to overcome difficulties.</div>
          </figcaption>
        </figure>
        <p class="mt-10">
          Here bellow you can find some important resources that I've collected during my experience and that i want to share. I am not affiliated with any of it, I am just using them personally and would want to share it with you, especially to all self-taught developer.
        </p>
        <a href="https://letudev.com/" target="_blank" class="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full mt-5 inline-flex">More...</a>
      </div>
    </div>
  </div>
  <Footer />
</template>

