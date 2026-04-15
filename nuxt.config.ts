import { fileURLToPath } from 'node:url'
import { staticRoutes } from './config/static-routes'
import { dynamicPublicRoutes } from './config/dynamic-public-routes'

const legacySrcDir = fileURLToPath(new URL('./src', import.meta.url))

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
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
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.VITE_BASE_URL || process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost/',
    },
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: staticRoutes.filter((route) => route.prerender).map((route) => route.path),
    },
  },
  routeRules: Object.fromEntries(
    dynamicPublicRoutes.map((route) => [
      route.pattern,
      {
        prerender: route.prerender,
      },
    ])
  ),
})
