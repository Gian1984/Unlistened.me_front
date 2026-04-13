import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'
import { buildFaqSchema } from '@/seo/schemas/faq.js'

const faq = buildFaqSchema([
  {
    question: 'Who is responsible for podcast and music content on Unlistened.me?',
    answer: 'Creators and rights holders remain responsible for the podcast and music content made available through the platform. Unlistened.me does not claim ownership of that content.',
  },
  {
    question: 'Does Unlistened.me provide warranties about the service?',
    answer: 'No. The service is provided as is and as available. Unlistened.me does not guarantee uninterrupted availability, error free operation, or fitness for a particular purpose.',
  },
  {
    question: 'Can the terms change over time?',
    answer: 'Yes. The terms may be updated when necessary. Continued use of the service after changes become active means you accept the revised terms.',
  },
  {
    question: 'Is Unlistened.me a commercial service?',
    answer: 'No. Unlistened.me is presented as a non profit project created to support access to useful audio content in a simple and respectful environment.',
  },
])

export const termsSeo = {
  title: 'Terms and conditions for Unlistened.me',
  description: 'Read the terms and conditions for Unlistened.me, including content responsibility, trademarks, user information, and service rules.',
  canonical: 'https://www.unlistened.me/terms',
  ogType: 'website',
  ogImage: 'https://www.unlistened.me/images/og/terms.png',
  ogImageAlt: 'Terms and conditions for Unlistened.me',
  jsonLd: [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Terms', url: 'https://www.unlistened.me/terms' },
    ]),
    faq,
  ],
}
