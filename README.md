# Unlistened.me — Frontend

Vue 3 podcast streaming web app backed by a **Laravel 11 API** (`api.unlistened.me`). Deployed automatically to shared hosting via FTPS on every push to `main`.

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Vue 3 (`<script setup>` Composition API) | 3.4.21 |
| Build | Vite | 5.1.5 |
| Styling | Tailwind CSS 3 + `@tailwindcss/forms` | 3.4.1 |
| UI components | Headless UI, Heroicons | 1.7.19 / 2.1.1 |
| HTTP | Axios (centralized instance in `src/services/api.js`) | 1.6.7 |
| Auth | Laravel Sanctum (Bearer token, stored in localStorage) | 4.0 |
| State | Pinia — authStore, messageStore, playerStore, historyStore, queueStore, musicLibraryStore | 2.1.7 |
| Routing | Vue Router 4 (lazy-loaded routes + SEO meta guards) | 4.3.0 |
| Charts | Chart.js + vue-chartjs (admin dashboard) | 4.4.3 |
| Drag & Drop | vuedraggable 4 (favourites & bookmarks) | 4.1.0 |
| Testing | Vitest + @vue/test-utils | — |

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: build → FTPS deploy on push to main
├── public/
│   ├── .htaccess                   # SPA fallback (all routes → index.html)
│   └── images/                     # Static assets (logo)
├── src/
│   ├── App.vue                     # Root: <NavigationView> + <OffcanvasPlayer> + <CookieConsent>
│   ├── main.js                     # App bootstrap (Pinia, Router)
│   │
│   ├── router/
│   │   └── index.js                # 23 routes (incl. 4 music), with SEO meta guards
│   │
│   ├── services/                   # API layer (all HTTP calls go here)
│   │   ├── api.js                  # Axios instance: baseURL, CSRF, 401 interceptor
│   │   ├── podcastService.js       # Podcast + episode endpoints
│   │   ├── musicService.js         # Jamendo music endpoints (tracks, favorites, playlists)
│   │   ├── authService.js          # Login, logout, register, password reset, language
│   │   ├── userService.js          # Profile, settings, contact form, delete account
│   │   └── adminService.js         # Dashboard stats, user management
│   │
│   ├── stores/                     # Pinia stores
│   │   ├── authStore.js            # Authenticated user state (persisted to localStorage)
│   │   ├── messageStore.js         # Global toast/notification messages
│   │   ├── playerStore.js          # Audio player state (current track, isPlaying, togglePlay)
│   │   ├── historyStore.js         # Listening history + resume progress (localStorage)
│   │   ├── queueStore.js           # Playback queue (next/prev track navigation)
│   │   └── musicLibraryStore.js    # Music favorites + playlists state
│   │
│   ├── composables/
│   │   └── useSidebarState.js      # Shared sidebar collapsed/expanded state
│   │
│   ├── seo/
│   │   ├── composables/useSeo.js   # SEO composable (sets document.title + meta)
│   │   └── registry/index.js       # Per-route SEO metadata registry
│   │
│   ├── components/
│   │   ├── OffcanvasPlayer.vue     # Unified sticky bottom player (podcasts + music)
│   │   ├── CookieConsent.vue       # GDPR cookie consent banner
│   │   ├── Footer.vue              # App footer
│   │   ├── EmptyState.vue          # Reusable empty state (icon + title + CTA)
│   │   ├── SkeletonCard.vue        # Shimmer skeleton for podcast cards
│   │   ├── SkeletonRow.vue         # Shimmer skeleton for episode rows
│   │   ├── icons/                  # SVG icon components
│   │   └── music/                  # Music-specific components
│   │       ├── LicenseBadge.vue    # CC license badge display
│   │       ├── FavoriteMusicButton.vue  # Heart toggle for music tracks
│   │       └── AddToPlaylistMenu.vue    # Dropdown to add track to playlist
│   │
│   ├── views/
│   │   ├── NavigationView.vue      # Main layout shell: sidebar, header, <RouterView>
│   │   ├── HomeView.vue            # Browse podcasts (grid of cards + continue listening)
│   │   ├── CategoriesView.vue      # Category grid → filters HomeView
│   │   ├── SearchResultView.vue    # Search results (podcasts + music tracks)
│   │   ├── FeedEpisodesView.vue    # Episode list for a single podcast (cover+play overlay)
│   │   ├── SingleEpisodeView.vue   # Single episode detail + play
│   │   ├── FavouritesView.vue      # Saved podcasts (enriched cards with cover + author)
│   │   ├── BookmarksView.vue       # Bookmarked episodes (drag-to-reorder into sections)
│   │   ├── MusicHomeView.vue       # Music: trending tracks from Jamendo
│   │   ├── MusicFavoritesView.vue  # Music: liked songs list
│   │   ├── MusicPlaylistsView.vue  # Music: user playlists grid
│   │   ├── MusicPlaylistDetailView.vue  # Music: single playlist track list
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
│   ├── utils/
│   │   └── musicTrackPayload.js    # Shape adapter: normalizes Jamendo data → player format
│   │
│   └── assets/
│       └── base.css                # Global CSS (dark theme base, shimmer animation, Tailwind imports)
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

### Listening History

`historyStore.js` tracks all played episodes in `localStorage`:
- `recordPlay(episode)` — logs a new play entry
- `updateProgress(episodeId, currentTime, duration)` — called every 5 seconds during playback
- `getProgress(episodeId)` — returns saved `currentTime` for resume
- `markCompleted(episodeId)` — marks episode as fully listened
- `continueListening` computed — episodes with progress > 5s and not completed (used on HomeView)

### API / Auth

All HTTP calls go through `src/services/api.js` (centralized Axios instance with `withCredentials: true` + `withXSRFToken: true`). Auth is token-based (Laravel Sanctum): token stored in `localStorage`, sent as Bearer header. A 401 response anywhere clears auth state and redirects to `/login`.

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

`src/router/index.js` defines 23 routes (including 4 music routes). Navigation guards handle auth-required routes and set `document.title` from route meta. SEO metadata (title, description, og:*) is managed via `src/seo/`.

---

## Backend (Laravel REST API)

Repo: `/Users/gianlucainsideweb/Projects/Unlistened.me_rest` (local clone may be behind the VPS — some changes have been applied live via SSH).

| Aspect | Detail |
|---|---|
| Framework | Laravel 11 / PHP 8.2+ |
| Auth | Laravel Sanctum (API tokens) |
| External data | PodcastIndex.org API (proxied — all podcast data) |
| Database | MySQL — users, favorites, bookmarks, plays, downloads, faqs |
| Models | User, Favorite, Bookmark, Play, Download, Faq, Podcast |
| Mail | Welcome, delete account, forgot password, FAQ notification |

### Main API endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/login` | No | Login → returns token + user |
| POST | `/api/register` | No | Registration |
| POST | `/api/logout` | No | Logout |
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
| GET | `/api/music/radios` | No | Jamendo radio stations |
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
4. `npm run build` (outputs to `dist/`)
5. Verify `dist/.htaccess` is present (SPA fallback for Apache)
6. Deploy `dist/` via FTPS to production server

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
| 2.5 | Page layout harmonization (all 20 views) | **DONE** |
| 3 | Inline category pills, search autocomplete, card redesign | TODO |
| 4 | Mobile bottom nav, auth page polish | TODO |
| 5 | Listening history UI, episode queue | **PARTIAL** (queue store + auto-advance done) |
| 6 | PWA (see [`strategy/pwa-strategy.md`](strategy/pwa-strategy.md)), performance | TODO |
| 7 | Jamendo music integration (see [`strategy/jamendo-strategy.md`](strategy/jamendo-strategy.md)) | **IN PROGRESS** |
| 8 | Capacitor mobile app (iOS + Android) | TODO |
