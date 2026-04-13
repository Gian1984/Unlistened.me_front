import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'
import { buildFaqSchema } from '@/seo/schemas/faq.js'

const faq = buildFaqSchema([
  {
    question: 'Does Unlistened.me track my listening activity?',
    answer: 'No. Unlistened.me does not use tracking cookies to profile your listening habits. Optional analytics remain disabled until you explicitly accept them.',
  },
  {
    question: 'What personal data is stored if I create an account?',
    answer: 'If you create an account, Unlistened.me stores your name, email address, hashed password, preferences, and the items you choose to save in your library.',
  },
  {
    question: 'Can I delete my account and saved data?',
    answer: 'Yes. You can delete your account from the Settings page. Your profile, favorites, bookmarks, and related preferences are then permanently removed.',
  },
  {
    question: 'Are podcast audio files hosted by Unlistened.me?',
    answer: 'Not always. Some podcast covers and audio files are hosted by the podcasts themselves, which means your browser may connect directly to those servers when you play or display an episode.',
  },
])

export const privacySeo = {
  title: 'Privacy policy for Unlistened.me',
  description: 'Learn how Unlistened.me collects, uses, and protects your data. Privacy focused listening with clear and simple policies.',
  canonical: 'https://www.unlistened.me/privacy',
  ogType: 'website',
  ogImage: 'https://www.unlistened.me/images/og/privacy.png',
  ogImageAlt: 'Privacy policy for Unlistened.me',
  jsonLd: [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Privacy', url: 'https://www.unlistened.me/privacy' },
    ]),
    faq,
  ],
}
