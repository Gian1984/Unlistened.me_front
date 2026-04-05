<script setup>
import Footer from '../components/Footer.vue'
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'

const termsSections = [
  {
    name: 'User generated content',
    description:
        'Users may be able to post, upload, or contribute content to Unlistened.me, such as comments or reviews. By submitting content, you grant Unlistened.me a non exclusive, transferable, sub licensable, royalty free, worldwide license to use, reproduce, modify, publish, and display that content. You remain solely responsible for what you submit. Unlistened.me does not endorse user content, does not guarantee its accuracy, and does not assume responsibility for it.',
  },
  {
    name: 'Third party content and links',
    description:
        'Unlistened.me may include links to websites or services operated by third parties. These external services are not owned or controlled by Unlistened.me. We do not endorse them and we are not responsible for their content, materials, products, or services. If you access a third party website through Unlistened.me, you do so at your own risk.',
  },
  {
    name: 'Intellectual property',
    description:
        'All content made available on Unlistened.me, including text, graphics, logos, images, and software, belongs to Unlistened.me or its content providers and is protected by applicable intellectual property laws. Unauthorized use of this content is prohibited.',
  },
  {
    name: 'Content responsibility',
    description:
        'Unlistened.me is not responsible for the content of podcasts or music made available through the platform. Views and opinions expressed by creators belong to them and do not necessarily reflect our own.',
  },
  {
    name: 'Trademarks and logos',
    description:
        'Logos and trademarks shown in the application remain the property of their respective owners. They are displayed for informational purposes only. Unlistened.me does not claim ownership of those marks.',
  },
  {
    name: 'User information',
    description:
        'We aim to minimize data collection. The only personal information we collect is your email address, and it is used only to provide access to the service and related functionality.',
  },
  {
    name: 'Limitation of liability',
    description:
        'Unlistened.me, including its operators, partners, affiliates, and contributors, shall not be liable for indirect, incidental, special, consequential, or punitive damages. This includes loss of profits, data, goodwill, or other intangible losses resulting from your access to the service, your inability to use it, third party content, or unauthorized access to your information.',
  },
  {
    name: 'Disclaimer of warranties',
    description:
        'The service is provided as is and as available. Use of the service is at your own risk. We do not provide warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, or non infringement. We do not guarantee that the service will always be uninterrupted, secure, error free, or available at all times.',
  },
  {
    name: 'Indemnification',
    description:
        'You agree to defend, indemnify, and hold harmless Unlistened.me and its operators, licensors, and contributors from claims, damages, liabilities, losses, and expenses arising from your use of the service, your breach of these terms, or content submitted through your account.',
  },
  {
    name: 'Governing law',
    description:
        'These terms are governed by the laws of the jurisdiction in which Unlistened.me operates, without regard to conflict of law rules. If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue to apply in full.',
  },
  {
    name: 'Changes to these terms',
    description:
        'We may update or replace these terms when necessary. If a change is material, we will make reasonable efforts to provide notice before the updated terms take effect. By continuing to use the service after the changes become active, you agree to the revised terms.',
  },
  {
    name: 'Non profit service',
    description:
        'Unlistened.me does not operate as a revenue generating service. The project exists to support public access to culture, knowledge, and useful audio content in a simple and respectful environment.',
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
              <p class="text-sm font-semibold text-indigo-400">Terms and conditions</p>
              <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Please read these terms carefully
              </h1>
              <p class="mt-4 max-w-2xl text-lg leading-8 text-gray-400">
                By using Unlistened.me, you agree to the terms that govern access to the platform and the way the service is provided.
              </p>
              <p class="mt-4 max-w-2xl text-base leading-7 text-gray-500">
                This page explains the main conditions related to content, responsibility, user information, external links, and the general use of the service.
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

        <!-- Intro cards -->
        <section class="mb-14">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article class="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 transition-colors hover:border-indigo-500">
              <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10">
                <DocumentTextIcon class="h-6 w-6 text-indigo-400" />
              </div>
              <h2 class="text-lg font-semibold text-white">Clear framework</h2>
              <p class="mt-3 text-sm leading-7 text-gray-400">
                These terms define the general rules that apply when you use the platform and its features.
              </p>
            </article>

            <article class="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 transition-colors hover:border-indigo-500">
              <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10">
                <ShieldCheckIcon class="h-6 w-6 text-indigo-400" />
              </div>
              <h2 class="text-lg font-semibold text-white">Respect and responsibility</h2>
              <p class="mt-3 text-sm leading-7 text-gray-400">
                The service is designed to be useful and respectful, but users are also responsible for how they interact with it.
              </p>
            </article>

            <article class="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 transition-colors hover:border-indigo-500">
              <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10">
                <ExclamationTriangleIcon class="h-6 w-6 text-indigo-400" />
              </div>
              <h2 class="text-lg font-semibold text-white">Important limitations</h2>
              <p class="mt-3 text-sm leading-7 text-gray-400">
                Some sections explain liability limits, third party content, and the absence of warranties.
              </p>
            </article>
          </div>
        </section>

        <!-- Terms list -->
        <section class="mb-14">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Main terms
            </h2>
            <p class="mt-3 max-w-3xl text-base leading-7 text-gray-400">
              The following points summarize the key conditions that apply to the use of Unlistened.me.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <article
                v-for="section in termsSections"
                :key="section.name"
                class="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 transition-colors hover:border-indigo-500"
            >
              <div class="flex gap-3">
                <CheckCircleIcon class="mt-0.5 h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                <div>
                  <h3 class="text-base font-semibold text-white">
                    {{ section.name }}
                  </h3>
                  <p class="mt-3 text-sm leading-7 text-gray-400">
                    {{ section.description }}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- Closing note -->
        <section class="pb-6">
          <div class="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8">
            <p class="text-sm font-semibold text-indigo-400">Final note</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Continued use means acceptance
            </h2>
            <div class="mt-5 max-w-4xl space-y-4 text-base leading-7 text-gray-400">
              <p>
                By continuing to access or use Unlistened.me, you confirm that you have read and accepted these terms and conditions.
              </p>
              <p>
                If you do not agree with these terms, you should stop using the service.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <Footer />
</template>