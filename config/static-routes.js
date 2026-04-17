export const staticRoutes = [
  { key: 'home', path: '/', label: 'Home', seoKey: 'home', prerender: true, changefreq: 'daily', priority: '1.0', title: 'Unlistened.me', description: 'Podcast and music discovery platform powered by a Laravel API.' },
  { key: 'podcasts', path: '/podcasts', label: 'Podcasts', seoKey: 'podcasts', prerender: true, changefreq: 'daily', priority: '0.9', title: 'Podcasts', description: 'Browse trending podcasts, categories, and continue listening.' },
  { key: 'music', path: '/music', label: 'Music', seoKey: 'music', prerender: true, changefreq: 'daily', priority: '0.9', title: 'Music', description: 'Discover trending albums and songs from the music catalog.' },
  { key: 'musicAlbums', path: '/music/albums', label: 'Music Albums', seoKey: 'musicAlbums', prerender: true, changefreq: 'weekly', priority: '0.8', title: 'Music Albums', description: 'Browse albums with a static-first Nuxt page structure.' },
  { key: 'musicSingles', path: '/music/singles', label: 'Music Singles', seoKey: 'musicSingles', prerender: true, changefreq: 'weekly', priority: '0.8', title: 'Music Singles', description: 'Browse songs and genre-driven music discovery.' },
  { key: 'categories', path: '/categories', label: 'Categories', seoKey: 'categories', prerender: true, changefreq: 'weekly', priority: '0.8', title: 'Categories', description: 'Explore content categories for podcasts and music.' },
  { key: 'about', path: '/about', label: 'About', seoKey: 'about', prerender: true, changefreq: 'monthly', priority: '0.6', title: 'About', description: 'About the Unlistened.me project.' },
  { key: 'documentation', path: '/documentation', label: 'Documentation', seoKey: 'documentation', prerender: true, changefreq: 'monthly', priority: '0.5', title: 'Documentation', description: 'Product documentation and platform guidance.' },
  { key: 'terms', path: '/terms', label: 'Terms', seoKey: 'terms', prerender: true, changefreq: 'yearly', priority: '0.3', title: 'Terms', description: 'Terms and conditions for using Unlistened.me.' },
  { key: 'privacy', path: '/privacy', label: 'Privacy', seoKey: 'privacy', prerender: true, changefreq: 'yearly', priority: '0.3', title: 'Privacy', description: 'Privacy policy and data usage details.' },
]
