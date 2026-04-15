export const BRAND = 'Unlistened.me'
export const SITE_URL = 'https://www.unlistened.me'

export interface PageSeo {
  title: string
  description: string
  ogImage?: string
  keywords?: string
  structuredData?: any
  faqSchema?: any
  robots?: string
}

export interface RegistryEntry {
  title: string
  description: string
  seo: PageSeo
}

export const pagesRegistry: Record<string, RegistryEntry> = {
  home: {
    title: 'Podcasts and music, all in one place',
    description: 'Discover trending podcasts or explore free Creative Commons music from independent artists.',
    seo: {
      title: `Unlistened.me: Podcasts & Free Music Streaming`,
      description: 'The open audio platform. Discover trending podcasts via PodcastIndex or explore free Creative Commons music from independent artists. No ads, no tracking.',
      ogImage: '/images/og/home.png',
      keywords: 'podcasts, free music, creative commons music, podcast discovery, jamendo, podcastindex',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: BRAND,
        url: SITE_URL
      }
    }
  },
  podcasts: {
    title: 'Discover Trending Podcasts',
    description: 'Explore thousands of podcasts from the PodcastIndex library.',
    seo: {
      title: `Trending Podcasts – ${BRAND}`,
      description: 'Browse the latest trending podcasts across all categories on Unlistened.me.',
      ogImage: '/images/og/podcasts.png'
    }
  },
  music: {
    title: 'Free Creative Commons Music',
    description: 'Discover independent artists and high-quality free music.',
    seo: {
      title: `Explore Free Music – ${BRAND}`,
      description: 'Stream thousands of Creative Commons tracks from independent artists.',
      ogImage: '/images/og/music.png'
    }
  },
  musicAlbums: {
    title: 'Browse Music Albums',
    description: 'Explore albums from independent artists on Jamendo.',
    seo: {
      title: `Music Albums – ${BRAND}`,
      description: 'Discover and stream full albums from independent artists under Creative Commons.',
      ogImage: '/images/og/music.png'
    }
  },
  musicSingles: {
    title: 'Search Free Tracks',
    description: 'Find individual tracks and singles by genre or artist.',
    seo: {
      title: `Music Singles – ${BRAND}`,
      description: 'Search and discover thousands of free tracks across all genres.',
      ogImage: '/images/og/music.png'
    }
  },
  categories: {
    title: 'Browse by Category',
    description: 'Find podcasts and music across various genres and categories.',
    seo: {
      title: `Categories – ${BRAND}`,
      description: 'Explore podcasts and music by genre, from True Crime to Electronic.',
      ogImage: '/images/og/categories.png'
    }
  },
  about: {
    title: 'About Unlistened.me',
    description: 'The story behind the open audio platform.',
    seo: {
      title: `About Us – ${BRAND}`,
      description: 'Learn how Unlistened.me connects you to open audio libraries.',
      ogImage: '/images/og/about.png'
    }
  },
  documentation: {
    title: 'Documentation',
    description: 'How to use Unlistened.me and technical details.',
    seo: {
      title: `Documentation – ${BRAND}`,
      description: 'App guide and technical documentation for Unlistened.me.',
      ogImage: '/images/og/documentation.png'
    }
  },
  terms: {
    title: 'Terms and Conditions',
    description: 'Rules and guidelines for using our platform.',
    seo: {
      title: `Terms & Conditions – ${BRAND}`,
      description: 'Terms of service and usage guidelines for Unlistened.me.',
      ogImage: '/images/og/terms.png'
    }
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How we handle your data and cookies.',
    seo: {
      title: `Privacy Policy – ${BRAND}`,
      description: 'Our commitment to your privacy and data protection.',
      ogImage: '/images/og/privacy.png'
    }
  },
  dashboard: {
    title: 'Admin Dashboard',
    description: 'Platform statistics and management.',
    seo: {
      title: `Dashboard – ${BRAND}`,
      description: 'Internal administration dashboard.',
      robots: 'noindex, nofollow'
    }
  },
  settings: {
    title: 'Account Settings',
    description: 'Manage your profile and preferences.',
    seo: {
      title: `Settings – ${BRAND}`,
      description: 'Update your account settings on Unlistened.me.',
      robots: 'noindex, nofollow'
    }
  },
  bookmarks: {
    title: 'My Bookmarks',
    description: 'Your saved episodes and listening progress.',
    seo: {
      title: `Bookmarks – ${BRAND}`,
      description: 'Access your saved podcast episodes.',
      robots: 'noindex, nofollow'
    }
  },
  favourites: {
    title: 'My Favourites',
    description: 'Your followed podcasts.',
    seo: {
      title: `Favourites – ${BRAND}`,
      description: 'Access your favourite podcast shows.',
      robots: 'noindex, nofollow'
    }
  },
  musicFavorites: {
    title: 'Liked Songs',
    description: 'Your library of liked music tracks.',
    seo: {
      title: `Music Favorites – ${BRAND}`,
      description: 'Your collection of liked music tracks on Unlistened.me.',
      robots: 'noindex, nofollow'
    }
  },
  musicPlaylists: {
    title: 'My Playlists',
    description: 'Your custom music collections.',
    seo: {
      title: `Music Playlists – ${BRAND}`,
      description: 'Browse and manage your music playlists.',
      robots: 'noindex, nofollow'
    }
  },
  nowPlaying: {
    title: 'Now Playing',
    description: 'Currently playing track details.',
    seo: {
      title: `Now Playing – ${BRAND}`,
      description: 'Full screen player view.',
      robots: 'noindex, nofollow'
    }
  },
  forbidden: {
    title: 'Access Denied',
    description: 'You do not have permission to view this page.',
    seo: {
      title: `403 Forbidden – ${BRAND}`,
      description: 'Access denied.',
      robots: 'noindex, nofollow'
    }
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    seo: {
      title: `404 Not Found – ${BRAND}`,
      description: 'Page not found.',
      robots: 'noindex, nofollow'
    }
  }
}
