# PWA Strategy — Unlistened.me

## Current State

The app is a standard Vue 3 + Vite SPA with no PWA infrastructure whatsoever:
- No `manifest.json`
- No service worker
- No install prompt
- No offline support
- No push notifications
- `vite-plugin-pwa` not installed

The app **does** already have solid foundations that make PWA relatively straightforward:
- MediaSession API fully implemented (lockscreen controls on mobile)
- `<audio>` element based playback (continues in background on iOS/Android)
- Pinia stores + localStorage for auth and history persistence
- Full dark theme (matches a native app aesthetic)
- Lazy-loaded routes

---

## Recommended Tooling

**`vite-plugin-pwa`** — wraps Workbox, generates service worker and manifest, integrates cleanly with Vite build pipeline.

```bash
npm install -D vite-plugin-pwa
```

No other dependencies needed. Workbox is bundled inside `vite-plugin-pwa`.

---

## Phase 1 — Web App Manifest

### What to add

Create `public/manifest.json` (or let `vite-plugin-pwa` generate it from config):

```json
{
  "name": "Unlistened.me",
  "short_name": "Unlistened",
  "description": "Discover and listen to podcasts from around the world",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#030712",
  "theme_color": "#030712",
  "categories": ["music", "entertainment", "podcasts"],
  "icons": [
    { "src": "/icons/pwa-64x64.png",    "sizes": "64x64",    "type": "image/png" },
    { "src": "/icons/pwa-192x192.png",  "sizes": "192x192",  "type": "image/png" },
    { "src": "/icons/pwa-512x512.png",  "sizes": "512x512",  "type": "image/png", "purpose": "any" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512",  "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Home screen — podcast discovery"
    },
    {
      "src": "/screenshots/player-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Now playing"
    }
  ],
  "shortcuts": [
    {
      "name": "Favourites",
      "short_name": "Favourites",
      "url": "/favourites",
      "icons": [{ "src": "/icons/shortcut-star.png", "sizes": "96x96" }]
    },
    {
      "name": "Bookmarks",
      "short_name": "Bookmarks",
      "url": "/bookmarks",
      "icons": [{ "src": "/icons/shortcut-bookmark.png", "sizes": "96x96" }]
    }
  ]
}
```

### Icon sizes required

| File | Size | Purpose |
|---|---|---|
| `pwa-64x64.png` | 64×64 | Browser favicon fallback |
| `pwa-192x192.png` | 192×192 | Android home screen |
| `pwa-512x512.png` | 512×512 | Splash screen / install dialog |
| `maskable-512.png` | 512×512 | Android adaptive icon (needs safe zone padding ~10%) |
| `apple-touch-icon.png` | 180×180 | iOS home screen (added via `<link>` in `index.html`) |

All icons should use the existing `unlistened_transparen_logo_176.png` asset as source, with `background_color` (`#030712`) as fill.

### Changes to `index.html`

```html
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Unlistened" />
<meta name="theme-color" content="#030712" />
```

iOS Safari does not read the manifest for home screen icons — the `<link rel="apple-touch-icon">` tag is mandatory.

---

## Phase 2 — Service Worker & Caching Strategy

### `vite.config.js` configuration

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'icons/*.png', 'images/*.png'],
      manifest: {
        // (same as above)
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          // App Shell (HTML + assets) — cache first
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
          // Backend API — network first, fallback to cache
          {
            urlPattern: /^https:\/\/api\.unlistened\.me\/api\/(index|feed-cat|search-feeds-by-cat)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-browse-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 3600 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Podcast feed info / episodes — stale-while-revalidate
          {
            urlPattern: /^https:\/\/api\.unlistened\.me\/api\/(feed_info|search_feed|search_episode)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-feed-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 1800 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Podcast cover images — cache first (images rarely change)
          {
            urlPattern: /\.(png|jpg|jpeg|webp|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 604800 }, // 7 days
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Authenticated user endpoints — network only (never cache user data)
          {
            urlPattern: /^https:\/\/api\.unlistened\.me\/api\/(user-favorites|user-bookmarks|user|get_stats)/,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
```

### Caching policy summary

| Content type | Strategy | Rationale |
|---|---|---|
| App shell (JS/CSS/HTML) | **CacheFirst** (precache) | Static assets, versioned by Vite hash |
| Trending / categories | **StaleWhileRevalidate** | Changes hourly, show stale while fetching fresh |
| Feed info / episodes | **StaleWhileRevalidate** | Same — acceptable to show slightly stale data |
| Podcast cover images | **CacheFirst** | Images are stable, expensive to re-fetch |
| User data (auth, favorites) | **NetworkOnly** | Must always be fresh and user-specific |
| Audio streams | **Do not cache** | Podcast MP3s are gigabytes; streaming is correct |

### ⚠️ Audio streams must NOT be cached

Never add the podcast `enclosureUrl` audio streams to service worker caches. They are large (50–500 MB per episode), frequently range-requested (seeking), and would fill the cache quota immediately. The browser handles audio streaming natively — the service worker should bypass them entirely.

To explicitly exclude audio:
```js
// In workbox config
navigateFallbackDenylist: [/^\/api\//],
// Add to runtimeCaching exclusion:
urlPattern: ({ url }) => url.pathname.endsWith('.mp3') || url.searchParams.has('enclosure'),
handler: 'NetworkOnly',
```

---

## Phase 3 — Install Prompt (A2HS)

Create `src/composables/usePwaInstall.js`:

```js
import { ref } from 'vue'

const deferredPrompt = ref(null)
const canInstall = ref(false)

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt.value = e
  canInstall.value = true
})

window.addEventListener('appinstalled', () => {
  deferredPrompt.value = null
  canInstall.value = false
})

export function usePwaInstall() {
  async function install() {
    if (!deferredPrompt.value) return
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      deferredPrompt.value = null
      canInstall.value = false
    }
  }
  return { canInstall, install }
}
```

Add a subtle "Install app" button in `NavigationView.vue` (sidebar bottom or header) that appears only when `canInstall` is true:

```html
<button v-if="canInstall" @click="install" class="...">
  <ArrowDownTrayIcon class="h-5 w-5" />
  Install app
</button>
```

**iOS note:** iOS Safari does not fire `beforeinstallprompt`. On iOS, add a one-time dismissable banner explaining how to use "Add to Home Screen" from the Share menu. Detect iOS with:
```js
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isStandalone = window.navigator.standalone === true
```
Show the banner only when `isIos && !isStandalone`.

---

## Phase 4 — Offline UX

### What works offline (after service worker is active)

- App shell loads (all Vue JS/CSS precached)
- Previously visited routes render from cache
- Categories page renders from cached API response
- Podcast cover images show from image cache

### What does NOT work offline

- Audio playback (streams are not cached)
- Search (requires live API)
- Login / authentication
- Favorites / bookmarks updates

### Offline indicator

Add a small persistent banner when the user is offline:

```js
// src/composables/useNetworkStatus.js
import { ref, onMounted, onBeforeUnmount } from 'vue'
export function useNetworkStatus() {
  const isOnline = ref(navigator.onLine)
  const onOnline = () => (isOnline.value = true)
  const onOffline = () => (isOnline.value = false)
  onMounted(() => {
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  })
  return { isOnline }
}
```

In `App.vue`, show a non-intrusive top banner when offline:
```html
<div v-if="!isOnline" class="fixed top-0 inset-x-0 z-50 bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 text-center text-xs text-yellow-300">
  You're offline — some features are unavailable
</div>
```

---

## Phase 5 — Update Flow

With `registerType: 'autoUpdate'`, the service worker updates silently in the background and activates on next page load. Optionally show a "New version available" toast with a refresh button:

```js
// vite-plugin-pwa provides useRegisterSW composable
import { useRegisterSW } from 'virtual:pwa-register/vue'
const { needRefresh, updateServiceWorker } = useRegisterSW()
```

Show a dismissable toast when `needRefresh.value` is true, with a "Refresh" button that calls `updateServiceWorker()`.

---

## Phase 6 — Push Notifications (Optional / Future)

Push notifications would allow:
- "New episode from a favourite podcast"
- "Your download is ready"

Requires:
1. **Frontend**: subscribe to Push API, send `PushSubscription` to backend
2. **Backend (Laravel)**: store subscriptions, send VAPID-signed push messages
3. **Service worker**: handle `push` events, show `self.registration.showNotification(...)`

Laravel packages: `minishlink/web-push` or `laravel-notification-channels/webpush`

This is complex to implement correctly. Recommend deferring until after Phases 1–5 are stable.

---

## iOS-Specific Gotchas

| Issue | Workaround |
|---|---|
| `beforeinstallprompt` not fired | Show manual "Share → Add to Home Screen" banner |
| Service worker scope limited | Ensure `manifest.json` is served from root |
| Audio interrupted when screen locks | Already fixed in `OffcanvasPlayer.vue` with `x-webkit-airplay`, `playbackState` eager set, and `visibilitychange` auto-resume |
| `localStorage` cleared after 7 days (ITP) | Use `IndexedDB` for persistent data (Workbox `idb-keyval`) if needed |
| Status bar color | Set via `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` |
| Standalone mode detection | `window.navigator.standalone === true` |

---

## File Checklist

| File | Action |
|---|---|
| `package.json` | Add `vite-plugin-pwa` as devDependency |
| `vite.config.js` | Add `VitePWA(...)` plugin with manifest + workbox config |
| `index.html` | Add `<link rel="apple-touch-icon">`, `<meta name="theme-color">`, apple meta tags |
| `public/icons/` | Create all required icon sizes (64, 192, 512, maskable 512, apple 180) |
| `public/screenshots/` | Add 2–3 screenshots for install dialog (optional but improves UX) |
| `src/composables/usePwaInstall.js` | A2HS composable |
| `src/composables/useNetworkStatus.js` | Online/offline detection |
| `src/views/NavigationView.vue` | Add install button (conditional on `canInstall`) |
| `src/App.vue` | Add offline banner, update toast |

---

## Implementation Order

| Step | Task | Effort |
|---|---|---|
| 1 | Install `vite-plugin-pwa`, configure `vite.config.js` | 1h |
| 2 | Generate all icon sizes from existing logo | 30m |
| 3 | Add `index.html` meta tags for iOS | 15m |
| 4 | Test install prompt on Android Chrome and verify manifest | 30m |
| 5 | Add iOS install banner | 1h |
| 6 | Add offline indicator banner | 30m |
| 7 | Test offline behaviour, verify caching strategies | 1–2h |
| 8 | Add update notification toast | 30m |
| 9 | Lighthouse PWA audit (target ≥ 90) | ongoing |

---

## Success Criteria

- Lighthouse PWA score ≥ 90
- App installable on Android Chrome and iOS Safari (via A2HS)
- App shell loads in < 1s on repeat visit (cached)
- Previously browsed content visible while offline
- Audio playback unaffected by network changes
- No audio content accidentally cached
