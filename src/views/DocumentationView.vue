<script setup>
import Footer from '../components/Footer.vue'
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
</script>
<template>
  <div class="bg-white px-6 py-32 lg:px-8">
    <div class="mx-auto max-w-7xl text-base leading-7 text-gray-700">
      <p class="text-base font-semibold leading-7 text-indigo-600">Documentation</p>
      <h1 class="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">Unlistened.me</h1>
      <h2 class="mt-16 text-2xl font-bold tracking-tight text-gray-900">Overview</h2>
      <div class="mt-10 max-w-7xl">

        <p>Unlistened.me is a modern podcast player application designed to provide a seamless and enjoyable listening experience. The app is built using the latest web technologies to ensure high performance, security, and a user-friendly interface.</p>

        <h2 class="mt-16 text-2xl font-bold tracking-tight text-gray-900 md:text-center">Technologies Used</h2>

        <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-600 md:mx-auto">
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span>
              <strong class="font-semibold text-gray-900">Vue.js:</strong>
              A progressive JavaScript framework used for building user interfaces. Vue.js is known for its simplicity and flexibility, making it an ideal choice for creating dynamic and responsive web applications.
            </span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span>
              <strong class="font-semibold text-gray-900">Tailwind CSS:</strong>
              A utility-first CSS framework for rapidly building custom designs. Tailwind CSS allows for easy customization and ensures a consistent look and feel across the application.
            </span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span>
              <strong class="font-semibold text-gray-900">Laravel 11:</strong>
              A PHP framework designed for web artisans. Laravel provides an elegant syntax, robust tools for database management, and a powerful MVC architecture, making it perfect for building scalable web applications.
            </span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span>
              <strong class="font-semibold text-gray-900">MySQL:</strong>
              A relational database management system used to store and manage application data. MySQL is reliable, secure, and efficient, ensuring that the app's data is handled smoothly.
            </span>
          </li>
        </ul>


        <h2 class="mt-16 text-2xl font-bold tracking-tight text-gray-900 md:text-center">Key Features</h2>

        <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-600 md:mx-auto">
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span>
              <strong class="font-semibold text-gray-900">User Authentication:</strong>
              Secure login and registration system to protect user data.
            </span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span>
              <strong class="font-semibold text-gray-900">Podcast Management:</strong>
              Easily browse, search, and manage your favorite podcasts and episodes.
            </span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span>
              <strong class="font-semibold text-gray-900">Bookmarking and Favorites:</strong>
              Save and organize your favorite episodes and podcasts for quick access.
            </span>
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
            <span>
              <strong class="font-semibold text-gray-900">Responsive Design:</strong>
              Optimized for both desktop and mobile devices, providing a seamless experience across all platforms.
            </span>
          </li>
        </ul>

        <h2 class="mt-16 text-2xl font-bold tracking-tight text-gray-900">Contribution</h2>
        <p class="mt-6">We welcome contributions from the community! If you'd like to contribute, please fork the repository and create a pull request with your changes. Be sure to follow our coding standards and include detailed commit messages.</p>
      </div>

      <div class="mt-16 max-w-2xl">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">License</h2>
        <p class="mt-6">Unlistened.me is open-source software licensed under the MIT license. The software is provided "AS IS", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.</p>
      </div>
    </div>
  </div>
  <Footer />
</template>
