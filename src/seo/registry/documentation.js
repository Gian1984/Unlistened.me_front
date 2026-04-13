import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'
import { buildFaqSchema } from '@/seo/schemas/faq.js'

const faq = buildFaqSchema([
  {
    question: 'Do I need an account to start listening?',
    answer: 'No. You can browse and listen without an account. An account is only needed for saved features such as favorites, bookmarks, and playlists.',
  },
  {
    question: 'Where can I save podcasts and episodes?',
    answer: 'Podcasts can be saved to favorites and episodes can be saved to bookmarks. Both areas are available from the library section once you are signed in.',
  },
  {
    question: 'Does Unlistened.me remember where I stopped listening?',
    answer: 'Yes. Listening progress is stored so you can resume from where you left off. For podcasts this history is kept locally on your device.',
  },
  {
    question: 'Can I create playlists for music?',
    answer: 'Yes. Signed in users can like tracks, create playlists, and organize Creative Commons music into personal collections.',
  },
])

export const documentationSeo = {
  title: 'User guide for Unlistened.me',
  description: 'Learn how to use Unlistened.me, from discovering podcasts and music to saving favorites, playlists, and bookmarks.',
  canonical: 'https://www.unlistened.me/documentation',
  ogType: 'website',
  ogImage: 'https://www.unlistened.me/images/og/documentation.png',
  ogImageAlt: 'User guide for Unlistened.me',
  jsonLd: [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Documentation', url: 'https://www.unlistened.me/documentation' },
    ]),
    faq,
  ],
}
