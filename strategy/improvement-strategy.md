# Unlistened.me - Improvement Strategy

## Project Overview

Vue 3 + Vite podcast streaming app with Tailwind CSS, Headless UI, Laravel Sanctum backend.
17 routes, 14 views, 2 components (Footer, OffcanvasPlayer), 3 Pinia stores (auth, message, player).
5 service modules: `api.js`, `podcastService.js`, `authService.js`, `userService.js`, `adminService.js`.

Colors: Indigo primary (`bg-indigo-600`), Pink accent (`bg-pink-500`), Gray-900 sidebar, White content.

---

## Priority 1: Critical Fixes

### 1.1 Audio Player Redesign

**Current state:** `OffcanvasPlayer.vue` is a small floating box (bottom-right) with basic play/pause, a clickable progress bar, and a close button. No volume control, no skip, no speed, no queue. Closing the player stops playback and loses the episode.

**Reference:** CodeHelper's `PodcastPlayer.vue` has a full-width bottom bar with:
- Draggable progress bar with thumb indicator
- Time display (`currentTime / duration`)
- Cover art click to navigate back to episode list
- Heart (favorite) + Bookmark buttons directly in player
- MediaSession API (lockscreen controls on mobile/desktop)
- Smooth slide-up/down transition
- Responsive: adapts to sidebar width

**Improvements:**
- [x] Replace floating box with **full-width sticky bottom bar** (like CodeHelper)
- [x] Add **draggable progress bar** with thumb, not just click-to-seek
- [x] Add **time display** (current / total)
- [x] Add **playback speed** control (0.5x, 1x, 1.25x, 1.5x, 2x)
- [x] Add **skip forward/back** buttons (15s back, 30s forward)
- [x] Implement **MediaSession API** for lockscreen/notification controls
- [x] Cover art and episode info display in player bar
- [ ] Add **volume slider** (desktop only, hidden on mobile)
- [ ] Add **favorite/bookmark** buttons directly in the player bar
- [ ] Cover art in player should **navigate to podcast episodes** on click
- [ ] Closing player should **minimize**, not destroy (keep episode in memory for resume)
- [ ] Add **queue** support: next/previous episode navigation

**Files:** `src/components/OffcanvasPlayer.vue` (full rewrite - DONE), `src/stores/playerStore.js` (NEW)

---

### 1.2 Fix API Layer (No Service Abstraction)

**Current state:** Every view has `const base_Url = import.meta.env.VITE_BASE_URL` at the top and inline axios calls with `withCredentials: true, withXSRFToken: true` repeated everywhere. No centralized error handling.

**Improvements:**
- [x] Create `src/services/api.js` with a configured axios instance
- [x] Centralize base URL, credentials, CSRF token, error interceptors
- [x] Create domain-specific services: `podcastService.js`, `authService.js`, `userService.js`, `adminService.js`
- [x] Add global error interceptor (401 → redirect to login)
- [x] Remove `base_Url` declarations from all 15+ views
- [x] Remove `vue-axios` plugin dependency (no longer needed)

**Files:** `src/services/api.js`, `src/services/podcastService.js`, `src/services/authService.js`, `src/services/userService.js`, `src/services/adminService.js` (ALL DONE)

---

### 1.3 Fix Mixed Composition/Options API

**Current state:** `NavigationView.vue` uses both `<script setup>` (lines 1-52, reactive refs) AND `<script>` (lines 283-430, Options API). Confusing, error-prone.

**Improvements:**
- [x] Convert `NavigationView.vue` to pure Composition API (`<script setup>`)
- [x] Convert all remaining Options API views to `<script setup>`:
  - [x] LoginView, SignUpView, ForgotPasswordView, ResetPasswordView
  - [x] FeedsView, CategoriesView, SearchResultView
  - [x] FavouritesView, BookmarksView
  - [x] SettingsView, DashboardView
  - [x] FeedEpisodesView, SingleEpisodeView

**Files:** All 12 views migrated. `src/main.js` cleaned up (removed vue-axios).

---

## Priority 2: UX Improvements

### 2.1 Loading States & Skeleton Screens

**Current state:** Full-page spinner with "loading..." text. Content appears all at once with no visual preview.

**Reference:** CodeHelper uses skeleton shimmer placeholders that match the content layout.

**Improvements:**
- [ ] Replace spinner with **skeleton cards** (gray shimmer blocks matching podcast card layout)
- [ ] Skeleton for episode list (3-5 placeholder rows)
- [ ] Skeleton for categories grid
- [ ] Keep spinner only for small inline actions (button loading, etc.)

**Files:** Create `src/components/SkeletonCard.vue`, `src/components/SkeletonRow.vue`

---

### 2.2 Podcast Card Redesign

**Current state:** Cards show image, title, truncated description, author, categories as badges, and a favorite star. Layout is functional but dense. Description is hard to read.

**Reference:** CodeHelper podcast cards have cleaner typography, subtle borders, hover effects with color accent, and action buttons that appear on hover.

**Improvements:**
- [ ] Increase card image size and make it **square with rounded corners**
- [ ] Show **category** as a subtle pill badge below the image
- [ ] Truncate description to 2 lines with CSS `line-clamp-2`
- [ ] Add **hover state**: subtle border color change, slight scale
- [ ] Move favorite button to **top-right overlay** on the card image
- [ ] Add **play button overlay** on card image hover (play latest episode directly)
- [ ] Show **episode count** on the card

**Files:** `src/views/FeedsView.vue`, `src/views/SearchResultView.vue`

---

### 2.3 Navigation & Search

**Current state:** Category filter is in a Headless UI Popover that overlaps content. Search is in the header but doesn't show suggestions. No breadcrumbs for deep pages.

**Reference:** CodeHelper has category pills directly visible (not hidden in a popover), search with instant results, and breadcrumb navigation.

**Improvements:**
- [ ] Move category filter from popover to **inline horizontal pills** below the header (like CodeHelper)
- [ ] Add **search suggestions/autocomplete** dropdown as user types
- [ ] Add **breadcrumb navigation** for episode detail pages: Podcasts > Show Name > Episode
- [ ] Add **back button** visible on episode/detail pages (not just browser back)
- [ ] On mobile, make category pills **horizontally scrollable** with fade edges
- [ ] Add **"Recently played"** section at the top of the podcast browse page

**Files:** `src/views/NavigationView.vue`, `src/views/FeedEpisodesView.vue`, `src/views/SingleEpisodeView.vue`

---

### 2.4 Pagination to Infinite Scroll

**Current state:** "Load More" buttons require manual clicks. Categories in the popover have confusing "..." pagination with max 3 visible pages.

**Improvements:**
- [ ] Replace "Load More" with **infinite scroll** (IntersectionObserver) on feeds and search results
- [ ] Keep a "Load More" fallback button visible in case IntersectionObserver fails
- [ ] Show loading indicator at bottom of list while fetching
- [ ] Remove the complex category pagination; show all categories in scrollable pills

**Files:** `src/views/FeedsView.vue`, `src/views/SearchResultView.vue`, `src/views/NavigationView.vue`

---

### 2.5 Empty States

**Current state:** Inconsistent empty states across views. Different SVG icons, different copy, different tone.

**Improvements:**
- [ ] Create a **shared EmptyState component** with icon, title, description, CTA button
- [ ] Consistent style: gray icon (48px), descriptive text, action button
- [ ] Custom messages per context:
  - Favorites: "No saved podcasts yet. Browse and tap the heart to save."
  - Bookmarks: "No bookmarked episodes. Bookmark episodes to listen later."
  - Search: "No results for 'query'. Try a different search term."

**Files:** Create `src/components/EmptyState.vue`, update all views

---

### 2.6 Favorites & Bookmarks Drag-and-Drop

**Current state:** Custom sections with vuedraggable, but no visual drag handle, no instruction, no cursor change. Users don't know items are draggable.

**Improvements:**
- [ ] Add **drag handle icon** (6-dot grip) on the left of each item
- [ ] Change cursor to `grab`/`grabbing` on draggable items
- [ ] Add subtle **tooltip or onboarding** text: "Drag to reorder"
- [ ] Add **swipe-to-delete** on mobile (alternative to delete button)
- [ ] Animate drag placeholder with indigo border

**Files:** `src/views/FavouritesView.vue`, `src/views/BookmarksView.vue`

---

## Priority 3: Visual & Design Polish

### 3.1 Color System Consistency

**Current state:** Mix of button styles, border-radius values, hover states. Some buttons are pink, some indigo, transitions vary.

**Improvements:**
- [ ] Define design tokens in `tailwind.config.js`:
  - Primary action: `indigo-600` (hover `indigo-500`)
  - Accent/favorite: `pink-500` (hover `pink-400`)
  - Danger: `red-500`
  - Success: `green-500`
  - Surface: `gray-800` (cards), `gray-900` (sidebar), `black` (auth pages)
- [ ] Standardize **border-radius**: cards `rounded-xl`, buttons `rounded-lg`, pills `rounded-full`, inputs `rounded-lg`
- [ ] Standardize **button sizes**: sm (`py-1.5 px-3`), md (`py-2 px-4`), lg (`py-2.5 px-5`)
- [ ] Create **reusable button component** or Tailwind `@apply` classes

**Files:** `tailwind.config.js`, potentially create `src/components/ui/Button.vue`

---

### 3.2 Typography Hierarchy

**Current state:** Font sizes vary without clear hierarchy. Headings range from `text-2xl` to `text-6xl` inconsistently.

**Improvements:**
- [ ] Define heading scale:
  - Page title: `text-2xl sm:text-3xl font-bold`
  - Section title: `text-xl font-semibold`
  - Card title: `text-base font-semibold`
  - Body: `text-sm leading-relaxed`
  - Caption/meta: `text-xs text-gray-400`
- [ ] Use consistent line height and letter spacing

---

### 3.3 Auth Pages (Login/Register/Reset)

**Current state:** Full black background with centered form. Functional but plain. No visual branding.

**Improvements:**
- [ ] Add **split layout**: left side with branding/illustration, right side with form (desktop)
- [ ] Add **podcast waveform animation** or subtle background pattern
- [ ] Show **social proof**: "Join X listeners" or similar
- [ ] Add **password strength indicator** on registration
- [ ] Show/hide password toggle icon
- [ ] Improve error messages: inline below each field, not just a top alert

**Files:** `src/views/LoginView.vue`, `src/views/SignUpView.vue`, `src/views/ForgotPasswordView.vue`

---

### 3.4 Mobile Experience

**Current state:** Responsive but not mobile-optimized. Sidebar drawer works but requires reopening for each nav click. No bottom tab bar. Player takes space.

**Improvements:**
- [ ] Add **bottom tab navigation** on mobile (Home, Search, Favorites, Bookmarks, Profile)
- [ ] Hide sidebar on mobile entirely, use bottom tabs instead
- [ ] Player bar should be **above** the bottom tabs on mobile
- [ ] Optimize touch targets: minimum 44x44px for all interactive elements
- [ ] Add **pull-to-refresh** on podcast list
- [ ] Add **swipe gestures**: swipe left on podcast card to favorite, swipe right to play

**Files:** `src/views/NavigationView.vue`, `src/components/BottomNav.vue` (new)

---

### 3.5 Dark Mode Refinement

**Current state:** Mix of dark (auth, settings, dashboard) and light (browse, search) pages. Inconsistent.

**Improvements:**
- [ ] Go **full dark mode** consistently across all pages (matches podcast app conventions - Spotify, Apple Podcasts, Pocket Casts all dark)
- [ ] Use `gray-950` for main background, `gray-900` for cards, `gray-800` for elevated elements
- [ ] Ensure text contrast meets WCAG AA (min 4.5:1 ratio)
- [ ] Remove remaining white backgrounds from browse/search views

**Files:** All views, `src/assets/base.css`

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
| **Phase 2** | Full dark mode (3.5), skeleton loading (2.1), empty states (2.5) | TODO |
| **Phase 3** | Navigation + search (2.3), category pills (2.4), card redesign (2.2) | TODO |
| **Phase 4** | Mobile bottom nav (3.4), auth pages polish (3.3) | TODO |
| **Phase 5** | Listening history (4.1), episode queue (4.2) | TODO |
| **Phase 6** | PWA (4.3), performance (5.1, 5.2), settings (4.4) | TODO |

---

## Files Reference

| File | Lines | Role |
|---|---|---|
| `src/views/NavigationView.vue` | 431 | Main layout, sidebar, header, search, categories |
| `src/components/OffcanvasPlayer.vue` | ~305 | Audio player (rewritten) |
| `src/views/FeedsView.vue` | ~300 | Podcast browse/catalog |
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
