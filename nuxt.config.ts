import { fileURLToPath } from 'node:url'

const legacySrcDir = fileURLToPath(new URL('./src', import.meta.url))

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@pinia/nuxt'],
  pinia: {
    // Stores live under src/stores/ (legacy layout); register that path so they are auto-imported
    storesDirs: ['./src/stores/**'],
  },
  css: ['~/src/assets/main.css'],
  site: {
    url: 'https://www.unlistened.me',
  },
  sitemap: {
    sources: [
      '/api/sitemap-urls', // Esempio se avessi un endpoint per i podcast
    ],
    exclude: ['/forbidden', '/dashboard', '/settings'],
  },
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  alias: {
    '@': legacySrcDir,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Unlistened.me',
      titleTemplate: '%s | Unlistened.me',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Podcast and music discovery platform powered by a Laravel API.' },
        { name: 'theme-color', content: '#030712' },
        { name: 'apple-mobile-web-app-title', content: 'Unlistened.me' },
        { property: 'og:site_name', content: 'Unlistened.me' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://www.unlistened.me/images/ogimage-min.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://www.unlistened.me' },
      ],
      bodyAttrs: {
        class: 'bg-gray-950 text-gray-200',
      },
      noscript: [
        {
          innerHTML: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MF5TLTDF" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
          tagPosition: 'bodyOpen',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.unlistened.me',
    },
  },
  nitro: {
    prerender: {
      // Don't auto-discover routes; rely on routeRules below as the single source of truth.
      crawlLinks: false,
      fallback: '200.html',
    },
  },
  routeRules: {
    // Static pages to prerender (single source of truth — Nitro picks these up at build time).
    '/': { prerender: true },
    '/podcasts': { prerender: true },
    '/music': { prerender: true },
    '/music/albums': { prerender: true },
    '/music/singles': { prerender: true },
    '/categories': { prerender: true },
    '/about': { prerender: true },
    '/documentation': { prerender: true },
    '/terms': { prerender: true },
    '/privacy': { prerender: true },

    // Shell pages prerendered with parent-section OG for dynamic routes
    // (.htaccess rewrites bot traffic to these for OG fallback).
    '/feed': { prerender: true },
    '/episode': { prerender: true },
    '/music/album': { prerender: true, ssr: true },

    // Private library routes: user-specific, non-indexable, client-only
    '/favourites': { ssr: false },
    '/bookmarks': { ssr: false },
    '/music/favorites': { ssr: false },
    '/music/playlists': { ssr: false },
    '/music/playlists/**': { ssr: false },
  },
})
