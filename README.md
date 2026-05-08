# Unlistened.me — Frontend

Nuxt 3 podcast & music streaming app backed by a **Laravel 11 API** (`api.unlistened.me`). Podcasts via PodcastIndex, music via Jamendo (Creative Commons). Deployed automatically to shared hosting via FTPS on every push to `main` as a fully static build (`npx nuxi generate`).

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Nuxt 3 (static-first, Nitro `static` preset) | 3.21.x |
| View layer | Vue 3 (`<script setup>` Composition API) | 3.5.x |
| Build | `npx nuxi generate` (Vite under the hood) | — |
| Styling | Tailwind CSS 3 + `@tailwindcss/forms` (via `@nuxtjs/tailwindcss`) | 3.4.x |
| UI components | Headless UI, Heroicons (ESM-per-icon imports for SSR safety) | 1.7.x / 2.1.x |
| HTTP | Axios (centralized instance in `src/services/api.js`; `baseURL` set at boot by `plugins/00.api-config.ts` from `runtimeConfig.public.apiBaseUrl`) | 1.15.x |
| Auth | Laravel Sanctum (cookie-backed session, client-side bootstrap via Nuxt plugin) | — |
| State | Pinia (auto-imported via `@pinia/nuxt`, `storesDirs: ['./src/stores/**']`) — authStore, messageStore, playerStore, historyStore, queueStore, musicLibraryStore | 2.1.x · `@pinia/nuxt` 0.5.x |
| State persistence | Player/queue → sessionStorage · Music cache → localStorage · History → localStorage · `authStore` intentionally re-validated at bootstrap | 3.2.x |
| Routing | Nuxt file-based routing (`pages/`) + route middleware (`middleware/`) | — |
| SEO | Registry-driven (`utils/seo/pagesRegistry.ts`) + `composables/usePageSeo.ts` for static pages; `useSeoMeta`+`useHead` for dynamic detail pages | — |
| Sitemap | `@nuxtjs/sitemap` | 8.0.x |
| OG images | PHP GD script (`scripts/generate-og-images.php`) run at build time | — |
| Charts | Chart.js + vue-chartjs (admin dashboard) | 4.4.x |
| Drag & Drop | vuedraggable 4 (registered as Nuxt client plugin) | 4.1.x |
| Testing | Vitest + @vue/test-utils (store-level unit tests) | — |

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: nuxi generate → FTPS deploy on push to main
├── app.vue                         # Root: <NuxtLayout> + <NuxtPage> + client-only player/cookie banner
├── nuxt.config.ts                  # Modules, prerender, route rules, runtime config, '@' → ./src alias
├── pages/                          # File-based routes (Nuxt)
│   ├── index.vue                   # Home: rotated trending previews
│   ├── podcasts/                   # Podcasts hub
│   ├── music/                      # Music hub, albums, singles, favorites, playlists
│   ├── feed/[id].vue               # Podcast detail (client-fetch static shell)
│   ├── episode/[id].vue            # Episode detail (client-fetch static shell)
│   ├── music/album/[id].vue        # Album detail (client-fetch static shell)
│   ├── categories/index.vue        # Browse podcast categories + music genres
│   ├── categories/[slug].vue       # Deep-linkable per-category podcast page (slug = "<id>-<kebab-name>")
│   ├── search-results.vue          # Unified podcast/music search (noindex)
│   ├── now-playing.vue             # Full-screen player
│   ├── login.vue | signup.vue | forgot_password.vue | reset_password/[token].vue
│   ├── favourites.vue | bookmarks.vue | settings.vue | dashboard.vue
│   ├── about.vue | documentation.vue | terms.vue | privacy.vue
│   ├── forbidden.vue | [...path].vue  # 403 and catch-all 404
├── layouts/
│   └── default.vue                 # App shell: sidebar, search bar, slot, footer
├── middleware/
│   ├── auth.ts                     # Auth-required routes
│   ├── admin.ts                    # Admin-only routes
│   └── guest.ts                    # Guest-only redirect for login/signup
├── components/
│   └── NavigationView.vue          # Top-level nav: sidebar, header, search bar, mobile drawer
├── composables/
│   ├── usePageSeo.ts               # Consumes pagesRegistry, wires useHead (title, meta, OG, Twitter, robots, JSON-LD)
│   └── useAuthIntent.ts            # redirectToLogin({ intent, message }) + consumeAuthIntent(query) + buildIntent helper for action replay after login
├── config/
│   └── static-routes.js            # Static-route metadata (path/seoKey/prerender/changefreq/priority/title/description) — feeds the sitemap
├── plugins/
│   ├── 00.api-config.ts            # Wires runtimeConfig.public.apiBaseUrl into the Axios instance at boot
│   ├── 01.pinia.ts                 # Registers pinia-plugin-persistedstate on the Pinia instance created by @pinia/nuxt
│   ├── 02.auth-bootstrap.client.ts # Validates Sanctum session at app start; loads history if logged in
│   ├── draggable.client.ts         # vuedraggable global registration
│   └── gtm.client.ts               # Google Tag Manager + Consent Mode v2 (id GTM-MF5TLTDF), SPA page_view dispatch
├── utils/
│   ├── seo/
│   │   └── pagesRegistry.ts        # Single source of truth for static-page SEO (title/desc/OG/JSON-LD/robots)
│   └── slugify.ts                  # kebabCase / categorySlug / parseCategorySlug for URL-segment generation (e.g. /categories/12-comedy)
├── public/
│   ├── .htaccess                   # SPA fallback rules for Apache shared hosting
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml                 # Written by @nuxtjs/sitemap at generate time
│   └── images/
├── scripts/
│   └── generate-og-images.php      # PHP GD OG image generator (runs in CI before generate)
├── src/                            # Active domain modules, referenced via the '@' alias declared in nuxt.config.ts
│   ├── assets/
│   │   ├── base.css                # Global CSS (dark theme base, shimmer)
│   │   └── main.css
│   ├── components/
│   │   ├── OffcanvasPlayer.vue     # Unified sticky bottom player (podcast + music)
│   │   ├── CookieConsent.vue | Footer.vue | PageHero.vue | EmptyState.vue
│   │   ├── SkeletonCard.vue | SkeletonRow.vue
│   │   ├── music/                  # LicenseBadge, FavoriteMusicButton, AddToPlaylistMenu, MusicTrackRow
│   │   └── podcast/                # PodcastCardItem
│   ├── composables/
│   │   ├── useSidebarState.js | usePagination.js
│   │   └── useMusicPlayback.js | useMusicGenres.js
│   ├── stores/
│   │   ├── authStore.js            # Sanctum-backed, not restored from storage; clears musicLibraryStore on logout
│   │   ├── messageStore.js         # Global toasts with auto-clear
│   │   ├── playerStore.js          # Session-scoped player state (composition-style + persistedstate via getSafeSessionStorage)
│   │   ├── queueStore.js           # Playback queue (session)
│   │   ├── historyStore.js         # Local listening history + resume (localStorage 'unlistened.history.v1', max 50)
│   │   ├── musicLibraryStore.js    # Music favorites/playlists cache
│   │   └── __tests__/              # Vitest specs (auth, history, queue)
│   ├── services/
│   │   ├── api.js                  # Axios instance, withCredentials/withXSRFToken, 401 interceptor (skipAuthRedirect supported); baseURL set by plugins/00.api-config.ts
│   │   ├── sessionHandler.js       # registerUnauthorizedHandler / handleUnauthorized
│   │   ├── podcastService.js | musicService.js
│   │   ├── historyService.js       # Listening-history API client (upsert, fetch list)
│   │   └── authService.js | userService.js | adminService.js
│   └── utils/
│       └── formatTime.js | text.js | musicTrackPayload.js | browserStorage.js
├── strategy/                       # Product/roadmap docs (not shipped)
├── .env.production                 # NUXT_PUBLIC_API_BASE_URL=https://api.unlistened.me/
├── tailwind.config.js              # Scans pages/, layouts/, components/, middleware/, plugins/, utils/, src/
├── vitest.config.js                # Standalone Vitest setup (vue plugin + @/ and ~/ aliases)
└── package.json
```

Note on the `src/` layout: the Nuxt migration kept stable domain code (components, stores, services, composables, utils) under `src/` and wired it through the `@` alias declared in `nuxt.config.ts`. New Nuxt-specific code (pages, layouts, middleware, plugins, the SEO registry) lives at the project root. All imports use the `@/...` alias.

Stores under `src/stores/` are auto-imported via `@pinia/nuxt` (`pinia.storesDirs: ['./src/stores/**']` in `nuxt.config.ts`), so pages/components/middleware/plugins can use `useAuthStore()`, `usePlayerStore()`, etc. without explicit `import` statements.

---

## Rendering Strategy

Fully static generation (`npx nuxi generate`). Output is written to `.output/public/` and deployed as plain files.

**Prerendered routes** declared in `routeRules` (single source of truth):
- Static content pages: `/`, `/podcasts`, `/music`, `/music/albums`, `/music/singles`, `/categories`, `/about`, `/documentation`, `/terms`, `/privacy`
- Dynamic-route shells (used by `.htaccess` rewrites for bot OG fallback): `/feed`, `/episode`, `/music/album`
- The `nitro.prerender.routes` array was removed — `routeRules: { prerender: true }` is the canonical declaration

**SSG-baked data** (resolved at build time via `useAsyncData`, hydrated in the static HTML):
- `pages/podcasts/index.vue` bakes `getTrending()` + `getCategories()` into the prerendered output, so bots and first-paint visitors see hydrated podcast cards instead of skeletons (the `/podcasts` HTML is ~115 KB with the feeds inlined)

**Client-only data** (`useAsyncData(..., { server: false })`):
- `pages/index.vue` and `pages/music/index.vue` keep their fetches client-side because they apply a `getDailySeed()` shuffle that must be computed at runtime — SSG would freeze the rotation to the build date
- The `useAsyncData` shape (vs. the older `onMounted` pattern) gives back-navigation caching and reactive `pending`/`error` refs for free

**Client-driven routes** (static shell, client fetch):
- `/feed/[id]`, `/episode/[id]`, `/music/album/[id]`, `/categories/[slug]` (all use `dynamicContentMode: 'client-fetch-static-shell'`)
- all `/music/**` routes are configured `ssr: false` to avoid SSR-only code paths
- auth pages, library, settings, dashboard — rely on the Sanctum client bootstrap

**Sitemap**: generated by `@nuxtjs/sitemap` during `nuxi generate`. `/forbidden`, `/dashboard`, `/settings` are excluded.

---

## SEO — Registry-Driven

All static-page metadata lives in a single file:

- `utils/seo/pagesRegistry.ts` — typed registry keyed by page name. Each entry declares `title`, `description`, optional `ogImage`, `keywords`, `structuredData` (JSON-LD), `faqSchema`, and `robots`.
- `composables/usePageSeo.ts` — reads the registry and wires `useHead` for title, description, robots, Open Graph, Twitter Card, and JSON-LD.

Static pages consume the registry:

```ts
usePageSeo('home')          // pages/index.vue
usePageSeo('documentation') // pages/documentation.vue
usePageSeo('dashboard')     // noindex,nofollow entry
```

Dynamic detail pages (`feed/[id]`, `episode/[id]`, `music/album/[id]`, `search-results`) bypass the registry and use Nuxt's built-in `useSeoMeta` + `useHead` reactively, deriving title/description/OG/canonical from fetched data, with `noindex,nofollow` fallbacks for not-found/error states.

Private/authenticated surfaces (`dashboard`, `settings`, `bookmarks`, `favourites`, `music/favorites`, `music/playlists`, `now-playing`, `forbidden`, `404`) are declared `noindex,nofollow` at the registry level.

OG images are generated at build time by `scripts/generate-og-images.php` (PHP GD) and served from `public/images/og/...`.

---

## Audio Player

`src/components/OffcanvasPlayer.vue` is a unified sticky bottom bar for both podcasts and music, mounted inside `<ClientOnly>` in `app.vue`. It uses the HTML5 `<audio>` element directly. Global state: `playerStore.js` (current track, `isPlaying`, `togglePlay` signal) and `queueStore.js` (next/prev, auto-advance).

Key features:
- Unified podcast + music playback (`contentType` discriminator)
- MediaSession API for OS-level lockscreen controls
- Screen-off continuity (`x-webkit-airplay`, eager `playbackState`, `visibilitychange` resume)
- Responsive mobile layout (controls row on top, cover+info below)
- Draggable seek bar with touch support
- Playback speed (0.5x–2x, podcasts only), ±15s / ±30s skip
- CC license badge for Jamendo tracks
- Listening progress written to `historyStore` every 5s; resume position restored on next play
- Sidebar-aware layout shift

## Listening History

`src/stores/historyStore.js` persists all played episodes to `localStorage`:
- `recordPlay(episode)` / `updateProgress(id, t, d)` / `getProgress(id)` / `markCompleted(id)`
- `continueListening` computed (progress > 5s and not completed) — surfaced on Home and Podcasts
- `continueListeningMusic` filters the same set to music tracks only — surfaced on `/music` and `/music/singles`. Both flows use the same `recordPlay` / `updateProgress` calls dispatched by `OffcanvasPlayer.vue` (the `contentType` discriminator distinguishes podcast vs music)

## Auth Intent Replay

Auth-gated actions (favorite a podcast, bookmark an episode) preserve user intent across the login flow:

- A logged-out click calls `redirectToLogin({ message, intent })` from `composables/useAuthIntent.ts`.
- The user is sent to `/login?redirect=<path>&intent=<encoded>` with a contextual toast ("Sign in to save this podcast — we'll add it after you log in.").
- After successful login, `pages/login.vue` calls `consumeAuthIntent(route.query)` which dispatches the intent through a small handler registry (`fav` → `podcastService.addFavorite`, `bm` → `podcastService.addBookmark`) and then navigates to `redirect`.
- Build intents with `buildIntent('fav', feedId, feedTitle)` (URL-encodes each arg).
- The `auth` and `admin` middleware also pass `?redirect=<original path>` so private-route bounces return the user to where they were after login.
- Music actions (favorite track, add to playlist) only preserve the redirect path, not the action — replay would require refetching the full track, which isn't worth the complexity.

## Search Autocomplete

The sidebar search bar (`components/NavigationView.vue`) suggests results inline as the user types:

- 300 ms debounce on the input; minimum 2 chars before fetching.
- Podcasts → `podcastService.searchByTitle(q)` (top 6 feeds, links to `/feed/:id`).
- Music → `musicService.search(q)` (top 6 tracks, links to `/music/album/:album_id` when available).
- Out-of-order responses are dropped via a sequence guard.
- Esc closes the dropdown; blur closes after a 150 ms delay so item clicks register first.
- A "See all results for …" footer links to the existing `/search-results` page for full results.

## Notifications / Messages

`src/stores/messageStore.js`: `notify(message, type, duration)` shows a toast and auto-clears after `duration` ms (`'info' | 'success' | 'error'`). `clearMessage()` cancels it.

## Analytics / Consent

`plugins/gtm.client.ts` injects the GTM container (`GTM-MF5TLTDF`) and configures **Google Consent Mode v2**:
- On first visit, every non-essential storage type is denied with a 500 ms `wait_for_update` so the cookie banner can collect a decision before tags fire.
- Returning visitors with a stored consent in `localStorage['unlistened_cookie_consent_v1']` see their decision honored at boot.
- A SPA `page_view` event is dispatched on every route change after the first (the initial view is covered by GA4's auto `send_page_view`), with `document.title` resolved on `nextTick` so `useHead` has applied the new title.

The cookie banner is `src/components/CookieConsent.vue` and is mounted from `app.vue` inside `<ClientOnly>`.

## API / Auth

All HTTP calls go through `src/services/api.js` (centralized Axios instance, `withCredentials: true`, `withXSRFToken: true`). Auth uses Laravel Sanctum session cookies.

The Axios `baseURL` is set at boot by `plugins/00.api-config.ts`, which reads `runtimeConfig.public.apiBaseUrl` (driven by the `NUXT_PUBLIC_API_BASE_URL` env var, with a fallback to `https://api.unlistened.me`). Set this in your `.env` to point local dev at a local Laravel backend.

At app boot, `plugins/02.auth-bootstrap.client.ts` validates the current user against the backend before protected routes evaluate, and (if authenticated) calls `historyStore.loadFromAPI()` to hydrate listening history from the backend.

Unauthorized handling is registered once via `src/services/sessionHandler.js`. A 401 response clears auth state, resets protected caches, and redirects to `/login` — unless the originating request set `skipAuthRedirect: true` on its Axios config, in which case the 401 is surfaced to the caller without a redirect. The middleware short-circuits if the user is already on `/login`, `/signup`, `/forgot_password`, or `/reset_password`.

## Music Discovery / Genres

`src/composables/useMusicGenres.js` derives Jamendo genres on the frontend from `musicinfo.tags.genres` inside `/api/music/trending`:
- loads a trending pool, extracts and deduplicates genre tags
- normalizes labels (`hiphop` → `Hip Hop`, `newage` → `New Age`, `soundtrack` → `Cinematic`)
- prepends a `Trending` pseudo-filter where needed
- falls back to a static safe list if Jamendo returns no usable tags

`MusicHomeView` equivalents, the sidebar search, and `/categories` all consume the same source so the music filter stays aligned.

## Music Information Architecture

- `/music` (`pages/music/index.vue`) — overview with previews for Trending albums and Trending songs
- `/music/albums` — full album browser (dedicated backend endpoint)
- `/music/singles` — full track browser with genre filters and paginated Jamendo discovery
- `/music/album/[id]` — album detail with `Play album`, `Download album` when available, `Open on Jamendo`, CC license badge

Album/singles listings persist their loaded UI state in `sessionStorage`, so back-navigation restores filter/search and already-loaded batches.

## Rotated Home Previews

Home and MusicHome fetch larger pools, apply a deterministic day-based shuffle, and show rotated subsets so the surface stays stable within a day and changes across days. MusicSingles owns the full paginated song browsing experience; MusicHome remains an overview surface.

## Design System

Full dark theme. Tokens applied via Tailwind throughout:

| Token | Class |
|---|---|
| Page background | `bg-gray-950` |
| Cards / sidebar | `bg-gray-900` |
| Elevated | `bg-gray-800` |
| Primary action | `bg-indigo-600` / hover `bg-indigo-500` |
| Favourites accent | `bg-pink-500` / hover `bg-pink-400` |
| Heading text | `text-white` |
| Body / meta text | `text-gray-400` |
| Card style | `rounded-2xl border border-gray-800 bg-gray-900/50 p-5` |
| Shimmer animation | `animate-shimmer` (defined in `src/assets/base.css`) |

## Navigation

The sidebar lives in the default layout and is organized in three sections:
- **Discover** — Home, Podcasts, Music
- **Library** — Podcasts favourites, Episode bookmarks, Music favorites, Music playlists
- **More** — Documentation

The search bar features a podcast/music toggle that switches both the search target and the filter popover (podcast categories vs. music genres).

## Reusable Composables

| Composable | Purpose |
|---|---|
| `usePageSeo(key)` | Reads `pagesRegistry` and wires head/meta/OG/JSON-LD/robots for a static page |
| `usePagination(itemsRef, initialPageSize)` | `visibleItems`, `hasMore`, `loadMore()`, `reset()` |
| `useMusicPlayback(tracksRef, toPlayerPayload)` | `playTrack()`, `togglePlay()`, `isPlaying()`, `playAll()` |
| `useMusicGenres(options)` | Shared music genre source with normalization and safe fallback |
| `useSidebarState()` | Sidebar collapsed/expanded state for responsive layout |

---

## Backend (Laravel REST API)

| Aspect | Detail |
|---|---|
| Framework | Laravel 11 / PHP 8.2+ |
| Auth | Laravel Sanctum (cookie-backed session auth) |
| External data | PodcastIndex.org API (proxied — all podcast data) · Jamendo (music) |
| Database | MySQL — users, favorites, bookmarks, plays, downloads, faqs |
| Models | User, Favorite, Bookmark, Play, Download, Faq, Podcast |
| Mail | Welcome, delete account, forgot password, FAQ notification |

### Main API endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/login` | No | Login → starts Sanctum session |
| POST | `/api/register` | No | Registration |
| POST | `/api/logout` | No | Logout |
| GET | `/api/user` | Sanctum | Current authenticated user |
| GET | `/api/index` | No | Trending podcasts (PodcastIndex) |
| GET | `/api/feed_info/:id` | No | Podcast metadata |
| GET | `/api/search_feed/:id` | No | Episodes for a podcast |
| GET | `/api/search_episode/:id` | No | Single episode detail |
| GET | `/api/search-feed-by-title/:title` | No | Search podcasts by title |
| GET | `/api/feed-cat` | No | All categories |
| GET | `/api/search-feeds-by-cat/:cat` | No | Podcasts in a category |
| GET | `/api/user-favorites` | Sanctum | User's saved podcasts |
| POST | `/api/add-favorite` | Sanctum | Save podcast |
| POST | `/api/delete-favorite` | Sanctum | Remove podcast from favourites |
| POST | `/api/favorites/:id/update-section` | Sanctum | Move favourite to section |
| GET | `/api/user-bookmarks` | Sanctum | User's bookmarked episodes |
| POST | `/api/add-bookmark` | Sanctum | Bookmark episode |
| POST | `/api/delete-bookmark` | Sanctum | Remove bookmark |
| POST | `/api/bookmarks/:id/update-section` | Sanctum | Move bookmark to section |
| POST | `/api/add_play_click` | Sanctum | Track episode play |
| POST | `/api/add_download_click` | Sanctum | Track episode download |
| GET | `/api/get_stats` | Admin | Dashboard statistics |
| GET | `/api/users` | Admin | User list |
| GET | `/api/music/trending` | No | Trending Jamendo tracks |
| GET | `/api/music/search` | No | Search music by query/genre |
| GET | `/api/music/albums` | No | Album listing/search |
| GET | `/api/music/track/:id` | No | Single track detail |
| GET | `/api/music/similar/:id` | No | Similar tracks |
| GET | `/api/music/album/:id` | No | Album detail with tracklist fallback on backend |
| GET | `/api/music/artist/:id` | No | Artist detail |
| GET | `/api/music/radios` | No | Jamendo radio stations (currently unused by the frontend for genre discovery) |
| GET | `/api/music/favorites` | Sanctum | User's liked music tracks |
| POST | `/api/music/favorites` | Sanctum | Like a track |
| DELETE | `/api/music/favorites/:id` | Sanctum | Unlike a track |
| GET | `/api/music/favorites/check/:id` | Sanctum | Check if track is liked |
| GET | `/api/music/playlists` | Sanctum | User's playlists |
| POST | `/api/music/playlists` | Sanctum | Create playlist |
| GET | `/api/music/playlists/:id` | Sanctum | Playlist detail + tracks |
| PUT | `/api/music/playlists/:id` | Sanctum | Update playlist |
| DELETE | `/api/music/playlists/:id` | Sanctum | Delete playlist |
| POST | `/api/music/playlists/:id/tracks` | Sanctum | Add track to playlist |
| DELETE | `/api/music/playlists/:id/tracks/:tid` | Sanctum | Remove track from playlist |
| PUT | `/api/music/playlists/:id/reorder` | Sanctum | Reorder playlist tracks |

---

## CI/CD — GitHub Actions

**Trigger:** push to `main`

**Pipeline** (`.github/workflows/deploy.yml`):
1. Checkout code
2. Set up Node 22
3. `npm ci`
4. Set up PHP 8.2 + GD
5. `php scripts/generate-og-images.php` — regenerates OG assets
6. `npx nuxi generate` — produces `.output/public/` (env: `NUXT_PUBLIC_API_BASE_URL` from the `VITE_BASE_URL` secret)
7. Copy `public/.htaccess` and `public/robots.txt` into `.output/public/`
8. Verify `.htaccess` is in place
9. Deploy `.output/public/` via FTPS (`SamKirkland/FTP-Deploy-Action@v4.3.5`, `dangerous-clean-slate: true`)

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `FTP_SERVER` | Hostname of the FTP server |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |
| `FTP_SERVER_DIR` | Remote directory path to deploy into |
| `VITE_BASE_URL` | API base URL (wired into `NUXT_PUBLIC_API_BASE_URL` at build time — secret name kept from pre-migration for backwards compatibility) |

---

## Local Development

```sh
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production static build → .output/public/
npm run build

# Preview the generated static output
npm run preview

# Unit tests (Vitest)
npm run test:unit
```

**Environment:**
- Local dev: create a `.env` with `NUXT_PUBLIC_API_BASE_URL=http://localhost/` (or your Laravel API URL)
- Production: `.env.production` sets `NUXT_PUBLIC_API_BASE_URL=https://api.unlistened.me/` (CI overrides via the `VITE_BASE_URL` secret)

---

## Pending Cleanup

Items known to be short-term tech debt. Roughly ordered by impact / risk:

**Considered, not yet done:**
- Convert services from `.js` to `.ts` for richer types in pages
- `definePageMeta({ dynamicContentMode: 'client-fetch-static-shell' })` is a custom (non-Nuxt) flag used in feed/episode/album/category pages — document or drop

**Resolved (kept here as a recent-changelog):**
- Removed pre-Nuxt SPA artifacts: `src/views/` (30 files), `src/App.vue`, `src/main.js`, `src/router/`, `src/stores/counter.js`, `src/components/icons/Icon*.vue`
- Removed orphan `composables/useStaticPageSeo.ts` + `utils/seo/staticPagesRegistry.ts`
- `src/services/api.js` `baseURL` now read from `runtimeConfig.public.apiBaseUrl` via `plugins/00.api-config.ts`
- Unified import alias on `@/...` across the codebase (no more `~/src/...`)
- Adopted `@pinia/nuxt` (`storesDirs: ['./src/stores/**']`); manual `useXStore` imports removed from 26 pages, 1 component, 3 middleware, 1 plugin
- All direct `sessionStorage`/`localStorage` calls in production code now go through `src/utils/browserStorage.js` (SSR-safe)
- Production `console.error` / `console.warn` calls removed from pages, components, stores; the one remaining `console.warn` in `composables/usePageSeo.ts` is guarded by `import.meta.dev`
- Login intent-preservation: auth-gated favorite/bookmark actions now redirect to `/login?redirect=…&intent=…` and replay on success (see Auth Intent Replay section)
- Deep-linkable category pages: `/categories/<id>-<kebab-name>` replaces the previous `/search-results?s=…` flow; categories list, podcasts hub, and sidebar filter popover all link to the new URL
- Sidebar search now offers debounced autocomplete suggestions (podcasts and music) with kind-aware deep links
- `pages/podcasts/index.vue` migrated to `useAsyncData` — trending feeds and categories are now baked into the prerendered HTML at build time
- `pages/index.vue` and `pages/music/index.vue` migrated to `useAsyncData(..., { server: false })` — same reactive shape, but stays client-only to preserve daily rotation
- Consolidated `nitro.prerender.routes` into `routeRules` (single source of truth)

---

## Improvement Roadmap

See [`strategy/improvement-strategy.md`](strategy/improvement-strategy.md) for the full phased plan.

| Phase | Scope | Status |
|---|---|---|
| 1 | Audio player rewrite, API service layer, script setup migration | **DONE** |
| 2 | Full dark mode, skeleton loading, empty states | **DONE** |
| 2.5 | Page layout harmonization (all views) | **DONE** |
| 3 | Inline category pills, search autocomplete, card redesign | TODO |
| 4 | Mobile bottom nav, auth page polish | TODO |
| 5 | Listening history UI, episode queue | **PARTIAL** (queue store + auto-advance done) |
| 6 | PWA (see [`strategy/pwa-strategy.md`](strategy/pwa-strategy.md)), performance | TODO |
| 7 | Jamendo music integration (see [`strategy/jamendo-strategy.md`](strategy/jamendo-strategy.md)) | **DONE** |
| 8 | Capacitor mobile app (iOS + Android) | TODO |
| — | Nuxt static-first migration + registry-driven SEO | **DONE** |
