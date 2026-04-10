import { websiteSchema } from '@/seo/schemas/website.js'
import { organizationSchema } from '@/seo/schemas/organization.js'
import { buildFaqSchema } from '@/seo/schemas/faq.js'

const faq = buildFaqSchema([
  {
    question: 'Is Unlistened.me free?',
    answer: 'Yes, Unlistened.me is completely free. No subscription, no ads, no hidden costs.',
  },
  {
    question: 'Do you track my listening activity?',
    answer: 'No. Unlistened.me does not use cookies to track your listening habits or personal behavior.',
  },
  {
    question: 'Do I need an account to listen to podcasts?',
    answer: 'No account is required to browse and listen. You can create a free account to save favourites and bookmarks across sessions.',
  },
  {
    question: 'How many podcasts are available on Unlistened.me?',
    answer: 'Unlistened.me indexes thousands of podcasts across dozens of categories, from technology and science to arts, culture, and personal development.',
  },
  {
    question: 'Can I listen to podcasts on mobile?',
    answer: 'Yes. Unlistened.me is fully responsive and works on any modern smartphone or tablet browser.',
  },
])

export const homeSeo = {
  title: 'Free Podcasts & Music — No Tracking | Unlistened.me',
  description: 'Discover and stream thousands of podcasts and free Creative Commons music. No cookies, no tracking, no accounts required. Your private listening experience starts here.',
  canonical: 'https://www.unlistened.me/',
  ogType: 'website',
  jsonLd: [websiteSchema, organizationSchema, faq],
}
