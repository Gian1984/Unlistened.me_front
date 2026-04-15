# ToRead.me - Strategy

## Goal

Launch `toread.me` as a second product in the same ecosystem as `unlistened.me`, without duplicating user accounts or creating a second long-term backend to maintain.

The recommended direction is:
- keep one `Laravel` backend as the source of truth for users
- keep one shared `users` table
- add a separate `books` domain inside the existing backend
- keep `unlistened.me` and `toread.me` as separate frontend apps
- postpone a full cross-domain auth redesign until the books product is validated

This avoids the worst long-term outcome:
- two backends
- two auth systems
- two user databases
- two password reset flows
- painful account merging later

---

## Core Decision

Do not create a second fully separate Laravel backend for `toread.me`.

Instead:
- reuse the existing backend as the shared identity and data layer
- add a new module for books and reading progress
- treat books as a new product domain, not as a bolt-on hack inside music/podcasts

This keeps the ecosystem coherent while limiting short-term implementation risk.

---

## Product Model

`unlistened.me` and `toread.me` should behave like two products in one account ecosystem.

Shared:
- account
- email/password
- profile
- language/settings where useful
- future billing/pro plan if needed

Separated by domain:
- podcast history
- music history
- book reading progress
- music favorites/playlists
- book favorites/reading lists
- discovery and metadata logic

Rule:
- one user identity
- multiple content domains

---

## Recommended Architecture

### Backend

Keep the current backend as the central API platform.

Add a new `books` area with dedicated endpoints and storage, for example:
- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/books/search`
- `POST /api/books/favorites`
- `DELETE /api/books/favorites/:id`
- `POST /api/books/progress`
- `GET /api/books/progress/:id`
- `GET /api/books/library`

Possible data tables:
- `books`
- `book_authors`
- `book_favorites`
- `book_progress`
- `book_bookmarks`
- `book_lists` or `reading_lists`

Important:
- do not reuse music tables for books
- do not overload podcast/history logic with book-specific concerns
- give books their own domain model from day one

### Frontend

Use separate frontend apps:
- `unlistened.me` for podcasts/music/audio
- `toread.me` for books/reader experience

This is the cleanest UX separation while still sharing users underneath.

### External Book Sources

For the initial catalog, use public/open sources such as:
- `Project Gutenberg`
- `Open Library` for metadata enrichment where useful

Recommended backend pattern:
- your backend fetches/imports/caches metadata from third-party sources
- your frontend talks only to your backend
- user progress, favorites, bookmarks, and resume position live in your own database

Avoid:
- calling external book APIs directly from the frontend for core app logic
- binding reader state to external provider response formats

---

## Authentication Strategy

This is the main place where short-term pragmatism matters.

### What Not To Do First

Do not start by redesigning the whole auth system just to support multiple frontend domains immediately.

Why:
- it adds risk to the existing product
- it slows down books validation
- it mixes platform work with product work too early

### Short-Term Recommendation

Keep the current auth model stable for `unlistened.me`.

Build `toread.me` on the same backend user system, but accept that the cross-domain auth experience may need a later refinement if `unlistened.me` and `toread.me` remain on different root domains.

The priority is:
1. shared users
2. shared backend
3. validated books product
4. only then auth refinement

### Medium-Term Recommendation

Once `toread.me` is real and worth maintaining, choose one of these paths:

1. move both products under one parent domain
2. introduce token-based auth for both apps
3. build a small SSO layer on top of the shared backend

Preferred order:
- best operational simplicity: shared parent domain
- best cross-domain flexibility: token-based auth or SSO

Avoid trying to force fragile cookie sharing across completely separate root domains unless there is a clear reason.

---

## Phased Rollout

## Phase 1 - Validate The Books Domain

Goal:
- prove that the books experience is worth building before major platform auth work

Checklist:
- [ ] define the initial catalog source (`Project Gutenberg` first is enough)
- [ ] define the normalized book payload shape
- [ ] create `books` endpoints in the existing Laravel backend
- [ ] create tables for favorites, progress, bookmarks, and library state
- [ ] build a minimal Vue 3 frontend for browsing and reading
- [ ] support "resume where I left off"
- [ ] support "save to library" / "favorites"

Success criteria:
- a user can browse books
- open a book
- read in a web reader
- come back later and resume
- save favorites without a second account system

## Phase 2 - Stabilize Shared Account Use

Goal:
- make the shared user model explicit and reliable

Checklist:
- [ ] document account ownership: one account across products
- [ ] review shared user settings and which ones are product-specific
- [ ] define how logout/session-expiry should behave across products
- [ ] add clear backend boundaries between music/podcasts/books
- [ ] make sure book APIs cannot accidentally leak into existing music/podcast assumptions

Success criteria:
- one user account behaves consistently across both products
- domain data stays separated cleanly

## Phase 3 - Improve Cross-Domain Authentication

Goal:
- remove friction between `unlistened.me` and `toread.me`

Checklist:
- [ ] evaluate whether both products should live under one parent domain
- [ ] if not, design token-based auth or a lightweight SSO flow
- [ ] review Sanctum usage and where it is tightly coupled to the current frontend
- [ ] refactor auth bootstrap to be more platform-oriented if needed
- [ ] test login, logout, refresh, and protected route behavior on both apps

Success criteria:
- the auth system supports the multi-product ecosystem intentionally, not accidentally

---

## Data Modeling Principles

Use a normalized internal shape for books so external provider changes do not leak into the app.

Suggested book fields:
- `source`
- `source_id`
- `title`
- `author`
- `language`
- `cover_url`
- `description`
- `categories`
- `formats`
- `web_reader_url`
- `epub_url`
- `text_url`
- `audio_url` if ever available
- `public_domain`
- `license`

Suggested user-state fields:
- `user_id`
- `book_id`
- `progress_percent`
- `locator` or chapter/position marker
- `last_opened_at`
- `is_completed`
- `is_favorite`

Important:
- progress for reading should not be forced into the same model as podcast/music playback progress
- the concepts overlap, but the underlying UX is different

---

## Why This Is Better Than A Separate Backend

If you create a separate backend now, you gain speed only briefly.

What you lose later:
- unified users
- easy cross-promotion
- shared settings/account management
- one admin model
- one recovery flow
- one future subscription model

What you gain with the shared-backend approach:
- one account ecosystem
- less duplication
- easier long-term platform growth
- room for books, audio, and future products to coexist

---

## Risks And Constraints

### Risk 1 - Auth complexity across domains

Reality:
- `unlistened.me` and `toread.me` being different root domains complicates session sharing

Response:
- do not solve this first
- solve it after the books product is validated

### Risk 2 - Trying to unify too much too early

Reality:
- books are not podcasts and not music

Response:
- unify identity
- separate domain models

### Risk 3 - External catalog dependence

Reality:
- third-party metadata can be inconsistent

Response:
- cache and normalize data in your backend
- keep your frontend independent from raw external schemas

---

## Recommended Immediate Next Steps

1. confirm that `toread.me` is part of the same ecosystem as `unlistened.me`
2. decide the first external catalog source
3. design the internal `books` API shape before building the frontend
4. create the Laravel tables for book progress and favorites
5. build the first minimal reader flow before touching auth architecture

---

## Final Recommendation

Build `toread.me` on top of the existing Laravel backend.

Do not create a second user system.

Do not rush a full auth migration before the books product exists.

The right order is:
1. shared backend and shared users
2. separate `books` domain
3. validate the reader product
4. improve cross-domain auth only when it becomes worth the effort
