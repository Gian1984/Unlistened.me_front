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
| HTTP | Axios (centralized instance in `src/services/api.js`) | 1.15.x |
| Auth | Laravel Sanctum (cookie-backed session, client-side bootstrap via Nuxt plugin) | — |
| State | Pinia — authStore, messageStore, playerStore, historyStore, queueStore, musicLibraryStore | 2.1.x |
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
│   ├── search-results.vue          # Unified podcast/music search (noindex)
│   ├── now-playing.vue             # Full-screen player
│   ├── login.vue | signup.vue | forgot_password.vue | reset_password/[token].vue
│   ├── favourites.vue | bookmarks.vue | settings.vue | dashboard.vue
│   ├── categories.vue | about.vue | documentation.vue | terms.vue | privacy.vue
│   ├── forbidden.vue | [...path].vue  # 403 and catch-all 404
├── layouts/
│   └── default.vue                 # App shell: sidebar, search bar, slot, footer
├── middleware/
│   ├── auth.ts                     # Auth-required routes
│   ├── admin.ts                    # Admin-only routes
│   └── guest.ts                    # Guest-only redirect for login/signup
├── composables/
│   └── usePageSeo.ts               # Consumes pagesRegistry, wires useHead (title, meta, OG, Twitter, robots, JSON-LD)
├── plugins/
│   ├── 01.pinia.ts                 # Pinia setup with persistedstate
│   ├── 02.auth-bootstrap.client.ts # Validates Sanctum session at app start
│   └── draggable.client.ts         # vuedraggable global registration
├── utils/
│   └── seo/
│       └── pagesRegistry.ts        # Single source of truth for static-page SEO (title/desc/OG/JSON-LD/robots)
├── public/
│   ├── .htaccess                   # SPA fallback rules for Apache shared hosting
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml                 # Written by @nuxtjs/sitemap at generate time
│   └── images/
├── scripts/
│   └── generate-og-images.php      # PHP GD OG image generator (runs in CI before generate)
├── src/                            # Legacy-but-active modules, referenced via '@' alias
│   ├── assets/
│   │   ├── base.css                # Global CSS (dark theme base, shimmer)
│   │   └── main.css
│   ├── components/
│   │   ├── OffcanvasPlayer.vue     # Unified sticky bottom player (podcast + music)
│   │   ├── CookieConsent.vue | Footer.vue | PageHero.vue | EmptyState.vue
│   │   ├── SkeletonCard.vue | SkeletonRow.vue
│   │   ├── icons/
│   │   ├── music/                  # LicenseBadge, FavoriteMusicButton, AddToPlaylistMenu, MusicTrackRow
│   │   └── podcast/                # PodcastCardItem
│   ├── composables/
│   │   ├── useSidebarState.js | usePagination.js
│   │   └── useMusicPlayback.js | useMusicGenres.js
│   ├── stores/
│   │   ├── authStore.js            # Sanctum-backed, not restored from storage
│   │   ├── messageStore.js         # Global toasts with auto-clear
│   │   ├── playerStore.js          # Session-scoped player state
│   │   ├── queueStore.js           # Playback queue (session)
│   │   ├── historyStore.js         # Local listening history + resume
│   │   ├── musicLibraryStore.js    # Music favorites/playlists cache
│   │   └── __tests__/              # Vitest specs (auth, history, queue)
│   ├── services/
│   │   ├── api.js                  # Axios instance: baseURL from runtimeConfig, CSRF, 401 interceptor
│   │   ├── sessionHandler.js
│   │   ├── podcastService.js | musicService.js
│   │   ├── authService.js | userService.js | adminService.js
│   └── utils/
│       ├── formatTime.js | text.js | musicTrackPayload.js | browserStorage.js
├── strategy/                       # Product/roadmap docs (not shipped)
├── .env.production                 # NUXT_PUBLIC_API_BASE_URL=https://api.unlistened.me/
├── tailwind.config.js              # Scans pages/, layouts/, components/, middleware/, plugins/, utils/, src/
├── vitest.config.js                # Standalone Vitest setup (vue plugin + @/ and ~/ aliases)
└── package.json
```

Note on the `src/` layout: the Nuxt migration kept stable domain code (components, stores, services, composables, utils) under `src/` and wired it through the `@` alias declared in `nuxt.config.ts`. New Nuxt-specific code (pages, layouts, middleware, plugins, the SEO registry) lives at the project root.

---

## Rendering Strategy

Fully static generation (`npx nuxi generate`). Output is written to `.output/public/` and deployed as plain files.

**Prerendered routes** (see `nuxt.config.ts` `nitro.prerender.routes` + `routeRules`):
- `/`, `/podcasts`, `/music`, `/music/albums`, `/music/singles`, `/categories`, `/about`, `/documentation`, `/terms`, `/privacy`

**Client-driven routes** (static shell, client fetch):
- `/feed/[id]`, `/episode/[id]`, `/music/album/[id]`
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
- `continueListeningMusic` is exposed but resume is currently saved for podcasts only

## Notifications / Messages

`src/stores/messageStore.js`: `notify(message, type, duration)` shows a toast and auto-clears after `duration` ms (`'info' | 'success' | 'error'`). `clearMessage()` cancels it.

## API / Auth

All HTTP calls go through `src/services/api.js` (centralized Axios instance, `withCredentials: true`, `withXSRFToken: true`). The base URL comes from `runtimeConfig.public.apiBaseUrl` (env var `NUXT_PUBLIC_API_BASE_URL`). Auth uses Laravel Sanctum session cookies.

At app boot, `plugins/02.auth-bootstrap.client.ts` validates the current user against the backend before protected routes evaluate. Unauthorized handling is registered once via `src/services/sessionHandler.js` so a 401 clears auth state, resets protected caches, and redirects to `/login`.

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
2. Set up Node 20
3. `npm ci`
4. Set up PHP 8.2 + GD
5. `php scripts/generate-og-images.php` — regenerates OG assets
6. `npx nuxi generate` — produces `.output/public/` (env: `NUXT_PUBLIC_API_BASE_URL`)
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
