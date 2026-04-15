import { fileURLToPath } from 'node:url'
import { staticRoutes } from './config/static-routes'
import { dynamicPublicRoutes } from './config/dynamic-public-routes'

const legacySrcDir = fileURLToPath(new URL('./src', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['~/src/assets/main.css'],
  alias: {
    '@': legacySrcDir,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
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
