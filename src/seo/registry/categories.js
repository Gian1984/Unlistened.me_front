import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'

export const categoriesSeo = {
  title: 'Browse podcast categories on Unlistened.me',
  description: 'Explore podcasts by category on Unlistened.me. From technology and science to arts, comedy, true crime, and personal growth, find your next favorite show.',
  canonical: 'https://www.unlistened.me/categories',
  ogType: 'website',
  ogImage: 'https://www.unlistened.me/images/og/categories.png',
  ogImageAlt: 'Podcast categories on Unlistened.me',
  jsonLd: [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Categories', url: 'https://www.unlistened.me/categories' },
    ]),
  ],
}
