# Nuxt Migration Strategy

## Objective

Migrate the current Vue 3 + Vite SPA to Nuxt with a static-first target, preserving the existing Laravel 11 API integration and avoiding an unnecessary rewrite of stable domain logic.

Recommended approach:
- Phase 1: migrate to Nuxt with static generation via `npx nuxi generate`
- Phase 2: progressively adopt Nuxt-native routing, middleware, layouts, and SEO while keeping the deployment model static-friendly

This reduces delivery risk, aligns with the current shared-hosting style deployment, and avoids coupling the migration to a Node/Nitro hosting change.

---

## Current Migration Status

Branch in progress:
- `feat-nuxt-static-migration`

Relevant commits already completed:
- `852b499 feat: add nuxt static-first migration base`
- `0cb16a5 chore: define static policy for dynamic public routes`
- `0040189 refactor: move core public pages into nuxt pages`
- `2f0d308 refactor: inline music catalog pages into nuxt pages`
- `4afb579 refactor: inline auth and library pages into nuxt pages`
- `819b4ad refactor: inline music playlists pages into nuxt pages`
- `117cd48 refactor: inline admin dashboard page into nuxt page`

What is already done and verified:
- Nuxt static-first scaffolding is in place
- `dev` and `build` now point to Nuxt
- static generation is based on `npx nuxi generate`
- prerender strategy for known static public routes is active
- dynamic public routes such as podcast and album detail pages are explicitly treated as client-fetch static shell pages
- the default layout uses the migrated app shell
- legacy Vite bootstrap has been isolated as reference-only
- sitemap generation has been moved off the legacy router and aligned with shared route config

Build verification status:
- `npx nuxi generate` passes
- static output is generated in `.output/public`

Pages already migrated from thin wrappers to real Nuxt pages:
- `/`
- `/podcasts`
- `/music`
- `/music/albums`
- `/music/singles`
- `/categories`
- `/feed/[id]`
- `/episode/[id]`
- `/music/album/[id]`
- `/login`
- `/signup`
- `/forgot_password`
- `/reset_password/[token]`
- `/favourites`
- `/bookmarks`
- `/music/favorites`
- `/music/playlists`
- `/music/playlists/[id]`
- `/dashboard`

Pages still using `src/views/*` wrappers right now:
- `/about`
- `/documentation`
- `/privacy`
- `/terms`
- `/search-results`
- `/settings`
- `/now-playing`
- `/forbidden`
- catch-all `404`

Important clarification:
- several public pages were already router-cleaned and Nuxt-compatible before this status update, even if some of them are still temporarily wrapped from `src/views`
- the biggest remaining authenticated page is `settings`, and it should be treated as its own migration pass because it is materially larger than the average page

---

## Current Baseline

The current frontend is not a minimal SPA. It already includes:
- Vue 3 Composition API with many route-level views
- Pinia stores with persistence/session behavior
- Vue Router with auth and admin guards
- Centralized Axios service layer against a Laravel Sanctum backend
- Custom SEO layer with route metadata, JSON-LD builders, and generated static SEO assets
- A bot-oriented PHP crawler fallback for shared hosting
- Vite-based static build and FTPS deploy flow

This means the migration is feasible because the app already uses modern Vue patterns, but it is not just a package swap.

The target architecture should therefore be:
- Nuxt project
- static output generated with `npx nuxi generate`
- Laravel API kept external
- client-side authenticated behavior preserved
- selective prerendering of public routes where possible

Important implication:
- this is not an SSR-first migration
- authenticated and user-specific areas should be treated as client-driven pages inside a statically generated Nuxt app

---

## Target Build Mode

Primary deployment target:
- static generation using `npx nuxi generate`

Expected output model:
- prerendered public routes
- static assets emitted by Nuxt
- deployment to hosting compatible with static files and Apache routing rules

Implications:
- no requirement for a persistent Nuxt server runtime
- SSR-only benefits should not drive the first migration pass
- auth-protected areas will still depend on client-side session bootstrap against Laravel Sanctum
- dynamic podcast/music detail pages need explicit prerender policy or client fetch fallback, depending on whether all relevant paths can be known at build time

Recommended script direction:
- replace the current Vite build flow with a Nuxt generate flow
- adapt deploy to publish `.output/public` or the Nuxt static output directory chosen by the final config

---

## Suggested Nuxt Scaffolding

Based on the registry-oriented structure used in `codehelper`, the Nuxt migration should not simply mirror the current `src/views` layout 1:1. It should move toward a clearer split between:
- app shell
- pages
- registries/metadata
- reusable domain components
- API composables/services

Recommended top-level structure:

```text
.
├── app.vue
├── nuxt.config.ts
├── pages/
├── layouts/
├── middleware/
├── plugins/
├── components/
│   ├── music/
│   ├── podcast/
│   └── icons/
├── composables/
├── stores/
├── services/
├── utils/
│   ├── routeRegistry.ts
│   ├── seo/
│   │   ├── pageSeoRegistry.ts
│   │   ├── podcastSeoRegistry.ts
│   │   ├── musicSeoRegistry.ts
│   │   └── staticPagesRegistry.ts
│   └── adapters/
├── public/
├── scripts/
└── tests/
```

Recommended responsibility split:
- `pages/`: Nuxt route files only
- `layouts/`: app shell variants such as default layout and auth/account layout if needed
- `middleware/`: auth/admin/guest navigation rules
- `utils/routeRegistry.ts`: central route metadata map for labels, breadcrumbs, navigation visibility, and prerender decisions
- `utils/seo/*`: single source of truth for page SEO metadata, replacing the current scattered route-SEO coupling
- `services/`: current Axios-based API modules, reused in first pass
- `composables/`: player helpers, pagination, sidebar state, music genres, and SEO helpers

Registry-driven idea to borrow from `codehelper`:
- centralize metadata in typed registries
- let pages consume registries instead of hardcoding titles/descriptions in each page
- derive sitemap/prerender lists from the same registry where possible
- keep dynamic route behavior explicit instead of embedding it in many page files

---

## Migration Principles

- Do not rewrite business logic unless Nuxt requires it
- Reuse components, stores, composables, and API services wherever possible
- Separate framework migration from SEO/platform redesign
- Keep auth behavior stable during the first migration pass
- Preserve route URLs unless there is a strong SEO or product reason to change them
- Validate deploy constraints early, because hosting is one of the main risk factors

---

## Scope Decision Before Starting

Before implementation, confirm this migration target:

### Static-First Nuxt

Target:
- Nuxt app
- build generated with `npx nuxi generate`
- same external Laravel API
- public routes prerendered when practical
- authenticated routes handled as client-driven pages inside static output

Best when:
- hosting should remain close to the current model
- SEO should improve without introducing server hosting complexity
- the main goal is better structure, conventions, and future maintainability

Estimated effort:
- medium

Secondary future option:
- if static Nuxt later proves too limiting, the codebase can still evolve toward hybrid or server rendering

Recommended decision:
- optimize the migration for static generation first
- avoid designing phase 1 around Nitro server assumptions

---

## Phase 0: Discovery And Constraints

Goal:
- confirm technical constraints before touching implementation

Steps:
1. Inventory all current routes and classify them:
   - public static pages
   - public dynamic pages
   - authenticated pages
   - admin-only pages
2. Inventory all browser-only code:
   - `window`
   - `document`
   - `sessionStorage`
   - `localStorage`
   - MediaSession
   - direct audio element assumptions
3. Identify what must remain identical:
   - URL structure
   - login/session behavior
   - shared hosting deploy if non-negotiable
4. Decide Nuxt rendering mode per page family:
   - prerender/static
   - client-driven in static app
   - optional future SSR later
5. Verify hosting target:
   - static export only
   - Apache routing behavior after generated output
   - whether any future hybrid option matters now

Deliverables:
- route inventory
- browser-only code inventory
- deploy constraint decision
- prerender vs client-only page matrix

Main risk:
- starting implementation before resolving deploy constraints

---

## Phase 1: Scaffold Nuxt Without Rewriting Features

Goal:
- stand up a running Nuxt app with the minimum framework wiring in place

Steps:
1. Create a Nuxt application in a migration branch
2. Add baseline modules and config:
   - Pinia support
   - Tailwind support
   - aliases and runtime config
   - static generation configuration
3. Create `app.vue` as the new shell entry
4. Move global CSS into Nuxt entrypoints
5. Recreate environment variable usage through `runtimeConfig`
6. Port app-wide plugin registration:
   - `vuedraggable` if still needed globally
   - Axios bootstrapping if retained as-is
7. Add first-pass `nitro.prerender` or route rules strategy for known public routes
8. Make the app boot with a placeholder route structure

Deliverables:
- Nuxt app starts locally
- Tailwind and Pinia work
- environment configuration is mapped
- `npx nuxi generate` produces valid static output

Notes:
- this phase should not try to solve SEO or auth elegance
- the target is a stable skeleton

---

## Phase 2: Route Migration

Goal:
- replace manual Vue Router configuration with Nuxt pages and middleware

Steps:
1. Convert each current route into the `pages/` convention
2. Preserve existing paths exactly where possible
3. Introduce a central route registry for:
   - route labels
   - breadcrumb metadata
   - prerender eligibility
   - SEO key mapping
4. Map dynamic routes:
   - `/feed/:id`
   - `/episode/:id`
   - `/reset_password/:token`
   - `/music/album/:id`
   - `/music/playlists/:id`
5. Move route guarding logic out of router hooks and into Nuxt route middleware
6. Create middleware for:
   - auth-required pages
   - admin-only pages
   - guest-only redirects if needed
7. Recreate scroll behavior only if still required
8. Revalidate analytics page tracking after route changes

Deliverables:
- all main URLs available under Nuxt
- auth/admin access rules preserved
- no dependency on `src/router/index.js`
- route metadata no longer duplicated across pages

Main risk:
- route middleware running before auth state is initialized consistently

Current implementation status:
- largely completed for the main app surface
- core public routes, auth routes, music library routes, and key dynamic public routes have already been moved into `pages/`
- remaining route migration work is now concentrated in a smaller set of informational, search, admin, and settings pages

---

## Phase 3: State And App Bootstrap Migration

Goal:
- port application initialization logic into Nuxt-native patterns

Steps:
1. Move Pinia stores into the Nuxt app with minimal logic changes
2. Replace `main.js` bootstrap responsibilities with Nuxt plugins
3. Migrate unauthorized-session handling into a Nuxt plugin/composable pattern
4. Review persistence logic for SSR safety:
   - `sessionStorage`
   - `localStorage`
   - hydration timing
5. Guard browser-only store behavior with client checks
6. Validate that the player, queue, history, and auth stores hydrate correctly

Deliverables:
- stores work without direct `createApp` bootstrap
- no SSR/hydration crashes from browser APIs
- unauthorized redirects still behave correctly

Main risk:
- hidden browser assumptions inside stores and composables

---

## Phase 4: Service Layer And API Integration

Goal:
- keep backend communication stable while making it Nuxt-compatible

Steps:
1. Decide whether to keep Axios or move gradually to Nuxt `useFetch`/`$fetch`
2. For the first pass, keep the current service layer if it reduces migration cost
3. Rewire environment-based API base URL using Nuxt runtime config
4. Confirm Sanctum cookie flow in the Nuxt runtime:
   - credentials
   - CSRF handling
   - redirects after 401
5. Validate login, logout, current user bootstrap, password reset, settings, and admin flows
6. Mark auth-sensitive API usage as client-driven where static generation makes server fetches unnecessary

Deliverables:
- service layer operates under Nuxt
- Sanctum integration remains stable
- no accidental hydration/auth regressions in static output

Recommendation:
- do not rewrite all API access during the same phase as the framework migration

---

## Phase 5: Layouts, Views, And Component Reuse

Goal:
- move the UI progressively with minimal regression risk

Steps:
1. Convert `NavigationView` responsibilities into Nuxt layout structure where appropriate
2. Reuse existing view SFCs as page content whenever possible
3. Keep reusable components largely unchanged unless Nuxt exposes an actual problem
4. Review client-only components:
   - audio player
   - drag and drop
   - browser storage based widgets
5. Add client-only wrappers where needed instead of rewriting immediately
6. Verify mobile and desktop layout parity

Deliverables:
- app shell rendered through Nuxt layouts
- shared components remain functional
- player behavior preserved

Main risk:
- over-refactoring existing views during the move

Current implementation status:
- partially completed
- `NavigationView` is already being used through `layouts/default.vue`
- the most important page families no longer depend on thin view wrappers
- there is still temporary duplication because some legacy `src/views/*` files remain in place as reference and for not-yet-migrated routes

---

## Phase 6: SEO Re-architecture

Goal:
- replace custom SPA SEO workarounds with Nuxt-native metadata handling suitable for static generation

Steps:
1. Audit current SEO implementation:
   - route metadata registry
   - JSON-LD schema builders
   - static SEO JSON generation
   - PHP crawler fallback
2. Introduce registry-driven SEO files inspired by the `codehelper` pattern:
   - static pages registry
   - music pages registry
   - podcast pages registry
   - route-to-seo key mapping
3. Move page metadata to Nuxt head management APIs
4. Port JSON-LD generation to page-level or composable-level Nuxt usage
5. Decide page by page what should be:
   - prerendered with full metadata
   - client-driven with static shell metadata
6. Reduce or remove `crawler.php` only after validating generated HTML output from Nuxt
7. Rebuild sitemap and OG generation around the new registry structure

Deliverables:
- Nuxt-native SEO setup
- reduced dependence on SPA bot workarounds
- clearer ownership of page metadata

Main risk:
- trying to preserve the old SEO mechanism unchanged inside Nuxt

Important:
- this phase should be separate from the first working migration unless SEO is the primary business driver

Current implementation status:
- partially completed
- a shared static route registry and static page SEO registry already exist
- dynamic public pages already define an explicit static-shell policy
- the full cleanup of legacy SEO layers and old crawler-oriented fallbacks is still pending

---

## Phase 7: Build, Deploy, And Hosting Strategy

Goal:
- make the Nuxt build compatible with the real hosting environment

Steps:
1. Decide final deployment mode:
   - static output from `npx nuxi generate`
2. Replace Vite-only build assumptions
3. Update CI/CD pipeline from current FTPS static deploy flow to publish generated Nuxt static output
4. Validate exact output path and artifact structure used by the chosen Nuxt version/config
5. Rework `.htaccess` handling only if generated static output still needs Apache routing behavior
6. Test production-like authentication and deep links on the target environment

Deliverables:
- reproducible production build
- deployment path aligned with hosting reality
- no mismatch between local success and production capability

Highest-risk area:
- assuming Nuxt generate will automatically cover dynamic pages that actually depend on runtime-only identifiers

---

## Phase 8: Testing And Regression Hardening

Goal:
- prove feature parity before cutting over

Steps:
1. Keep existing Vitest store tests running
2. Add focused regression coverage for:
   - auth initialization
   - route middleware
   - player and queue persistence
   - history persistence
3. Run manual validation on high-risk user flows:
   - login/logout/session expiry
   - playing podcast episodes
   - music playback and playlists
   - bookmarks/favorites
   - admin dashboard access
4. Validate direct deep-link access for dynamic pages
5. Validate SEO output for the most important pages

Deliverables:
- migration acceptance checklist
- known regressions list if any remain

---

## Suggested Execution Order

Recommended implementation order:
1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 8 first-pass verification
8. Phase 6 SEO rework
9. Phase 7 final deploy alignment
10. Phase 8 final regression pass

Reasoning:
- first get a working Nuxt app
- then stabilize auth, routing, and core playback flows
- only after that revisit SEO and hosting strategy

---

## Remaining Work

Recommended next steps from the current branch state:
1. Migrate `pages/settings.vue` out of the wrapper and into a real Nuxt page
2. Decide whether to inline or leave wrapped the lower-risk informational pages:
   - `about`
   - `documentation`
   - `privacy`
   - `terms`
   - `forbidden`
   - `404`
3. Migrate `pages/search-results.vue`
4. Review whether `pages/now-playing.vue` should remain wrapper-based or be absorbed
5. Reassess whether the legacy files should remain as reference only or be retired:
   - `src/main.js`
   - `src/App.vue`
   - `src/router/index.js`
   - corresponding `src/views/*` already replaced by Nuxt pages
6. Do a dedicated SEO cleanup pass after page migration is complete
7. Do a final deploy/hardening pass around Apache/static hosting assumptions

What is intentionally not done yet:
- removing the old `src/views/*` layer completely
- deleting the legacy router/bootstrap files
- replacing the full old SEO stack
- changing hosting assumptions beyond static Nuxt output

Recommended milestone grouping from here:
- Milestone A: finish authenticated/admin wrapper migration
- Milestone B: finish remaining public wrapper cleanup
- Milestone C: retire or archive more of the legacy layer
- Milestone D: SEO and deploy hardening

---

## What Can Be Reused Almost As-Is

Likely reusable with limited changes:
- most components in `src/components`
- most stores in `src/stores`
- most composables in `src/composables`
- most API service files in `src/services`
- utility modules
- Tailwind design tokens and CSS

Likely to need adaptation:
- app bootstrap
- routing
- auth guards
- page-level SEO
- analytics route tracking
- browser-only persistence timing
- prerender route enumeration for public dynamic pages

Likely to need redesign:
- PHP crawler fallback
- static SEO JSON generation workflow
- build/deploy logic around `npx nuxi generate`

---

## Effort Estimate

### Low-risk pragmatic migration

Includes:
- Nuxt scaffold
- static generation setup
- pages migration
- middleware migration
- store/bootstrap adaptation
- service layer reuse
- limited SEO carryover

Expected effort:
- approximately 4 to 8 working days

### Full Nuxt-native migration

Includes:
- all of the above
- SEO redesign
- rendering strategy review
- deploy pipeline redesign
- possible hosting change work

Expected effort:
- approximately 1 to 3 weeks

These estimates assume:
- one developer already familiar with the codebase
- no major backend API changes
- no parallel redesign of UX or information architecture

---

## Recommended First Deliverable

Best first milestone:
- a Nuxt branch that serves the existing routes
- builds through `npx nuxi generate`
- uses the current Laravel API successfully
- preserves auth
- renders the main shell and player
- keeps most business logic unchanged

Only after this milestone:
- refine registry-driven SEO and prerender coverage for public dynamic pages

---

## Exit Criteria

The migration can be considered successful when:
- all current critical routes work under Nuxt
- auth and admin protections behave correctly
- player and persistence features remain stable
- production build matches hosting capabilities
- SEO strategy is explicit rather than dependent on legacy workarounds

---

## Concrete Scaffolding Checklist

This section keeps the practical scaffold in the same document, so the migration can be executed without creating a second strategy file.

### Step 1: Create The Nuxt Root

Files to introduce first:
- `app.vue`
- `nuxt.config.ts`
- `pages/index.vue`
- `layouts/default.vue`
- `plugins/axios.client.ts` or equivalent bootstrap plugin if Axios is retained

Initial objective:
- app boots
- Tailwind loads
- one page renders
- `npx nuxi generate` completes successfully

### Step 2: Introduce Core Folders

Target folders to standardize early:
- `pages/`
- `layouts/`
- `middleware/`
- `plugins/`
- `components/`
- `composables/`
- `stores/`
- `services/`
- `utils/`

Important rule:
- move only the framework-facing structure first
- do not reorganize every domain file at once

### Step 3: Minimal Registry Layer

To avoid scattering metadata, introduce a small registry layer from the start.

Recommended files:
- `utils/routeRegistry.ts`
- `utils/seo/pageSeoRegistry.ts`
- `utils/seo/staticPagesRegistry.ts`

Optional later if needed:
- `utils/seo/podcastSeoRegistry.ts`
- `utils/seo/musicSeoRegistry.ts`

Purpose:
- central route labels
- breadcrumb metadata
- navigation metadata
- prerender eligibility
- SEO key lookup

Rule:
- page metadata should be declared once in registries, then consumed by pages/composables

### Step 4: Route File Mapping

Suggested first-pass mapping from current views to Nuxt pages:

- `src/views/HomeView.vue` -> `pages/index.vue`
- `src/views/PodcastsView.vue` -> `pages/podcasts/index.vue`
- `src/views/FeedEpisodesView.vue` -> `pages/feed/[id].vue`
- `src/views/SingleEpisodeView.vue` -> `pages/episode/[id].vue`
- `src/views/SearchResultView.vue` -> `pages/search-results.vue`
- `src/views/LoginView.vue` -> `pages/login.vue`
- `src/views/SignUpView.vue` -> `pages/signup.vue`
- `src/views/ForgotPasswordView.vue` -> `pages/forgot_password.vue`
- `src/views/ResetPasswordView.vue` -> `pages/reset_password/[token].vue`
- `src/views/FavouritesView.vue` -> `pages/favourites.vue`
- `src/views/BookmarksView.vue` -> `pages/bookmarks.vue`
- `src/views/SettingsView.vue` -> `pages/settings.vue`
- `src/views/DashboardView.vue` -> `pages/dashboard.vue`
- `src/views/CategoriesView.vue` -> `pages/categories.vue`
- `src/views/MusicHomeView.vue` -> `pages/music/index.vue`
- `src/views/MusicAlbumsView.vue` -> `pages/music/albums.vue`
- `src/views/MusicSinglesView.vue` -> `pages/music/singles.vue`
- `src/views/MusicAlbumView.vue` -> `pages/music/album/[id].vue`
- `src/views/MusicFavoritesView.vue` -> `pages/music/favorites.vue`
- `src/views/MusicPlaylistsView.vue` -> `pages/music/playlists.vue`
- `src/views/MusicPlaylistDetailView.vue` -> `pages/music/playlists/[id].vue`
- `src/views/NowPlayingView.vue` -> `pages/now-playing.vue`
- `src/views/AboutView.vue` -> `pages/about.vue`
- `src/views/DocumentationView.vue` -> `pages/documentation.vue`
- `src/views/TermsView.vue` -> `pages/terms.vue`
- `src/views/PrivacyView.vue` -> `pages/privacy.vue`
- `src/views/ForbiddenView.vue` -> `pages/forbidden.vue`

Note:
- in the first pass, page files can be thin wrappers importing the existing view components
- this reduces migration risk and keeps refactoring incremental

### Step 5: Middleware Set

Recommended middleware files:
- `middleware/auth.ts`
- `middleware/admin.ts`
- `middleware/guest.ts`

Applied to pages via page meta instead of router guards.

First target behavior:
- protected routes redirect to `/login`
- admin routes validate role after auth bootstrap
- guest-only pages optionally redirect authenticated users away from login/signup

### Step 6: Layout Structure

Recommended initial layout design:
- `layouts/default.vue`: main shell with navigation, footer, cookie consent, player
- `layouts/auth.vue`: optional lighter layout for login/signup/reset flows only if useful

Pragmatic rule:
- if splitting auth layout adds friction, start with one default layout and separate later

### Step 7: Bootstrap Migration

Current `main.js` responsibilities should move into:
- Nuxt plugins
- layout shell
- composables

Likely split:
- app shell responsibilities -> `app.vue` and `layouts/default.vue`
- Axios/session handler bootstrap -> plugin
- auth initialization strategy -> plugin or top-level composable
- analytics hooks -> client plugin

### Step 8: Static Generation Decisions

Define explicitly which routes should be prerendered.

Likely prerender candidates:
- `/`
- `/about`
- `/documentation`
- `/terms`
- `/privacy`
- `/podcasts`
- `/categories`
- `/music`
- `/music/albums`
- `/music/singles`

Likely client-driven static pages:
- `/login`
- `/signup`
- `/forgot_password`
- `/reset_password/[token]`
- `/settings`
- `/dashboard`
- `/favourites`
- `/bookmarks`
- `/music/favorites`
- `/music/playlists`
- `/music/playlists/[id]`

Decision needed for dynamic public pages:
- `/feed/[id]`
- `/episode/[id]`
- `/music/album/[id]`

Current branch policy:
- keep these routes as `client-fetch static shell`
- explicitly exclude them from prerender
- rely on static hosting SPA fallback for direct entry
- preserve the option to introduce curated prerender later from a build-time path source

Future upgrade paths for these routes:
- prerender only a known curated subset
- generate from a build-time content list if obtainable
- keep static shell and fetch content client-side at runtime

### Step 9: Folder Migration Order

Recommended move order to keep risk low:
1. `src/components` -> `components`
2. `src/composables` -> `composables`
3. `src/stores` -> `stores`
4. `src/services` -> `services`
5. `src/utils` -> `utils`
6. `src/views` logic absorbed progressively into `pages`
7. `src/seo` refactored into `utils/seo` plus composables

Rule:
- migrate stable shared logic before page-by-page cleanup

### Step 10: First Working Milestone

The first milestone should be considered complete only when all of the following are true:
- Nuxt app boots locally
- default layout renders the current shell
- auth bootstrap still works
- player mounts without hydration errors
- public routes open correctly
- protected routes redirect correctly
- `npx nuxi generate` succeeds
- generated output is deployable on the current hosting model

Until this milestone is reached:
- do not spend time polishing final SEO abstractions
- do not over-refactor component internals
- do not redesign page UX
