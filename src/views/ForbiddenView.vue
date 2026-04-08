<script setup>
import Footer from '../components/Footer.vue'
import { ShieldExclamationIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="bg-gray-950 min-h-screen">
    <div class="p-6 sm:p-8">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <section class="mb-10">
          <div class="max-w-3xl">
            <p class="text-sm font-semibold text-indigo-400">403</p>
            <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Forbidden
            </h1>
            <p class="mt-4 text-base leading-7 text-gray-400">
              You do not have permission to view this page. If you think this is a mistake, please contact support.
            </p>
          </div>
        </section>

        <!-- Info card -->
        <section class="mb-10">
          <div class="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8">
            <div class="flex items-start gap-4">
              <div class="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-indigo-600/10">
                <ShieldExclamationIcon class="h-6 w-6 text-indigo-400" />
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-semibold text-white">Access denied</h2>
                <p class="mt-2 text-sm leading-7 text-gray-400">
                  This page is reserved for authorized users. If you need access, contact our support team and we will help you out.
                </p>
                <div class="mt-6 flex flex-wrap items-center gap-3">
                  <router-link
                      to="/"
                      class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                  >
                    Back to home
                  </router-link>
                  <a
                      href="mailto:support@unlistened.me?subject=Problem with admin access"
                      class="inline-flex items-center gap-2 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
                  >
                    Contact support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
  <Footer />
</template>
