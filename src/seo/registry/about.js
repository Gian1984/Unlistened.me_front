import { organizationSchema } from '@/seo/schemas/organization.js'
import { buildFaqSchema } from '@/seo/schemas/faq.js'

const faq = buildFaqSchema([
  {
    question: 'Who created Unlistened.me?',
    answer: 'Unlistened.me was created by Gianluca Tiengo, a developer passionate about building simple, useful, and privacy-respecting digital products.',
  },
  {
    question: 'Is Unlistened.me open source?',
    answer: 'Unlistened.me is a personal project built with Vue 3, Vite, and a Laravel 11 backend. Parts of it may be shared over time.',
  },
  {
    question: 'How can I contact support?',
    answer: 'You can reach us at support@unlistened.me. We read every message and try to respond as quickly as possible.',
  },
  {
    question: 'Does Unlistened.me use cookies?',
    answer: 'Unlistened.me does not use tracking cookies. A session cookie is used only if you choose to log in, to keep you authenticated.',
  },
])

export const aboutSeo = {
  title: 'About Unlistened.me — Privacy-first Podcast Player',
  description: 'Learn about Unlistened.me, the podcast player built with privacy at its core. No ads, no tracking. Made for listeners, not algorithms.',
  canonical: 'https://www.unlistened.me/about',
  ogType: 'website',
  ogImage: 'https://www.unlistened.me/images/og/about.png',
  jsonLd: [organizationSchema, faq],
}
