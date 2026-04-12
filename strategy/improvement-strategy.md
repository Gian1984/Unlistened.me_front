# Unlistened.me - Improvement Strategy

## Goal

Stabilize the current Vue 3 frontend before adding more features. The main issue is not missing functionality, but drift between code, documentation, auth behavior, and test coverage.

This checklist is ordered by impact:
1. remove sources of broken state
2. make auth/session handling predictable with Sanctum
3. align documentation and code
4. improve UX only after the base is reliable

---

## Phase 1 - Session And Persistence

### 1.1 Define a strict persistence policy

Problem:
- `Laravel Sanctum` is the source of truth for authentication/session state
- persisting auth-related state in Pinia or localStorage can make protected pages behave incorrectly after refresh, logout, token expiry, or backend session invalidation

Decision:
- `authStore` must not use `pinia-plugin-persistedstate`
- login/logout/session validity must be derived from backend-confirmed state, not from stale frontend storage
- only UX-safe state should be persisted locally

Keep persisted:
- `playerStore`: current media shell and visibility
- `queueStore`: active queue
- `musicLibraryStore`: non-auth UI cache only if it cannot grant access by itself
- `historyStore`: listening progress

Do not persist:
- `authStore`
- admin flags
- anything that unlocks protected routes by itself

### 1.2 Refactor auth bootstrap around Sanctum

Checklist:
- [ ] document the exact auth flow: app boot, login, refresh, logout, 401 handling
- [ ] replace local `auth` restoration assumptions with a bootstrap check against the API
- [ ] ensure protected routes wait for auth bootstrap before redirecting
- [ ] make logout clear all auth-derived local state consistently
- [ ] clear favorites/playlists caches when auth is lost or user changes
- [ ] make route guards depend on confirmed auth state, not optimistic frontend flags

Suggested target behavior:
- app starts in `auth unknown`
- frontend performs session/token validation
- only after validation it decides `authenticated` or `guest`
- protected pages should not flicker into wrong states during bootstrap

### 1.3 Remove persistence duplication

Problem:
- some stores already write manually to localStorage while also declaring `persist`
- this increases drift and makes debugging harder

Checklist:
- [ ] choose one persistence mechanism per store
- [ ] keep `historyStore` manual or plugin-based, but not both conceptually
- [ ] verify `musicLibraryStore` persistence is safe when the user logs out
- [ ] write down storage keys in one place

---

## Phase 2 - Testing And Reliability

### 2.1 Remove dead template code

Checklist:
- [x] remove `HelloWorld` test residue
- [ ] search for any other Vite/Vue starter leftovers and delete them

### 2.2 Add minimum real test coverage

Priority targets:
- [ ] `authStore` bootstrapping and logout reset
- [ ] `queueStore` next/previous behavior
- [ ] `playerStore` current item and play state logic
- [ ] `historyStore` progress/completion logic
- [ ] route guard behavior for guest, user, admin

Rules:
- prefer small unit tests around stores/composables
- do not add snapshot-heavy or brittle component tests first

### 2.3 Add basic regression gates

Checklist:
- [ ] make `npm run test:unit -- --run` green and keep it green
- [ ] add a lightweight CI check for build + tests
- [ ] fail fast when imports reference deleted files

---

## Phase 3 - Documentation Alignment

### 3.1 Bring `README.md` back in sync with the codebase

Current drift to fix:
- router is documented as lazy-loaded, but views are statically imported
- persistence is documented too broadly
- some architecture notes describe intended behavior, not current behavior

Checklist:
- [ ] update stack versions only when verified from `package.json`
- [ ] document real auth behavior and Sanctum constraints
- [ ] describe persistence store by store, including exclusions
- [ ] remove claims that are not true today
- [ ] include `NowPlayingView` if it is part of the app
- [ ] add a short “known constraints” section

### 3.2 Keep strategy files current or remove stale ones

Checklist:
- [ ] review all files in `strategy/`
- [ ] archive or delete plans that no longer reflect the app
- [ ] use one primary strategy file for active work

---

## Phase 4 - Architecture Cleanup

### 4.1 Router and code-splitting

Checklist:
- [ ] decide explicitly whether routes should be lazy-loaded
- [ ] if yes, convert non-critical views to dynamic imports
- [ ] if no, remove lazy-loading claims from docs/scripts
- [ ] review route naming consistency and URL naming style

### 4.2 Store responsibilities

Checklist:
- [ ] keep stores focused on state and transitions, not API orchestration where avoidable
- [ ] centralize auth-loss cleanup so it happens in one path only
- [ ] review whether `messageStore` should be event-like rather than long-lived state

### 4.3 API client behavior

Checklist:
- [ ] verify `401` handling does not create redirect loops
- [ ] make sure auth failure clears stale UI caches
- [ ] standardize service return shapes where possible

---

## Phase 5 - UX Improvements With High Value

### 5.1 Player polish

Checklist:
- [ ] decide whether music should have history persistence or not
- [ ] align implementation and README on that choice
- [ ] add volume control on desktop
- [ ] add direct contextual actions only if they do not overload the player UI

### 5.2 Navigation and discovery

Checklist:
- [ ] improve search suggestions/autocomplete
- [ ] improve category browsing on mobile
- [ ] add clearer back-navigation and breadcrumbs on deep content pages

### 5.3 Favorites and playlists reliability

Checklist:
- [ ] verify protected library pages recover correctly after refresh
- [ ] verify optimistic updates rollback cleanly on API failure
- [ ] ensure logout does not leave stale favorite/playlist UI behind

---

## Phase 6 - Design System Consolidation

Checklist:
- [ ] define a small set of reusable surface/button/input tokens
- [ ] standardize heading and body typography
- [ ] remove inconsistent spacing/radius patterns
- [ ] only after token cleanup, consider bigger visual redesigns

---

## Suggested Execution Order

### Immediate
- [x] remove `HelloWorld` test residue
- [ ] stop persisting auth-derived access state
- [ ] make auth bootstrap explicit and backend-validated
- [ ] fix tests so the suite is green
- [ ] update README to reflect reality

### Next
- [ ] clean persistence duplication
- [ ] add store-level tests
- [ ] review router loading strategy
- [ ] verify protected pages after refresh/logout/session expiry

### Later
- [ ] player polish
- [ ] search/navigation upgrades
- [ ] design-system consolidation

---

## Non-Negotiable Rules

- Sanctum is the authority for auth, not localStorage
- no persisted state may grant access to protected views by itself
- every persisted store must have a documented reason to exist
- README must describe current behavior, not planned behavior
- no template leftovers in tests or source tree
- [x] Updated notification toasts to dark theme across all views
- [x] Fixed Footer mixed Options/Composition API pattern
- [x] Updated all 20 views to consistent dark theme

**Files:** All views, `src/assets/base.css` (rewritten), `src/components/Footer.vue` (rewritten)

---

### 3.6 Page Layout Harmonization

**Current state:** All pages now share the same wrapper, container, header, and card patterns. Eyebrow text, h1 hierarchy, descriptions, and section spacing are consistent across the app.

**Pattern adopted:**
- Page wrapper: `bg-gray-950 min-h-screen` + `p-6 sm:p-8`
- Container: `mx-auto max-w-6xl`
- Eyebrow: `text-sm font-semibold text-pink-400` (or `text-indigo-400`)
- H1: `text-3xl font-semibold tracking-tight text-white sm:text-5xl`
- Description: `text-lg leading-8 text-gray-400`
- Section cards: `rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6`
- Inputs: `rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white`
- Primary buttons: `rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500`
- Error states: `rounded-lg border border-red-500/40 bg-red-500/10 p-4`
- Success states: `rounded-lg border border-green-500/40 bg-green-500/10 p-4`

**Improvements:**
- [x] Auth pages (Login, SignUp, ForgotPassword, ResetPassword) — centered `sm:max-w-md` card layout
- [x] Error pages (404 NotFound, 403 Forbidden) — restructured with `max-w-6xl` + eyebrow + info card
- [x] SettingsView — three `rounded-2xl` sections (Personal info, Contact, Danger zone)
- [x] DashboardView — wrapped stats / charts / questions / users sections in harmonized cards
- [x] SearchResultView — wrapped header + results in `max-w-6xl`, added eyebrow, fixed category title bug
- [x] HomeView / CategoriesView — `selectCategory` now passes the category name via router query so SearchResultView shows the real name
- [x] Confirmed AboutView, DocumentationView, TermsView, FeedEpisodesView, FavouritesView, BookmarksView, SingleEpisodeView already match the pattern
- [x] Deleted unused legacy `FeedsView.vue`

**Files:** all 20 views audited, 8 modified, 1 deleted

---

## Priority 4: Features

### 4.1 Listening History

**Improvements:**
- [ ] Track played episodes in localStorage (or backend for logged-in users)
- [ ] Show **"Continue listening"** section at the top with last played episode and resume position
- [ ] Show **"Recently played"** list in sidebar or main browse view
- [ ] Mark played episodes with a subtle indicator (checkmark or reduced opacity)

**Files:** Create `src/stores/historyStore.js`, update `OffcanvasPlayer.vue`, `FeedsView.vue`

---

### 4.2 Episode Queue

**Improvements:**
- [ ] Add **"Play Next"** and **"Add to Queue"** actions on episode cards
- [ ] Show queue count on player bar
- [ ] Draggable queue list (reorder with vuedraggable)
- [ ] Auto-play next episode from queue when current finishes
- [ ] Clear queue button

**Files:** Create `src/stores/queueStore.js`, update player component

---

### 4.3 Progressive Web App (PWA)

**Improvements:**
- [ ] Add `manifest.json` with app name, icons, theme color
- [ ] Register service worker for offline capability
- [ ] Cache podcast list and categories for offline browsing
- [ ] "Add to Home Screen" prompt on mobile
- [ ] Background audio playback (already works with MediaSession)

**Files:** `vite.config.js` (add vite-plugin-pwa), `public/manifest.json`

---

### 4.4 Settings Page Improvements

**Current state:** Basic settings with username, email, language, contact form. Dark theme. Textarea max 255 chars with no counter.

**Improvements:**
- [ ] Add **character counter** on contact form textarea
- [ ] Add **avatar/profile image** upload
- [ ] Add **notification preferences** (email for new episodes from favorites)
- [ ] Add **playback settings**: default speed, auto-play next
- [ ] Add **data export**: download favorites/bookmarks as JSON
- [ ] Add **account deletion** with confirmation dialog

**Files:** `src/views/SettingsView.vue`

---

## Priority 5: Performance

### 5.1 Lazy Loading & Code Splitting

**Improvements:**
- [ ] Lazy load routes with `() => import()` (most already exist in router)
- [ ] Lazy load Chart.js only on Dashboard (currently imported eagerly)
- [ ] Lazy load vuedraggable only on Favorites/Bookmarks views
- [ ] Image lazy loading with `loading="lazy"` attribute on all `<img>` tags
- [ ] Use `<Suspense>` for async component loading

---

### 4.5 Capacitor Mobile App (App Store & Play Store)

**Current state:** Web-only app. No native mobile presence.

**Approach:** Use **Capacitor only** (no Ionic) to wrap the existing Vue + Tailwind app as a native iOS/Android app. The UI stays as-is; Capacitor provides the native shell.

**Prerequisites:** Complete Phase 2-4 first (dark mode, bottom nav, mobile polish) so the app looks native and passes App Store review.

**Setup:**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Unlistened.me" "me.unlistened.app"
npx cap add ios
npx cap add android
```

**Improvements:**
- [ ] Initialize Capacitor project with iOS + Android targets
- [ ] Configure splash screen and app icons (all required sizes)
- [ ] Add **background audio** plugin (`@capacitor-community/background-mode` or native `UIBackgroundModes`)
- [ ] Add **safe area insets** (`env(safe-area-inset-*)`) for notched devices
- [ ] Configure `capacitor.config.ts` with server URL for dev, local for prod
- [ ] Test audio playback in background on both platforms
- [ ] Set up **Capacitor Preferences** plugin for persistent storage (replace localStorage)
- [ ] Handle offline state gracefully (network status plugin)
- [ ] Submit to **Apple App Store** ($99/year developer account)
- [ ] Submit to **Google Play Store** ($25 one-time developer account)

**Key challenges:**
1. Background audio on iOS (requires `UIBackgroundModes` audio capability)
2. App Store review — Apple rejects "wrapped websites"; dark mode + bottom tabs + native feel required
3. Safe areas for iPhone notch/Dynamic Island

**Files:** `capacitor.config.ts` (new), `ios/` (new), `android/` (new), `src/assets/base.css` (safe area insets)

---

### 5.2 Image Optimization

**Improvements:**
- [ ] Podcast cover images: add `width` and `height` attributes to prevent layout shift
- [ ] Use `object-fit: cover` consistently
- [ ] Add fallback placeholder for broken images (already partial, but inconsistent)
- [ ] Consider a blur-hash placeholder while images load

---

## Implementation Order

| Phase | Tasks | Status |
|---|---|---|
| **Phase 1** | Audio Player rewrite (1.1), API service layer (1.2), script setup migration (1.3) | DONE |
| **Phase 2** | Full dark mode (3.5), skeleton loading (2.1), empty states (2.5) | DONE |
| **Phase 2.5** | Page layout harmonization (3.6) — auth, error, settings, dashboard, search results | DONE |
| **Phase 3** | Navigation + search (2.3), category pills (2.4), card redesign (2.2) | TODO |
| **Phase 4** | Mobile bottom nav (3.4), auth pages polish (3.3) | TODO |
| **Phase 5** | Listening history (4.1), episode queue (4.2) | TODO |
| **Phase 6** | PWA (4.3), performance (5.1, 5.2), settings (4.4) | TODO |
| **Phase 7** | Capacitor mobile app (4.5) | TODO |

---

## Files Reference

| File | Lines | Role |
|---|---|---|
| `src/views/NavigationView.vue` | 431 | Main layout, sidebar, header, search, categories |
| `src/components/OffcanvasPlayer.vue` | ~305 | Audio player (rewritten) |
| `src/views/HomeView.vue` | ~200 | Home page (harmonized) |
| `src/views/FeedEpisodesView.vue` | ~120 | Episodes list for a podcast |
| `src/views/SingleEpisodeView.vue` | ~80 | Single episode detail |
| `src/views/SearchResultView.vue` | ~150 | Search results |
| `src/views/CategoriesView.vue` | ~78 | Category grid |
| `src/views/FavouritesView.vue` | ~100 | Favorites with drag-drop |
| `src/views/BookmarksView.vue` | ~100 | Bookmarks with drag-drop |
| `src/views/LoginView.vue` | ~130 | Authentication |
| `src/views/SignUpView.vue` | ~120 | Registration |
| `src/views/SettingsView.vue` | ~300 | User settings |
| `src/views/DashboardView.vue` | ~100 | Admin dashboard |
| `src/stores/authStore.js` | 40 | Auth state |
| `src/stores/messageStore.js` | 18 | Notifications |
| `src/stores/playerStore.js` | 19 | Global audio player state (NEW) |
| `src/components/SkeletonCard.vue` | ~25 | Shimmer skeleton for podcast cards (NEW) |
| `src/components/SkeletonRow.vue` | ~20 | Shimmer skeleton for episode rows (NEW) |
| `src/components/EmptyState.vue` | ~25 | Reusable empty state with icon, title, CTA (NEW) |
| `src/services/api.js` | 30 | Centralized axios instance + 401 interceptor (NEW) |
| `src/services/podcastService.js` | 81 | Podcast API calls (NEW) |
| `src/services/authService.js` | 33 | Auth API calls (NEW) |
| `src/services/userService.js` | 23 | User API calls (NEW) |
| `src/services/adminService.js` | 38 | Admin API calls (NEW) |
| `src/router/index.js` | 750 | Routing + SEO meta |

## Reference: CodeHelper Player

Key patterns to adopt from `components/podcasts/PodcastPlayer.vue`:
- Full-width sticky bottom bar with `fixed bottom-0 left-0 right-0`
- Sidebar-aware: adjusts `left` based on sidebar collapsed state
- Draggable seek: `mousedown` + `mousemove` + `mouseup` event chain
- Touch support: `touchstart` + `touchmove` + `touchend`
- MediaSession API for native OS controls
- Heart/Bookmark toggles directly in the player
- Cover art as navigation element (click to go to episode list)
- Animated "sound bars" indicator for currently playing episode
- Transition animations for player show/hide
