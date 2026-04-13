import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'

export const musicSeo = {
  title: 'Free Creative Commons music on Unlistened.me',
  description: 'Stream free Creative Commons music from independent artists on Unlistened.me. Explore genres, save tracks, and build playlists without tracking.',
  canonical: 'https://www.unlistened.me/music',
  ogType: 'website',
  ogImage: 'https://www.unlistened.me/images/og/music.png',
  ogImageAlt: 'Free music on Unlistened.me',
  jsonLd: [
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://www.unlistened.me/' },
      { name: 'Music', url: 'https://www.unlistened.me/music' },
    ]),
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
