import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'
import { staticPageSeo } from './staticPages.shared.js'

const musicBase = staticPageSeo.music

export const musicSeo = {
  title: musicBase.title,
  description: musicBase.description,
  canonical: `https://www.unlistened.me${musicBase.path}`,
  ogType: musicBase.ogType,
  ogImage: musicBase.ogImage,
  ogImageAlt: musicBase.ogImageAlt,
  jsonLd: [
    buildBreadcrumbSchema(musicBase.breadcrumbs),
  ],
}

export const musicFavoritesSeo = {
  title: 'Your favorite music | Unlistened.me',
  description: 'Your hand-picked collection of free Creative Commons tracks. Listen anywhere, no ads, no tracking.',
  canonical: 'https://www.unlistened.me/music/favorites',
  ogType: 'website',
  robots: 'noindex,nofollow',
}

export const musicPlaylistsSeo = {
  title: 'Your music playlists | Unlistened.me',
  description: 'Build and listen to your own collections of Creative Commons music. Free, private, no tracking.',
  canonical: 'https://www.unlistened.me/music/playlists',
  ogType: 'website',
  robots: 'noindex,nofollow',
}
