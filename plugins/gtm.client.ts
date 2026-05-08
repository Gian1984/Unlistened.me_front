import { nextTick } from 'vue'
import { getSafeLocalStorage } from '@/utils/browserStorage.js'

const GTM_ID = 'GTM-MF5TLTDF'
const CONSENT_STORAGE_KEY = 'unlistened_cookie_consent_v1'

type StoredConsent = {
  analytics?: boolean
  marketing?: boolean
}

export default defineNuxtPlugin((nuxtApp) => {
  const w = window as unknown as { dataLayer: unknown[] }
  w.dataLayer = w.dataLayer || []
  const gtag = (...args: unknown[]) => w.dataLayer.push(args)

  let stored: StoredConsent | null = null
  try {
    const raw = getSafeLocalStorage().getItem(CONSENT_STORAGE_KEY)
    if (raw) stored = JSON.parse(raw)
  } catch {
    stored = null
  }

  if (stored) {
    // Returning visitor with a stored decision — honor it immediately.
    gtag('consent', 'default', {
      ad_storage: stored.marketing ? 'granted' : 'denied',
      ad_user_data: stored.marketing ? 'granted' : 'denied',
      ad_personalization: stored.marketing ? 'granted' : 'denied',
      analytics_storage: stored.analytics ? 'granted' : 'denied',
      personalization_storage: stored.analytics ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    })
  } else {
    // First visit — deny everything non-essential and give the banner
    // 500ms to collect the user's decision before tags fire.
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      personalization_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500,
    })
  }

  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(s)

  // Skip the first afterEach: GA4 Config (auto send_page_view) already
  // covers the initial page view at GTM load. Only fire manual page_view
  // events on SPA navigations so we don't double-count in GA4.
  let initialNavigationHandled = false
  const router = nuxtApp.$router as { afterEach: (fn: (to: { fullPath: string }) => void) => void }
  router.afterEach((to) => {
    if (!initialNavigationHandled) {
      initialNavigationHandled = true
      return
    }
    // Wait for Nuxt's useHead to apply the new document.title before pushing.
    nextTick(() => {
      w.dataLayer.push({
        event: 'page_view',
        page_location: window.location.href,
        page_path: to.fullPath,
        page_title: document.title,
      })
    })
  })
})
