<script setup>
import Footer from '../components/Footer.vue'
import { CheckIcon } from '@heroicons/vue/20/solid'

const features = [
  {
    name: 'User-Generated Content',
    description: 'Users may have the ability to post, upload, or otherwise contribute content (e.g., comments, reviews) to Unlistened.me. By submitting content, users grant Unlistened.me a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, reproduce, modify, publish, and display such content. Users are solely responsible for the content they provide, and Unlistened.me does not endorse, guarantee the accuracy of, or assume any responsibility for user-generated content.',
  },
  {
    name: 'Third-Party Content and Links',
    description: 'Unlistened.me may include links to third-party websites or services that are not owned or controlled by Unlistened.me. We do not endorse or assume any responsibility for any such third-party sites, information, materials, products, or services. If you access a third-party website from Unlistened.me, you do so at your own risk, and you understand that this agreement and Unlistened.me’s Privacy Policy do not apply to your use of such sites.',
  },
  {
    name: 'Intellectual Property',
    description: 'All content provided on Unlistened.me, including but not limited to text, graphics, logos, images, and software, is the property of Unlistened.me or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws. Unauthorized use of the content may violate these laws and is strictly prohibited.',
  },
  {
    name: 'Content Responsibility',
    description: 'Unlistened.me is not responsible for the content of the podcasts or the music played. The views and opinions expressed in the podcasts are those of the creators and do not necessarily reflect our views.',
  },
  {
    name: 'Trademarks and Logos',
    description: 'All logos and trademarks displayed in our application are used solely for informational purposes. We respect the intellectual property rights of others and do not claim any rights to these trademarks.' },
  {
    name: 'User Information',
    description: 'We do not collect any personal information about our users or their habits. The only information we collect is your email address, which is solely used to offer our services to you.',
  },
  {
    name: 'Limitation of Liability',
    description: 'Unlistened.me and its directors, officers, employees, partners, agents, suppliers, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.',
  },
  {
    name: 'Disclaimer of Warranties',
    description: 'The service is provided on an "AS IS" and "AS AVAILABLE" basis. Use of the service is at your own risk. The service is provided without warranties of any kind, whether express or implied, including but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. Unlistened.me and its affiliates do not warrant that (a) the service will function uninterrupted, secure, or available at any particular time or location; (b) any errors or defects will be corrected; (c) the service is free of viruses or other harmful components; or (d) the results of using the service will meet your requirements.',
  },
  {
    name: 'Indemnification',
    description: 'You agree to defend, indemnify, and hold harmless Unlistened.me and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney\'s fees) arising from (a) your use of and access to the service, by you or any person using your account and password; (b) a breach of these terms, or (c) content posted on the service.',
  },
  {
    name: 'Governing Law',
    description: 'These terms shall be governed and construed in accordance with the laws of the jurisdiction where Unlistened.me operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these terms will not be considered a waiver of those rights. If any provision of these terms is held to be invalid or unenforceable by a court, the remaining provisions of these terms will remain in effect. These terms constitute the entire agreement between us regarding our service, and supersede and replace any prior agreements we might have had between us regarding the service.',
  },
  {
    name: 'Changes',
    description: 'We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is material we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the service.',
  },
  {
    name: 'Non-Profit Service',
    description: 'Unlistened.me does not generate any revenue. Our service is provided for the purpose of public culture and diffusion. We are committed to offering this service to enhance public access to valuable content.',
  },
]
</script>

<template>
  <div class="bg-white py-24 sm:py-24">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm pb-24">
        <img class="mx-auto h-64 w-auto" src="/images/unlistened.me_white_300.png" alt="Unlistened.me logo" />
      </div>
      <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div>
          <p class="text-base font-semibold leading-7 text-indigo-600">Please read carefoully our</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Terms and Conditions</h1>
          <p class="mt-6 text-base leading-7 text-gray-900">
            Welcome to Unlistened.me. By using our podcast player application, you agree to the following terms and conditions. Please read them carefully.
          </p>
        </div>
        <dl class="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:gap-y-16">
          <div v-for="feature in features" :key="feature.name" class="relative pl-9">
            <dt class="font-semibold text-gray-900">
              <CheckIcon class="absolute left-0 top-1 h-5 w-5 text-indigo-500" aria-hidden="true" />
              {{ feature.name }}
            </dt>
            <dd class="mt-2">{{ feature.description }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
  <Footer />
</template>