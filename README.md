# Unlistened.me — Frontend

Vue 3 podcast & music streaming web app backed by a **Laravel 11 API** (`api.unlistened.me`). Podcasts via PodcastIndex, music via Jamendo (Creative Commons). Deployed automatically to shared hosting via FTPS on every push to `main`.

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Vue 3 (`<script setup>` Composition API) | 3.4.21 |
| Build | Vite + post-build `.htaccess` copy | 5.4.21 |
| Styling | Tailwind CSS 3 + `@tailwindcss/forms` | 3.4.1 |
| UI components | Headless UI, Heroicons | 1.7.19 / 2.1.1 |
| HTTP | Axios (centralized instance in `src/services/api.js`) | 1.15.0 |
| Auth | Laravel Sanctum (cookie-backed session, backend-validated bootstrap) | 4.0 |
| State | Pinia — authStore, messageStore, playerStore, historyStore, queueStore, musicLibraryStore | 2.1.7 |
| State persistence | Mixed strategy: selected Pinia store persistence + manual localStorage for listening history | 3.2.1 |
| Routing | Vue Router 4 (static route imports + auth guards + SEO hooks) | 4.3.0 |
| Charts | Chart.js + vue-chartjs (admin dashboard) | 4.4.3 |
| Drag & Drop | vuedraggable 4 (favourites & bookmarks) | 4.1.0 |
| Testing | Vitest + @vue/test-utils (basic store-level unit tests active) | 1.6.1 / 2.4.4 |

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: build → FTPS deploy on push to main
├── public/
│   ├── .htaccess                   # Search/social bot proxy → crawler.php, then SPA fallback
│   ├── crawler.php                 # Bot-only HTML responder that reads generated static SEO JSON, plus dynamic feed/episode metadata
│   ├── robots.txt                  # Crawl rules for private/internal routes + sitemap declaration
│   ├── seo-static.json             # Generated static SEO payload consumed by crawler.php
│   └── images/                     # Static assets (logo)
├── src/
│   ├── App.vue                     # Root: <NavigationView> + <OffcanvasPlayer> + <CookieConsent>
│   ├── main.js                     # App bootstrap (Pinia, Router)
│   │
│   ├── router/
│   │   └── index.js                # 25 routes (incl. /podcasts + 4 music), with SEO meta guards
│   │
│   ├── services/                   # API layer (all HTTP calls go here)
│   │   ├── api.js                  # Axios instance: baseURL, CSRF, 401 interceptor
│   │   ├── sessionHandler.js       # Centralized unauthorized-session handler registration
│   │   ├── podcastService.js       # Podcast + episode endpoints
│   │   ├── musicService.js         # Jamendo music endpoints (tracks, favorites, playlists)
│   │   ├── authService.js          # Login, logout, register, password reset, language
│   │   ├── userService.js          # Profile, settings, contact form, delete account
│   │   └── adminService.js         # Dashboard stats, user management
│   │
│   ├── stores/                     # Pinia stores
│   │   ├── authStore.js            # Auth state bootstrapped from Sanctum/current-user endpoint
│   │   ├── messageStore.js         # Global toast/notification messages (auto-clear)
│   │   ├── playerStore.js          # Audio player state (sessionStorage)
│   │   ├── historyStore.js         # Listening history + resume progress (localStorage)
│   │   ├── queueStore.js           # Playback queue (sessionStorage)
│   │   └── musicLibraryStore.js    # Music favorites/playlists cache
│   │
│   ├── composables/
│   │   ├── useSidebarState.js      # Shared sidebar collapsed/expanded state
│   │   ├── usePagination.js        # Reusable pagination (visible items + load more)
│   │   ├── useMusicPlayback.js     # Reusable music play/pause/queue logic
│   │   └── useMusicGenres.js       # Derives music genres from Jamendo trending track tags
│   │
│   ├── utils/
│   │   ├── formatTime.js         # formatDuration() + formatTime() utilities
│   │   ├── text.js             # stripHtmlTags() utility
│   │   └── musicTrackPayload.js  # Shape adapter: normalizes Jamendo data → player format
│   │
│   ├── seo/
│   │   ├── composables/useSeo.js   # SEO composable (sets document.title + meta)
│   │   ├── schemas/                # JSON-LD structured data builders
│   │   └── registry/               # Per-route SEO metadata plus shared static page SEO source
│   │
│   ├── components/
│   │   ├── OffcanvasPlayer.vue     # Unified sticky bottom player (podcasts + music)
│   │   ├── CookieConsent.vue       # GDPR cookie consent banner
│   │   ├── Footer.vue              # App footer
│   │   ├── PageHero.vue            # Shared page header with eyebrow, H1, description, breadcrumb
│   │   ├── EmptyState.vue          # Reusable empty state (icon + title + CTA)
│   │   ├── SkeletonCard.vue        # Shimmer skeleton for podcast cards
│   │   ├── SkeletonRow.vue         # Shimmer skeleton for episode rows
│   │   ├── icons/                  # SVG icon components
│   │   ├── music/                  # Music-specific components
│   │   │   ├── LicenseBadge.vue    # CC license badge display
│   │   │   ├── FavoriteMusicButton.vue  # Heart toggle for music tracks
│   │   │   ├── AddToPlaylistMenu.vue    # Dropdown to add track to playlist
│   │   │   └── MusicTrackRow.vue   # Reusable track row (used in MusicHomeView, etc.)
│   │   └── podcast/
│   │       └── PodcastCardItem.vue # Reusable podcast card (used in PodcastsView, etc.)
│   ├── views/
│   │   ├── NavigationView.vue      # Layout shell: sidebar, dual-mode search bar, <RouterView>
│   │   ├── HomeView.vue            # Combined landing: trending podcasts + rotated music preview
│   │   ├── PodcastsView.vue        # Podcasts hub: trending, categories, continue listening
│   │   ├── CategoriesView.vue      # Podcasts/Music category browser (tabbed, shared dynamic music genres)
│   │   ├── SearchResultView.vue    # Search results (podcasts + music tracks)
│   │   ├── FeedEpisodesView.vue    # Episode list for a single podcast (cover+play overlay)
│   │   ├── SingleEpisodeView.vue   # Single episode detail + play
│   │   ├── FavouritesView.vue      # Saved podcasts (enriched cards with cover + author)
│   │   ├── BookmarksView.vue       # Bookmarked episodes (drag-to-reorder into sections)
│   │   ├── MusicHomeView.vue       # Music: trending tracks from Jamendo (dynamic tag-derived genre filter)
│   │   ├── MusicFavoritesView.vue  # Music: liked songs list
│   │   ├── MusicPlaylistsView.vue  # Music: user playlists grid
│   │   ├── MusicPlaylistDetailView.vue  # Music: single playlist track list (drag reorder)
│   │   ├── LoginView.vue           # Auth: login
│   │   ├── SignUpView.vue          # Auth: registration
│   │   ├── ForgotPasswordView.vue  # Auth: request password reset
│   │   ├── ResetPasswordView.vue   # Auth: set new password
│   │   ├── SettingsView.vue        # User profile, language, contact form, delete account
│   │   ├── DashboardView.vue       # Admin: stats, charts, FAQs, user management
│   │   ├── AboutView.vue           # Static about page
│   │   ├── DocumentationView.vue   # Static docs page
│   │   ├── TermsView.vue           # Static terms page
│   │   ├── PrivacyView.vue         # Privacy policy
│   │   ├── NotFoundView.vue        # 404 error page
│   │   └── ForbiddenView.vue       # 403 error page
│   │
│   └── assets/
│       └── base.css                # Global CSS (dark theme base, shimmer animation, Tailwind imports)
├── scripts/
│   ├── generate-static-seo.js      # Builds public/seo-static.json from shared frontend SEO definitions
│   └── generate-og-images.js       # Generates OG assets used by static pages
│
├── strategy/
│   ├── improvement-strategy.md     # Phased improvement plan (phases 1–7, with status)
│   ├── pwa-strategy.md             # Full PWA implementation plan (manifest, SW, offline, A2HS)
│   └── jamendo-strategy.md         # Jamendo music API integration plan (backend + frontend)
├── .env                            # Local dev: VITE_BASE_URL=http://localhost/
├── .env.production                 # Prod: VITE_BASE_URL=https://api.unlistened.me/
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Key Architecture Decisions

### Audio Player

`OffcanvasPlayer.vue` is a **unified sticky bottom bar** for both podcasts and music (fixed, sidebar-aware). It uses the HTML5 `<audio>` element directly. Global state is managed by `playerStore.js` (current track, `isPlaying`, `togglePlay` signal) and `queueStore.js` (next/prev navigation).

Key features:
- **Unified playback** — plays both podcast episodes and Jamendo music tracks; content type detected via `contentType` field
- **Play/pause sync** — `isPlaying` state mirrored from audio events; views toggle via `toggleSignal` counter pattern
- **Queue navigation** — prev/next track via `queueStore`; auto-advance on track end
- **MediaSession API** — OS-level lockscreen controls (play/pause, seek, skip) on mobile and desktop
- **Screen-off continuity** — `x-webkit-airplay`, eager `playbackState` update, `visibilitychange` auto-resume
- **Responsive mobile layout** — two-row design: controls centered on top, cover + info below (via CSS `flex-col`/`order`)
- **Draggable seek bar** with touch support
- **Playback speed** control (0.5x–2x, podcasts only)
- **Skip ±15s / ±30s** buttons
- **Music metadata** — displays artist name and CC license badge for Jamendo tracks
- **Listening history** — progress saved to `historyStore` every 5 seconds; resume position restored on next play
- Sidebar-aware layout: shifts left offset based on desktop sidebar collapsed state

### Refactor (2025)

Three-phase code consolidation:

| Phase | Changes |
|-------|---------|
| 1 — Utilities | Extracted `formatDuration()`, `formatTime()` → `src/utils/formatTime.js`; `stripHtmlTags()` → `src/utils/text.js`; created `usePagination(items, pageSize)` and `useMusicPlayback(tracks, payloadFn)` composables; enhanced `messageStore.notify(msg, type, duration)` with auto-clear |
| 2 — Components | Created reusable `MusicTrackRow.vue` (`src/components/music/`) and `PodcastCardItem.vue` (`src/components/podcast/`); refactored PodcastsView, MusicHomeView to use them |
| 3 — Persistence | Persist only UX-safe state: `playerStore` → sessionStorage, `queueStore` → sessionStorage, `musicLibraryStore` → cached favorite IDs, `historyStore` → manual localStorage. `authStore` is intentionally not restored from localStorage because Sanctum is the source of truth |

### Listening History

`historyStore.js` tracks all played episodes in `localStorage`:
- `recordPlay(episode)` — logs a new play entry
- `updateProgress(episodeId, currentTime, duration)` — called every 5 seconds during playback
- `getProgress(episodeId)` — returns saved `currentTime` for resume
- `markCompleted(episodeId)` — marks episode as fully listened
- `continueListening` computed — episodes with progress > 5s and not completed (used on HomeView + PodcastsView)
- `continueListeningMusic` computed — music-only subset is available in the store, but the player currently saves resume history only for podcasts

### Notifications / Messages

`messageStore.js` provides global toast/notification display with auto-clear:
- `notify(message, type, duration)` — shows message for `duration` ms, then auto-clears; type = 'info' | 'success' | 'error'
- `clearMessage()` — manually clear the current message

### API / Auth

All HTTP calls go through `src/services/api.js` (centralized Axios instance with `withCredentials: true` + `withXSRFToken: true`). Auth uses Laravel Sanctum session cookies. On app boot, `authStore` validates the current user against the backend before protected routes are allowed through. Unauthorized handling is registered once at bootstrap via `sessionHandler.js`, so a 401 response clears auth-derived state, resets protected user caches, and redirects to `/login` without duplicating that logic across views.

### Music Discovery / Genres

Jamendo music genres are currently derived on the frontend from `musicinfo.tags.genres` inside the `/api/music/trending` payload. The shared `useMusicGenres.js` composable:
- loads a small trending pool
- extracts and deduplicates genre tags
- normalizes raw Jamendo labels for UI display (`hiphop` → `Hip Hop`, `newage` → `New Age`, `soundtrack` → `Cinematic`, etc.)
- prepends a `Trending` pseudo-filter where needed
- falls back to a static safe list if Jamendo returns no usable tags

This approach replaced the earlier plan of relying on `/api/music/radios`, because the current Jamendo/backend setup does not provide a stable enough radios payload for the UI. As a result, `MusicHomeView.vue`, `NavigationView.vue`, and `CategoriesView.vue` all consume the same shared dynamic genre source.

### Music Rotation

The music surfaces no longer render the first Jamendo ranking items unchanged:
- `HomeView.vue` fetches a larger trending pool, applies a deterministic day-based shuffle, and shows a rotated subset so the home music preview is stable within a day but not identical every day
- `MusicHomeView.vue` applies a deterministic shuffle per day, active genre, and batch offset so `Trending now` feels fresher while remaining compatible with the `Show more` pagination flow

### Design System

Full dark theme. Key tokens applied via Tailwind throughout:

| Token | Class |
|---|---|
| Page background | `bg-gray-950` |
| Cards / sidebar | `bg-gray-900` |
| Elevated elements | `bg-gray-800` |
| Primary action | `bg-indigo-600` / hover `bg-indigo-500` |
| Favourites accent | `bg-pink-500` / hover `bg-pink-400` |
| Heading text | `text-white` |
| Body / meta text | `text-gray-400` |
| Card style | `rounded-2xl border border-gray-800 bg-gray-900/50 p-5` |
| Shimmer animation | `animate-shimmer` (defined in `base.css`) |

### Routing

`src/router/index.js` defines 25 routes (including `/podcasts`, `/music`, and `NowPlayingView`). Views are currently imported statically. Navigation guards wait for auth bootstrap before evaluating protected/admin routes. SEO metadata (title, description, og:*) is managed via `src/seo/`.

### SEO and Crawl Control

The app uses a mixed SEO strategy designed for a client rendered SPA:

- `useSeo()` manages reactive title, description, canonical, robots, Open Graph, Twitter Card, and JSON-LD tags on the client
- `src/seo/registry/staticPages.shared.js` is the single source of truth for static page titles, descriptions, images, breadcrumbs, and FAQ content
- `scripts/generate-static-seo.js` turns that shared SEO source into `public/seo-static.json`
- `public/crawler.php` reads `seo-static.json` for static routes and serves stable HTML metadata to social bots and search engine bots, while keeping separate dynamic handling for `/feed/:id` and `/episode/:id`
- the crawler returns real `404` responses with `noindex,nofollow` for invalid feed, episode, and unknown routes instead of falling back to a generic `200` page
- `public/robots.txt` disallows crawl on auth pages, private library pages, admin routes, and internal search results
- `/search-results` is intentionally `noindex,nofollow`
- public feed and episode pages no longer emit temporary `noindex` during loading
- `PageHero.vue` standardizes visible breadcrumb, eyebrow, page title, and description across the main public and library views
- static page registries now include `BreadcrumbList` JSON LD where appropriate
- `DocumentationView.vue`, `PrivacyView.vue`, and `TermsView.vue` expose visible FAQ sections that are mirrored in structured `FAQPage` schema
- `FeedEpisodesView.vue` exposes crawlable episode links and stronger visible context with breadcrumb, podcast metadata, cleaned description, and categories

This setup reduces soft 404 ambiguity, avoids indexing internal or private surfaces, and gives crawlers a stable HTML fallback for dynamic content.

### Navigation

The sidebar (`NavigationView.vue`) is organized into three sections:
- **Discover** — Home, Podcasts, Music
- **Library** — Podcasts favourites, Episode bookmarks, Music favorites, Music playlists
- **More** — Documentation

The search bar features a podcast/music toggle that switches both the search target and the filter popover (podcast categories vs. music genres). Podcast categories come from the API; music genres are derived from shared Jamendo trending tags via `useMusicGenres.js`, so the music filter popover, `/music`, and `/categories` stay aligned. The footer links to Home, Podcasts, Music, Favourites, Bookmarks, Documentation, and About.

### Reusable Composables

| Composable | Purpose |
|---|---|
| `usePagination(itemsRef, initialPageSize)` | Pagination state for list views: returns `visibleItems`, `hasMore`, `loadMore()`, `reset()` |
| `useMusicPlayback(tracksRef, toPlayerPayload)` | Music play/pause/queue logic: `playTrack()`, `togglePlay()`, `isPlaying()`, `playAll()` |
| `useMusicGenres(options)` | Shared music genre source: derive genres from Jamendo trending tags, normalize labels, cache results, fallback safely |
| `useSidebarState()` | Sidebar collapsed/expanded state for responsive layout |

---

## Backend (Laravel REST API)

Repo: `/Users/gianlucainsideweb/Projects/Unlistened.me_rest` (local clone may be behind the VPS — some changes have been applied live via SSH).

| Aspect | Detail |
|---|---|
| Framework | Laravel 11 / PHP 8.2+ |
| Auth | Laravel Sanctum (cookie-backed session auth) |
| External data | PodcastIndex.org API (proxied — all podcast data) |
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
| GET | `/api/music/track/:id` | No | Single track detail |
| GET | `/api/music/similar/:id` | No | Similar tracks |
| GET | `/api/music/album/:id` | No | Album detail |
| GET | `/api/music/artist/:id` | No | Artist detail |
| GET | `/api/music/radios` | No | Jamendo radio stations (currently not used by the frontend for genre discovery) |
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
4. `npm run build` which now runs `node scripts/generate-static-seo.js && vite build && cp public/.htaccess dist/.htaccess`
5. `npm run generate-og-images`
6. `npm run generate-sitemap`
7. Verify `dist/.htaccess` is present
8. Deploy `dist/` via FTPS to production server

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `FTP_SERVER` | Hostname of the FTP server |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |
| `FTP_SERVER_DIR` | Remote directory path to deploy into |

The deploy uses `SamKirkland/FTP-Deploy-Action@v4.3.5` with `dangerous-clean-slate: true`.

---

## Local Development

```sh
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Run unit tests
npm run test:unit
```

**Environment:**
- Copy `.env` and set `VITE_BASE_URL` to your local Laravel API URL (default: `http://localhost/`)
- Production uses `VITE_BASE_URL=https://api.unlistened.me/`

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
| 7 | Jamendo music integration (see [`strategy/jamendo-strategy.md`](strategy/jamendo-strategy.md)) | **IN PROGRESS** |
| 8 | Capacitor mobile app (iOS + Android) | TODO |

### Refactor Progress (2025)

Code consolidation completed in three phases:

| Phase | Status |
|---|---|
| 1 — Utilities & Composables | **DONE** |
| 2 — Reusable Components | **DONE** |
| 3 — Pinia Persistence | **DONE** (with auth excluded from local restoration) |
