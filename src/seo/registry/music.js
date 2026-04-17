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

export const musicAlbumsSeo = {
  title: 'Music albums | Unlistened.me',
  description: 'Browse full Creative Commons music albums on Unlistened.me. Discover independent releases and open album pages with track lists.',
  canonical: 'https://www.unlistened.me/music/albums',
  ogType: 'website',
}

export const musicSinglesSeo = {
  title: 'Trending songs | Unlistened.me',
  description: 'Browse trending Creative Commons songs on Unlistened.me. Filter by genre, load more tracks, and discover independent music.',
  canonical: 'https://www.unlistened.me/music/singles',
  ogType: 'website',
}
