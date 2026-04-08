# Unlistened.me — Frontend

Vue 3 podcast streaming web app backed by a **Laravel 11 API** (`api.unlistened.me`). Deployed automatically to a shared hosting via FTP on every push to `main`.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (`<script setup>` Composition API) |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + `@tailwindcss/forms` |
| UI components | Headless UI, Heroicons |
| HTTP | Axios (centralized instance in `src/services/api.js`) |
| Auth | Laravel Sanctum (cookie-based, CSRF via `/sanctum/csrf-cookie`) |
| State | Pinia (authStore, messageStore, playerStore, historyStore) |
| Routing | Vue Router 4 (lazy-loaded routes + SEO meta) |
| Charts | Chart.js + vue-chartjs (admin dashboard) |
| Drag & Drop | vuedraggable 4 (favorites & bookmarks) |
| Testing | Vitest + @vue/test-utils |

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build → FTP deploy on push to main
├── public/
│   └── .htaccess               # SPA fallback (all routes → index.html)
├── src/
│   ├── App.vue                 # Root: <NavigationView> + <OffcanvasPlayer>
│   ├── main.js                 # App bootstrap (Pinia, Router)
│   │
│   ├── router/
│   │   └── index.js            # 17 routes, lazy-loaded, with SEO meta guards
│   │
│   ├── services/               # API layer (all HTTP calls go here)
│   │   ├── api.js              # Axios instance: baseURL, CSRF, 401 interceptor
│   │   ├── podcastService.js   # Podcast + episode endpoints
│   │   ├── authService.js      # Login, logout, register, password reset
│   │   ├── userService.js      # Profile, settings, favorites, bookmarks
│   │   └── adminService.js     # Dashboard stats, user management
│   │
│   ├── stores/                 # Pinia stores
│   │   ├── authStore.js        # Authenticated user state
│   │   ├── messageStore.js     # Global toast/notification messages
│   │   ├── playerStore.js      # Global audio player state (current episode)
│   │   └── historyStore.js     # Listening history (localStorage)
│   │
│   ├── composables/
│   │   └── useSidebarState.js  # Shared sidebar collapsed/expanded state
│   │
│   ├── components/
│   │   ├── OffcanvasPlayer.vue # Full-width sticky bottom audio player bar
│   │   ├── Footer.vue          # App footer
│   │   ├── EmptyState.vue      # Reusable empty state (icon + title + CTA)
│   │   ├── SkeletonCard.vue    # Shimmer skeleton for podcast cards
│   │   ├── SkeletonRow.vue     # Shimmer skeleton for episode rows
│   │   └── icons/              # SVG icon components (home screen icons)
│   │
│   ├── views/
│   │   ├── NavigationView.vue  # Main layout shell: sidebar, header, <RouterView>
│   │   ├── HomeView.vue        # Browse podcasts (grid of cards)
│   │   ├── CategoriesView.vue  # Category grid → filters HomeView
│   │   ├── SearchResultView.vue# Search results (query or category filter)
│   │   ├── FeedEpisodesView.vue# Episode list for a single podcast
│   │   ├── SingleEpisodeView.vue # Single episode detail + play
│   │   ├── FavouritesView.vue  # Saved podcasts (drag-to-reorder)
│   │   ├── BookmarksView.vue   # Bookmarked episodes (drag-to-reorder)
│   │   ├── LoginView.vue       # Auth: login
│   │   ├── SignUpView.vue      # Auth: registration
│   │   ├── ForgotPasswordView.vue # Auth: request password reset
│   │   ├── ResetPasswordView.vue  # Auth: set new password
│   │   ├── SettingsView.vue    # User profile & preferences
│   │   ├── DashboardView.vue   # Admin: stats, charts, users (admin only)
│   │   ├── AboutView.vue       # Static about page
│   │   ├── DocumentationView.vue # Static docs page
│   │   ├── TermsView.vue       # Static terms page
│   │   ├── NotFoundView.vue    # 404 error page
│   │   └── ForbiddenView.vue   # 403 error page
│   │
│   └── assets/
│       └── base.css            # Global CSS (dark theme base, Tailwind imports)
│
├── strategy/
│   └── improvement-strategy.md # Phased improvement plan (phases 1-7, with status)
├── .env                        # Local dev: VITE_BASE_URL=http://localhost/
├── .env.production             # Prod: VITE_BASE_URL=https://api.unlistened.me/
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Key Architecture Decisions

### Audio Player
`OffcanvasPlayer.vue` is a **full-width sticky bottom bar** (fixed, sidebar-aware). It uses the HTML5 `<audio>` element directly. Global state (current episode, play/pause) is managed by `playerStore.js`. Implements the MediaSession API for OS-level lockscreen controls. Supports draggable seek bar, playback speed, skip ±15/30s.

### API / Auth
All HTTP calls go through `src/services/api.js` (centralized Axios instance). Laravel Sanctum cookie auth: every request sends `withCredentials: true` + `withXSRFToken: true`. A 401 response anywhere in the app automatically clears auth state and redirects to `/login`.

### Design System
Full dark theme. Key tokens (applied via Tailwind classes throughout):
- Background: `bg-gray-950` (page), `bg-gray-900` (cards/sidebar)
- Primary: `indigo-600` / hover `indigo-500`
- Accent/favorites: `pink-500` / hover `pink-400`
- Text: `text-white` (headings), `text-gray-400` (body/meta)
- Cards: `rounded-2xl border border-gray-800 bg-gray-900/50 p-5`

### Routing
`src/router/index.js` defines 17 routes, all lazy-loaded. Navigation guards handle auth-required routes and set `document.title` from route meta.

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

The deploy uses `SamKirkland/FTP-Deploy-Action@v4.3.5` with `dangerous-clean-slate: true` (remote dir is wiped and replaced on each deploy). State is tracked in `.ftp-deploy-sync-state.json` for incremental deploys.

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
| 1 | Audio player rewrite, API service layer, script setup migration | DONE |
| 2 | Full dark mode, skeleton loading, empty states | DONE |
| 2.5 | Page layout harmonization (all 20 views) | DONE |
| 3 | Inline category pills, search autocomplete, card redesign | TODO |
| 4 | Mobile bottom nav, auth page polish | TODO |
| 5 | Listening history, episode queue | TODO |
| 6 | PWA, performance (code splitting, image opt), settings | TODO |
| 7 | Capacitor mobile app (iOS + Android) | TODO |
