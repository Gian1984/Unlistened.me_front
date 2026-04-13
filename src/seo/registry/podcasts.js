import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'

export const podcastsSeo = {
  title: 'Trending podcasts on Unlistened.me',
  description: 'Browse and stream trending podcasts for free on Unlistened.me. Explore categories, discover new voices, and listen without tracking.',
  canonical: 'https://www.unlistened.me/podcasts',
  ogType: 'website',
  ogImage: 'https://www.unlistened.me/images/og/podcasts.png',
  ogImageAlt: 'Trending podcasts on Unlistened.me',
  jsonLd: [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Podcasts', url: 'https://www.unlistened.me/podcasts' },
    ]),
  ],
}
