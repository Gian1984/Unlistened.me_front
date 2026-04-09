# Jamendo Integration Strategy — Unlistened.me

## What is Jamendo?

Jamendo (jamendo.com) is a music distribution platform hosting **Creative Commons–licensed music** — legally free to stream, embed, and use in apps. Their public API provides:

- Search by artist, album, track, genre, tag
- Track streaming URLs (128 kbps MP3, free, no token required for basic streaming)
- Artist/album metadata, cover art
- Trending / top charts
- Radio streams (curated genre channels)
- Playlists

**This is fundamentally different from PodcastIndex.** Unlistened.me currently handles only podcasts (spoken audio). Adding Jamendo means adding a second content category: **music**.

---

## Licensing

Jamendo music is licensed under Creative Commons (CC BY, CC BY-SA, CC BY-NC, CC BY-ND variants). Streaming in a web app for free, non-commercial use is permitted. If the app ever monetises (ads, subscriptions), some CC-NC tracks would require a commercial licence from Jamendo (Jamendo Licensing). Always display attribution (artist name, track title, "via Jamendo") as required by CC.

---

## API Overview

**Base URL:** `https://api.jamendo.com/v3.0`

**Authentication:** `client_id` query parameter (free developer account at developer.jamendo.com). No OAuth needed for read-only endpoints.

### Key Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /tracks` | Search/browse tracks — by name, artist, genre, tags, date |
| `GET /albums` | Browse albums |
| `GET /artists` | Browse artists |
| `GET /playlists` | Community playlists |
| `GET /radios` | Genre radio stations (streaming) |
| `GET /tracks/file` | Get streaming URL for a track |
| `GET /tracks/similar` | Similar tracks (recommendation) |

**Track object (key fields):**
```json
{
  "id": "1234567",
  "name": "Track Name",
  "artist_name": "Artist Name",
  "album_name": "Album Name",
  "album_image": "https://usercontent.jamendo.com/.../cover200.jpg",
  "audio": "https://mp3d.jamendo.com/?trackid=1234567&format=mp32",
  "audiodownload": "https://mp3d.jamendo.com/?trackid=1234567&format=mp32&from=app-devsite",
  "duration": 243,
  "genre": "Electronic",
  "tags": ["ambient", "chill"],
  "license_ccurl": "https://creativecommons.org/licenses/by-nc-sa/3.0/",
  "shareurl": "https://www.jamendo.com/track/1234567"
}
```

The `audio` field is a **direct streamable MP3 URL** — it can be dropped straight into the existing `<audio>` element in `OffcanvasPlayer.vue`.

---

## Architecture Decision: Direct vs. Proxied

### Option A — Direct frontend calls to Jamendo API

```
Vue app → api.jamendo.com
```

**Pros:** No backend changes, instant to prototype.
**Cons:** Exposes `client_id` in browser, no rate-limit control, can't add user-specific features (Jamendo favourites tied to Unlistened user), harder to cache server-side.

### Option B — Proxy through Laravel backend ✅ Recommended

```
Vue app → api.unlistened.me/api/music/* → api.jamendo.com
```

**Pros:**
- `client_id` stays secret
- Can merge Jamendo results with user data (favourites, bookmarks stored in our DB)
- Can cache at backend level (Redis/database)
- Consistent API shape — frontend uses the same axios instance
- Can add analytics (track plays from Jamendo content like we do for podcasts)

**Cons:** More backend work upfront.

---

## Backend Changes Required (Laravel)

> **Note:** The local repo at `/Users/gianlucainsideweb/Projects/Unlistened.me_rest` may be behind the VPS. The changes below should be applied directly on the VPS first and then synced back.

### 1. New environment variable

```env
JAMENDO_CLIENT_ID=your_client_id_here
```

### 2. New service class: `app/Services/JamendoService.php`

```php
<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class JamendoService
{
    private string $baseUrl = 'https://api.jamendo.com/v3.0';
    private string $clientId;

    public function __construct()
    {
        $this->clientId = config('services.jamendo.client_id');
    }

    private function get(string $endpoint, array $params = []): array
    {
        $response = Http::get("{$this->baseUrl}/{$endpoint}", array_merge([
            'client_id' => $this->clientId,
            'format'    => 'json',
        ], $params));

        return $response->json();
    }

    public function searchTracks(string $query, int $limit = 20, int $offset = 0): array
    {
        return $this->get('tracks', [
            'namesearch' => $query,
            'limit'      => $limit,
            'offset'     => $offset,
            'include'    => 'musicinfo',
            'audioformat' => 'mp32',
        ]);
    }

    public function getTrendingTracks(string $genre = '', int $limit = 20): array
    {
        return $this->get('tracks', [
            'order'      => 'popularity_week',
            'tags'       => $genre,
            'limit'      => $limit,
            'include'    => 'musicinfo',
            'audioformat' => 'mp32',
        ]);
    }

    public function getTrack(string $id): array
    {
        return $this->get('tracks', ['id' => $id, 'include' => 'musicinfo', 'audioformat' => 'mp32']);
    }

    public function getAlbum(string $id): array
    {
        return $this->get('albums', ['id' => $id, 'include' => 'musicinfo tracks']);
    }

    public function getArtist(string $id): array
    {
        return $this->get('artists', ['id' => $id, 'include' => 'musicinfo']);
    }

    public function searchByGenre(string $genre, int $limit = 20, int $offset = 0): array
    {
        return $this->get('tracks', [
            'tags'        => $genre,
            'order'       => 'popularity_week',
            'limit'       => $limit,
            'offset'      => $offset,
            'audioformat' => 'mp32',
        ]);
    }

    public function getRadios(): array
    {
        return $this->get('radios', ['type' => 'editorial']);
    }

    public function getSimilarTracks(string $id, int $limit = 10): array
    {
        return $this->get('tracks/similar', ['id' => $id, 'limit' => $limit, 'audioformat' => 'mp32']);
    }
}
```

### 3. New controller: `app/Http/Controllers/MusicController.php`

```php
<?php
namespace App\Http\Controllers;

use App\Services\JamendoService;
use Illuminate\Http\Request;

class MusicController extends Controller
{
    public function __construct(private JamendoService $jamendo) {}

    public function trending()
    {
        return response()->json($this->jamendo->getTrendingTracks());
    }

    public function search(Request $request)
    {
        $q = $request->query('q', '');
        $genre = $request->query('genre', '');
        $offset = (int) $request->query('offset', 0);

        if ($genre) {
            return response()->json($this->jamendo->searchByGenre($genre, 20, $offset));
        }
        return response()->json($this->jamendo->searchTracks($q, 20, $offset));
    }

    public function track(string $id)
    {
        return response()->json($this->jamendo->getTrack($id));
    }

    public function album(string $id)
    {
        return response()->json($this->jamendo->getAlbum($id));
    }

    public function artist(string $id)
    {
        return response()->json($this->jamendo->getArtist($id));
    }

    public function radios()
    {
        return response()->json($this->jamendo->getRadios());
    }

    public function similar(string $id)
    {
        return response()->json($this->jamendo->getSimilarTracks($id));
    }
}
```

### 4. Routes in `routes/api.php` — LIVE ✅

All routes are live on `api.unlistened.me`. Tested and working as of 2026-04-09.

```php
// Music (Jamendo) — public, no auth required
Route::prefix('music')->group(function () {
    Route::get('/trending',            [MusicController::class, 'trending']);   // ?limit=20&genre=
    Route::get('/search',              [MusicController::class, 'search']);     // ?q=&genre=&offset=
    Route::get('/radios',              [MusicController::class, 'radios']);
    Route::get('/track/{id}',          [MusicController::class, 'track']);
    Route::get('/track/{id}/similar',  [MusicController::class, 'similar']);
    Route::get('/album/{id}',          [MusicController::class, 'album']);
    Route::get('/artist/{id}',         [MusicController::class, 'artist']);
});

// Music — auth required (Laravel Sanctum Bearer token)
Route::middleware('auth:sanctum')->prefix('music')->group(function () {
    // Favorites
    Route::get('/favorites',                          [MusicFavoriteController::class, 'index']);
    Route::post('/favorites',                         [MusicFavoriteController::class, 'store']);
    Route::delete('/favorites/{trackId}',             [MusicFavoriteController::class, 'destroy']);
    Route::get('/favorites/{trackId}/check',          [MusicFavoriteController::class, 'check']);
    // Playlists
    Route::get('/playlists',                          [MusicPlaylistController::class, 'index']);
    Route::post('/playlists',                         [MusicPlaylistController::class, 'store']);
    Route::get('/playlists/{id}',                     [MusicPlaylistController::class, 'show']);
    Route::put('/playlists/{id}',                     [MusicPlaylistController::class, 'update']);
    Route::delete('/playlists/{id}',                  [MusicPlaylistController::class, 'destroy']);
    Route::post('/playlists/{id}/tracks',             [MusicPlaylistController::class, 'addTrack']);
    Route::delete('/playlists/{id}/tracks/{trackId}', [MusicPlaylistController::class, 'removeTrack']);
    Route::put('/playlists/{id}/reorder',             [MusicPlaylistController::class, 'reorder']);
});
```

#### Riferimento rapido — tutte le route live

| Method | Path | Auth | Descrizione |
|---|---|---|---|
| GET | `/api/music/trending` | No | Trending tracks (param: `limit`, `genre`) |
| GET | `/api/music/search` | No | Ricerca (param: `q`, `genre`, `offset`) |
| GET | `/api/music/radios` | No | Radio editoriali Jamendo |
| GET | `/api/music/track/{id}` | No | Dettaglio singola traccia |
| GET | `/api/music/track/{id}/similar` | No | Tracce simili |
| GET | `/api/music/album/{id}` | No | Dettaglio album con tracklist |
| GET | `/api/music/artist/{id}` | No | Dettaglio artista |
| GET | `/api/music/favorites` | Sanctum | Lista preferiti musicali utente |
| POST | `/api/music/favorites` | Sanctum | Aggiungi traccia ai preferiti |
| DELETE | `/api/music/favorites/{trackId}` | Sanctum | Rimuovi dai preferiti |
| GET | `/api/music/favorites/{trackId}/check` | Sanctum | Controlla se traccia è nei preferiti |
| GET | `/api/music/playlists` | Sanctum | Lista playlist utente |
| POST | `/api/music/playlists` | Sanctum | Crea playlist (body: `name`, `description`) |
| GET | `/api/music/playlists/{id}` | Sanctum | Dettaglio playlist con tracce |
| PUT | `/api/music/playlists/{id}` | Sanctum | Rinomina/modifica playlist |
| DELETE | `/api/music/playlists/{id}` | Sanctum | Elimina playlist |
| POST | `/api/music/playlists/{id}/tracks` | Sanctum | Aggiungi traccia a playlist |
| DELETE | `/api/music/playlists/{id}/tracks/{trackId}` | Sanctum | Rimuovi traccia da playlist |
| PUT | `/api/music/playlists/{id}/reorder` | Sanctum | Riordina tracce (body: `tracks[]`) |

### 5. Database tables — LIVE ✅

Three tables are deployed and migrated on the production VPS as of 2026-04-09. The frontend can rely on this schema today.

**Table `music_favorites`** — flat list of liked tracks per user (Spotify "Liked Songs").

```php
Schema::create('music_favorites', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('jamendo_track_id');
    $table->string('title');
    $table->string('artist_name');
    $table->string('artist_id');
    $table->string('album_name')->nullable();
    $table->string('album_image')->nullable();
    $table->string('audio_url');
    $table->integer('duration')->default(0);
    $table->string('license_ccurl')->nullable();
    $table->string('shareurl')->nullable();
    $table->timestamps();
    $table->unique(['user_id', 'jamendo_track_id']);
});
```

**Table `music_playlists`** — user-created named collections.

```php
Schema::create('music_playlists', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('description')->nullable();
    $table->timestamps();
});
```

**Table `music_playlist_tracks`** — positioned tracks inside a playlist.

```php
Schema::create('music_playlist_tracks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('playlist_id')->constrained('music_playlists')->cascadeOnDelete();
    $table->string('jamendo_track_id');
    $table->string('title');
    $table->string('artist_name');
    $table->string('artist_id');
    $table->string('album_image')->nullable();
    $table->string('audio_url');
    $table->integer('duration')->default(0);
    $table->string('license_ccurl')->nullable();
    $table->integer('position')->default(0);
    $table->timestamps();
    $table->unique(['playlist_id', 'jamendo_track_id']);
});
```

**Why two separate concepts (favorites vs playlists), unlike podcasts:**
- Podcasts use `favorites` + free-form `section` strings, because users tend to *organise* a small bookmarked list.
- Music users *consume* large libraries and benefit from the Spotify model: one global "Liked songs" list (`music_favorites`) plus named, ordered, reorderable collections (`music_playlists` + `music_playlist_tracks`).
- The playlist tracks table denormalises track metadata so that playlists keep working even if a track is later removed from Jamendo. The CC license URL is stored too — required to honour attribution offline.

### 6. `config/services.php`

```php
'jamendo' => [
    'client_id' => env('JAMENDO_CLIENT_ID'),
],
```

---

## Frontend Strategy (Vue 3) — Spotify-like, integrated with the podcast app

The goal is **one product, two content types**. The user should never feel they're crossing a border between "podcasts" and "music"; the same player, the same library page, the same search results page handle both. Music adapts the UX expectations of Spotify (Liked songs, named playlists, queue, now playing with attribution always visible) while staying inside the existing dark theme and the existing components.

### Guiding principles

1. **Reuse, don't fork.** The single `<OffcanvasPlayer>` plays everything. The single `playerStore` holds whatever is currently playing. The single `historyStore` tracks every play. Differences are expressed via a `contentType` discriminator on each item, not via parallel components.
2. **Author and license are non-negotiable.** Every UI surface that shows a Jamendo track displays the artist name and a license badge. No exceptions. Removing the artist or hiding the license is a CC violation.
3. **Library is unified, taxonomy is per-content-type.** The sidebar "Library" section lists Favourites (podcast feeds), Bookmarks (podcast episodes), Liked songs (music tracks), and Playlists (music). Same dark cards, same drag/drop pattern already used for podcast favourites.
4. **Search is unified.** The header search bar searches both PodcastIndex and Jamendo in parallel. Results land on a single page with two tabs (Podcasts | Music) and a counter on each.
5. **Spotify-style queue.** Music gets a real "play next / add to queue / autoplay similar" mechanic via a new `queueStore`. Podcasts can opt in later (out of scope for v1).

### Phase 2 — Library architecture as shipped — DONE ✅

The favorites + playlists layer is built around **one Pinia store** that owns all library state, and **two reusable button components** that read/write through it. Every track surface in the app — list rows, the player, the playlist detail page — uses the same components and gets identical behaviour for free.

#### `src/stores/musicLibraryStore.js`

Single source of truth for the user's Jamendo library. Key design choices:

- **Two parallel state buckets**: `favorites: []` (full backend rows) + `favoriteIds: Set<string>` (just the Jamendo IDs). The Set is what `isFavorite(trackId)` reads, so heart icons re-render in O(1) without scanning the array.
- **Lazy hydration, cached.** `loadFavorites()` and `loadPlaylists()` are no-ops once `favoritesLoaded`/`playlistsLoaded` flip. `MusicHomeView` calls them on mount only when authenticated; ospite users stay on the public path with no API call.
- **Optimistic add/remove with rollback.** `addFavorite` synchronously inserts an `_optimistic: true` row and adds the id to the Set, then awaits the POST. On success it swaps the optimistic row with the real one if the backend returns it; on failure it removes the id from the Set and restores the previous array. `removeFavorite` mirrors this. The user sees the heart fill/empty instantly.
- **Shape normalisation.** `addFavorite(track)` accepts either a raw Jamendo track (`.id`, `.name`, `.audio`, ...) or a backend row (`.jamendo_track_id`, `.title`, `.audio_url`, ...) — the store does the mapping to the backend column names. This is what lets `FavoriteMusicButton` work everywhere without callers having to convert shapes.
- **Playlist mutators bump local counters.** `addTrackToPlaylist` increments `tracks_count` on the matching playlist in the array. The `MusicPlaylistsView` grid reflects the new count without a refetch.
- **`reset()`** is exposed for the eventual logout hook (clears both buckets and the loaded flags).

Public surface:

```js
const library = useMusicLibraryStore()

// state
library.favorites          // ref<Array> — backend rows
library.favoriteIds        // ref<Set<string>>
library.playlists          // ref<Array>
library.favoritesLoading   // ref<boolean>
library.playlistsLoading   // ref<boolean>

// getters
library.isFavorite(trackId)
library.favoritesCount
library.playlistsCount

// favorites
library.loadFavorites(force = false)
library.toggleFavorite(track)              // returns true if added, false if removed
library.addFavorite(track)
library.removeFavorite(trackId)

// playlists
library.loadPlaylists(force = false)
library.createPlaylist(name, description = '')
library.renamePlaylist(id, name, description)
library.deletePlaylist(id)
library.addTrackToPlaylist(playlistId, track)
library.removeTrackFromPlaylist(playlistId, trackId)

library.reset()                            // logout hook
```

#### `src/components/music/FavoriteMusicButton.vue`

Heart icon toggle. Auth gating built in: ospite users get a `messageStore` notice + redirect to `/login`. Spans `<button>` with `@click.stop` so it never triggers the parent row click. Sizes: `xs` (h-7), `sm` (h-8), `md` (h-9). Color states: pink-400 when liked, gray-500 → pink-400 on hover when unliked. Uses outline + solid heart icons.

#### `src/components/music/AddToPlaylistMenu.vue`

Headless UI `Menu` dropdown. Lazy-loads the playlist list on first open via `library.loadPlaylists()`. Inline "New playlist" form (input + Create/Cancel) inside the dropdown so the user can create-and-add in one flow without navigating away. Same auth gating + `@click.stop` as the heart button. Truncates the playlist name in each `MenuItem` and shows `tracks_count` if the backend exposes it.

#### `src/views/MusicFavoritesView.vue`

Single virtual playlist of all `music_favorites`, rendered as the same row layout as `MusicHomeView` so users feel at home: index, cover with hover-play overlay, title + artist + license badge, duration, then per-row `AddToPlaylistMenu` + delete trash button. Empty state via `EmptyState` with link back to `/music`. SEO `musicFavoritesSeo` is `noIndex: true`.

#### `src/views/MusicPlaylistsView.vue`

Hub. Top of page is a "Create a new playlist" card with name input + create button. Below: responsive grid of cards (`sm:grid-cols-2 lg:grid-cols-3`) — each card shows `ListBulletIcon`, name, description, `tracks_count`, an open arrow that routes to `MusicPlaylistDetail`, and a trash button (with `confirm()` guard). Empty state via `EmptyState`. SEO `musicPlaylistsSeo` is `noIndex: true`.

#### `src/views/MusicPlaylistDetailView.vue`

Single playlist detail. Header has the icon tile, breadcrumb back link, name (with inline rename — pencil icon → input + check/cancel), description, track counter, "Play" button (sets the player to track #1), and a "Delete" button. Body is the same row layout as the favorites view, with per-row `FavoriteMusicButton` + remove-from-playlist trash. Loads via `musicService.getPlaylist(id)` directly (full hydrate including the embedded `tracks` array) instead of going through the store, since the store only caches the playlist *list*, not the per-playlist tracklists.

#### Wire-in points

- **`MusicHomeView`**: each track row now ends with `<FavoriteMusicButton :track />` + `<AddToPlaylistMenu :track />`. `onMounted` also calls `library.loadFavorites()` and `library.loadPlaylists()` if authenticated, so heart icons render the right state from the first paint.
- **`OffcanvasPlayer`**: a `currentMusicTrack` computed maps the player's normalized episode payload back to the raw Jamendo shape, and `<FavoriteMusicButton :track="currentMusicTrack" />` is rendered next to the time display when `playerStore.isMusic`. Liking from the player updates the Set, and any other heart in the app (the row that started the play, the favorites view if open) re-renders.
- **`NavigationView` Library section**: extended with `Music favorites` (`/music/favorites`, `HeartIcon`) and `Music playlists` (`/music/playlists`, `ListBulletIcon`). Same dark card style as the existing Favourites/Bookmarks rows.
- **Routes**: `/music/favorites`, `/music/playlists`, `/music/playlists/:id` — all `meta: { requiresAuth: true }`.

#### What's intentionally NOT in Phase 2

- **Drag-to-reorder** inside a playlist (the `reorderPlaylist` endpoint is wired in the service but no UI yet — track #14b in the implementation order).
- **Per-playlist track caching** in the store. Each `MusicPlaylistDetailView` mount fetches its own tracklist from the API. We can revisit if traffic warrants it.
- **`musicService.checkFavorite(id)`**: not used. The store's `favoriteIds` Set already answers the question without an extra round trip; the endpoint stays in the service for future direct-link / SSR scenarios.
- **`JamendoAttribution.vue` wrapper**: skipped. `LicenseBadge` is embedded directly inline in track rows and the player, which is enough attribution and saves a layer of indirection. We'll add the wrapper if and when track/album/artist deep pages need a richer attribution block.

### 1. Service layer — DONE ✅

`src/services/musicService.js` already exists and wraps every live endpoint:

```js
import api from './api.js'

export const musicService = {
  // Public, no auth
  getTrending:  (limit = 20, genre = '') => api.get('/music/trending', { params: { limit, genre } }),
  search:       (q, genre = '', offset = 0) => api.get('/music/search',  { params: { q, genre, offset } }),
  getTrack:     (id)                         => api.get(`/music/track/${id}`),
  getSimilar:   (id)                         => api.get(`/music/track/${id}/similar`),
  getAlbum:     (id)                         => api.get(`/music/album/${id}`),
  getArtist:    (id)                         => api.get(`/music/artist/${id}`),
  getRadios:    ()                           => api.get('/music/radios'),

  // Favorites (auth required, Sanctum bearer)
  getFavorites:    ()         => api.get('/music/favorites'),
  addFavorite:     (track)    => api.post('/music/favorites', track),
  removeFavorite:  (trackId)  => api.delete(`/music/favorites/${trackId}`),
  checkFavorite:   (trackId)  => api.get(`/music/favorites/${trackId}/check`),

  // Playlists (auth required)
  getPlaylists:           ()                  => api.get('/music/playlists'),
  createPlaylist:         (data)              => api.post('/music/playlists', data),
  getPlaylist:            (id)                => api.get(`/music/playlists/${id}`),
  updatePlaylist:         (id, data)          => api.put(`/music/playlists/${id}`, data),
  deletePlaylist:         (id)                => api.delete(`/music/playlists/${id}`),
  addTrackToPlaylist:     (id, track)         => api.post(`/music/playlists/${id}/tracks`, track),
  removeTrackFromPlaylist:(id, trackId)       => api.delete(`/music/playlists/${id}/tracks/${trackId}`),
  reorderPlaylist:        (id, tracks)        => api.put(`/music/playlists/${id}/reorder`, { tracks }),
}
```

When sending track payloads to `addFavorite` or `addTrackToPlaylist`, include **all** fields the controller validates against (`jamendo_track_id`, `title`, `artist_name`, `artist_id`, `audio_url`) plus the optional but strongly recommended ones (`album_name`, `album_image`, `duration`, `license_ccurl`, `shareurl`). The license URL is what powers the attribution badge — never drop it.

### 2. Player store: one player, two content types

`src/stores/playerStore.js` becomes the single source of truth for whatever is playing, regardless of content type. Add a `contentType` field and helper getters; do not split into `musicPlayerStore`.

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const currentItem = ref(null)   // renamed from currentEpisode for honesty
  const isVisible = ref(false)

  function play(item) {
    currentItem.value = {
      ...item,
      contentType: item.contentType || 'podcast', // 'podcast' | 'music'
    }
    isVisible.value = true
  }
  function close() {
    isVisible.value = false
    currentItem.value = null
  }

  const isMusic   = computed(() => currentItem.value?.contentType === 'music')
  const isPodcast = computed(() => currentItem.value?.contentType === 'podcast')

  // Backwards compat: keep currentEpisode as an alias so existing podcast code keeps working.
  const currentEpisode = currentItem

  return { currentItem, currentEpisode, isVisible, play, close, isMusic, isPodcast }
})
```

When the music side calls `play()`, it must build a payload that `OffcanvasPlayer` can already consume:

```js
playerStore.play({
  contentType: 'music',
  id:           track.id,            // jamendo id, kept as a string
  title:        track.name,
  enclosureUrl: track.audio,         // mapped from Jamendo's `audio` field
  image:        track.album_image,
  feedTitle:    track.artist_name,   // reused as the secondary line
  artistId:     track.artist_id,
  albumName:    track.album_name,
  licenseUrl:   track.license_ccurl,
  shareUrl:     track.shareurl,
  duration:     track.duration,
})
```

The mapping `feedTitle = artist_name` lets `<OffcanvasPlayer>` show artist as the secondary line for free, with no template changes — it already renders `currentEpisode.feedTitle`. Album, license and share URL are new fields the player will conditionally render (see below).

### 3. `OffcanvasPlayer.vue` adaptations

The existing component at `src/components/OffcanvasPlayer.vue` already plays any URL set in `enclosureUrl`. Required changes:

- **Icon swap**: when `playerStore.isMusic` show `MusicalNoteIcon` (already imported as the fallback). When podcast keep the cover or fallback as today.
- **Attribution row**: directly under the secondary line (artist), render an inline `<LicenseBadge>` plus a small "via Jamendo" link to `currentItem.shareUrl`. This row only appears when `isMusic === true`.
- **Speed control**: hide for music (`v-if="playerStore.isPodcast"` on the speed button). Cycling speed on a song is a podcast convention, not a music one.
- **Skip controls**: keep the same ±15/±30 buttons; but for music, also expose **previous track / next track** when a queue is active (see queue store below). The icons `BackwardIcon` / `ForwardIcon` already exist.
- **History tracking**: keep calling `historyStore.recordPlay(item)` regardless of type — the store learns the discriminator (see point 5).
- **Analytics call**: `trackPlay()` already gates on `episode.id && episode.title`. Add a branch: if music, call a future `musicService.trackPlay()` instead of `podcastService.trackPlay()`. For now it can be a no-op so the player ships before backend analytics for music exist.

No structural changes to the audio element, the seek logic, the MediaSession code, or the visibilitychange fix shipped earlier — all of that benefits music for free.

### 4. Queue store (Spotify-style "Play next" / "Add to queue")

New file `src/stores/queueStore.js`. Only needed for music in v1.

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQueueStore = defineStore('queue', () => {
  const items = ref([])      // upcoming tracks
  const history = ref([])    // played tracks (for "previous")

  function setQueue(tracks, startIndex = 0) {
    items.value = tracks.slice(startIndex + 1)
    history.value = tracks.slice(0, startIndex)
  }
  function addToQueue(track)   { items.value.push(track) }
  function playNext(track)     { items.value.unshift(track) }
  function consumeNext()       { return items.value.shift() || null }
  function pushHistory(track)  { history.value.push(track) }
  function popPrevious()       { return history.value.pop() || null }
  function clear()             { items.value = []; history.value = [] }

  const hasNext     = computed(() => items.value.length > 0)
  const hasPrevious = computed(() => history.value.length > 0)
  return { items, history, setQueue, addToQueue, playNext, consumeNext, pushHistory, popPrevious, clear, hasNext, hasPrevious }
})
```

`OffcanvasPlayer.vue`'s `onEnded` handler, when `playerStore.isMusic`, calls `queueStore.consumeNext()` and feeds the next track to `playerStore.play()` for autoplay. When the queue is empty, fall back to `musicService.getSimilar(currentId)` to keep the listening session alive (Spotify-style autoplay).

### 5. History store: extend to two content types

`src/stores/historyStore.js` already powers "Continue listening" on `HomeView`. Extend it with a `type` field on every entry:

```js
historyStore.recordPlay({ ...item, type: item.contentType || 'podcast' })
```

`continueListening` becomes a getter that returns mixed entries; the `HomeView` "Continue listening" rail then renders both podcast covers and music tracks side by side. Each entry uses an icon badge in the corner: musical note for music, podcast icon for podcasts. Resume behavior is identical (seek to last position, play).

For music-specific history (e.g. a "Recently played tracks" rail on the Music home), filter the same store: `historyStore.continueListening.filter(e => e.type === 'music')`.

### 6. Routes

```js
// src/router/index.js
{ path: '/music',              name: 'Music',         component: () => import('@/views/MusicHomeView.vue') },
{ path: '/music/search',       name: 'MusicSearch',   component: () => import('@/views/MusicSearchView.vue') },
{ path: '/music/track/:id',    name: 'MusicTrack',    component: () => import('@/views/MusicTrackView.vue') },
{ path: '/music/album/:id',    name: 'MusicAlbum',    component: () => import('@/views/MusicAlbumView.vue') },
{ path: '/music/artist/:id',   name: 'MusicArtist',   component: () => import('@/views/MusicArtistView.vue') },
{ path: '/music/radios',       name: 'MusicRadios',   component: () => import('@/views/MusicRadiosView.vue') },
{ path: '/music/liked',        name: 'MusicLiked',    component: () => import('@/views/MusicLikedView.vue'),     meta: { requiresAuth: true } },
{ path: '/music/playlists',    name: 'MusicPlaylists',component: () => import('@/views/MusicPlaylistsView.vue'), meta: { requiresAuth: true } },
{ path: '/music/playlist/:id', name: 'MusicPlaylist', component: () => import('@/views/MusicPlaylistView.vue'),  meta: { requiresAuth: true } },
```

All music routes are lazy-loaded so the podcast bundle stays small for users who never touch music.

### 7. Views to create

| View | Content | Key elements |
|---|---|---|
| `MusicHomeView.vue` | Music landing | Hero text, "Continue listening (music)" rail, trending tracks grid, genre filter pills, featured radios row, "Made for you" placeholder for v2 |
| `MusicSearchView.vue` | Music-only search | Reused if user lands directly on it; the global search prefers the unified results page |
| `MusicTrackView.vue` | Single track | Big cover, title, artist link, album link, license badge, play button, like button, "Add to playlist" menu, similar tracks rail |
| `MusicAlbumView.vue` | Album detail | Cover, artist link, year, tracklist with per-row play / like / add to queue, "Play album" sets the queue and starts at #1 |
| `MusicArtistView.vue` | Artist detail | Bio, top tracks, discography grid, follow placeholder for v2 |
| `MusicRadiosView.vue` | Genre radios | Cards by genre; clicking starts the Jamendo radio stream — player hides duration/seek and shows "LIVE" badge instead |
| `MusicLikedView.vue` | Liked songs | Single virtual playlist of all `music_favorites`, sortable by date added/title/artist, "Play all" button |
| `MusicPlaylistsView.vue` | Playlist hub | Grid of user playlists with cover (mosaic of first 4 tracks), create button, drag to reorder |
| `MusicPlaylistView.vue` | Single playlist | Editable title/description, drag-to-reorder track list (vuedraggable, same pattern as `FavouritesView`), per-row controls, share link |

All views follow the existing dark theme tokens (`bg-gray-950`, `rounded-2xl border border-gray-800`, indigo accents). Music gets **pink-400 accents in addition to indigo** as a subtle visual cue ("library" pink for podcast favourites is already the convention; we keep music neutral indigo to avoid clashing).

### 8. Navigation sidebar update

`src/views/NavigationView.vue` already has `navigationSections` split into Discover / Library / More. Extend it:

```js
const navigationSections = [
  {
    label: 'Discover',
    items: [
      { name: 'Home',       href: '/',           icon: HomeIcon },
      { name: 'Categories', href: '/categories', icon: TagIcon },
      { name: 'Music',      href: '/music',      icon: MusicalNoteIcon },
      { name: 'Radio',      href: '/music/radios', icon: RadioIcon },
    ],
  },
  {
    label: 'Library',
    items: [
      { name: 'Favourites',   href: '/favourites',      icon: StarIcon },
      { name: 'Bookmarks',    href: '/bookmarks',       icon: BookmarkIcon },
      { name: 'Liked songs',  href: '/music/liked',     icon: HeartIcon },
      { name: 'Playlists',    href: '/music/playlists', icon: QueueListIcon },
    ],
  },
  {
    label: 'More',
    items: [
      { name: 'Documentation', href: '/documentation', icon: BookOpenIcon },
      { name: 'About',         href: '/about',         icon: UsersIcon },
    ],
  },
]
```

The Library section is the heart of the integration: podcast and music live shoulder-to-shoulder with the same visual treatment.

### 9. Unified search

The existing topbar search currently routes to `SearchResults` (podcasts only). Three-step migration:

1. **`SearchResults.vue` becomes a tabbed page.** Two tabs: "Podcasts" and "Music". On submit, fire both `podcastService.search(q)` and `musicService.search(q)` in parallel and render them in their respective tabs. Show item counts in the tab labels.
2. **Empty state per tab**: if podcasts return 0 but music returns N, the UI nudges the user to switch tab ("Nothing in podcasts, but we found 12 tracks in music").
3. **Tab persistence**: remember the last tab via `localStorage` so power users who only listen to music skip the podcast tab on reload.

This avoids a parallel `MusicSearchView` for the common case while still keeping the dedicated route available for deep links.

---

## Author and License — required everywhere a track is shown

This is the most important rule of the whole integration. Creative Commons licences require **visible attribution**: artist name, track title, license, and a link back to the source. Failing to display them is a breach of the licence terms.

### `LicenseBadge.vue` — single source of truth

Create `src/components/music/LicenseBadge.vue`. It accepts a CC URL and renders a compact pill with:
- the short license code (`CC BY`, `CC BY-SA`, `CC BY-NC`, `CC BY-NC-SA`, `CC BY-ND`, `CC BY-NC-ND`)
- a tooltip with the full name
- an `href` to the canonical creativecommons.org page

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: { type: String, default: '' },
  size: { type: String, default: 'sm' }, // 'sm' | 'xs'
})

const LICENSE_TABLE = {
  'by':       { code: 'CC BY',       label: 'Attribution' },
  'by-sa':    { code: 'CC BY-SA',    label: 'Attribution, ShareAlike' },
  'by-nc':    { code: 'CC BY-NC',    label: 'Attribution, NonCommercial' },
  'by-nc-sa': { code: 'CC BY-NC-SA', label: 'Attribution, NonCommercial, ShareAlike' },
  'by-nd':    { code: 'CC BY-ND',    label: 'Attribution, NoDerivatives' },
  'by-nc-nd': { code: 'CC BY-NC-ND', label: 'Attribution, NonCommercial, NoDerivatives' },
}

const info = computed(() => {
  if (!props.url) return null
  const match = props.url.match(/licenses\/([a-z-]+)\//)
  const key = match?.[1] ?? ''
  return LICENSE_TABLE[key] || { code: 'CC', label: 'Creative Commons' }
})
</script>

<template>
  <a
    v-if="info"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    :title="info.label + ' — opens creativecommons.org'"
    :class="[
      'inline-flex items-center rounded-full border border-gray-700 bg-gray-800/60 font-medium tabular-nums uppercase tracking-wide text-gray-300 transition-colors hover:border-indigo-500/50 hover:text-indigo-300',
      size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
    ]"
  >
    {{ info.code }}
  </a>
</template>
```

### `JamendoAttribution.vue` — full attribution line

Compose `LicenseBadge` with the artist link and "via Jamendo" link. Use this everywhere a track is displayed in detail (track view, album view, player attribution row).

```vue
<template>
  <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
    <router-link
      :to="{ name: 'MusicArtist', params: { id: track.artist_id } }"
      class="font-medium text-gray-300 hover:text-indigo-400 transition-colors"
    >
      {{ track.artist_name }}
    </router-link>
    <span class="text-gray-600">·</span>
    <a :href="track.shareurl" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-400 transition-colors">
      via Jamendo
    </a>
    <LicenseBadge :url="track.license_ccurl" size="xs" />
  </div>
</template>
```

### Where each component appears

| Surface | Artist | License badge |
|---|---|---|
| Track row in any list (search, album, playlist, liked) | Always, as the secondary line (clickable, links to artist page) | Always, inline at the right of the row |
| `MusicTrackView` hero | Artist name, large, clickable | Below the title, full `<JamendoAttribution>` |
| `MusicAlbumView` hero | Artist name, large, clickable | Per-track in the row, plus the album-level license summary if all tracks share the same license |
| `MusicArtistView` hero | Artist name as the page title | Per-track in the discography rail |
| `OffcanvasPlayer` (when `isMusic`) | Artist as the secondary line (already free via `feedTitle` mapping) | `<LicenseBadge :url="currentItem.licenseUrl" size="xs" />` directly under, plus "via Jamendo" share link |
| `HomeView` "Continue listening" rail | Artist name, with a `MusicalNoteIcon` corner badge | Optional: omit on the rail to keep the card compact, but **must** show as soon as the track is opened |
| Notification toasts ("Added to liked songs") | Artist name in the message body | Not required on transient toasts |

Rule of thumb: **if the title is visible, the artist must be visible. If the user can interact with the track (play, like, queue), the license must be reachable in one click.**

### Footer disclosure

Add one line to `Footer.vue` next to the existing legal links: `Music provided by <a href="https://www.jamendo.com">Jamendo</a> under Creative Commons licenses.` This satisfies the platform-level attribution and complements the per-track attribution above.

---

## Player Behaviour for Music vs Podcast

| Feature | Podcasts (PodcastIndex) | Music (Jamendo) |
|---|---|---|
| Icon in player | Cover or podcast icon | Cover or musical note icon |
| Skip buttons | ±15s / ±30s | ±15s / ±30s + previous track / next track when queue active |
| Speed control | 0.5x to 2x | Hidden |
| Secondary line | Feed title | Artist name (linked) |
| Attribution row | None | LicenseBadge + "via Jamendo" link, always visible |
| History tracking | `historyStore` (type: podcast) | `historyStore` (type: music) — same store |
| Track play analytics | `podcastService.trackPlay` | `musicService.trackPlay` (TODO endpoint) |
| Queue / next | None in v1 | `queueStore` autoplay + similar tracks fallback |
| Seek | Yes | Yes (hidden for live radio streams) |
| MediaSession metadata | title, artist=feed | title, artist=real artist, album=album_name |

---

## Genre Mapping

Jamendo's tag system is flexible. Map these to UI genre pills:

```js
const MUSIC_GENRES = [
  { label: 'Electronic',   tag: 'electronic' },
  { label: 'Ambient',      tag: 'ambient' },
  { label: 'Jazz',         tag: 'jazz' },
  { label: 'Classical',    tag: 'classical' },
  { label: 'Rock',         tag: 'rock' },
  { label: 'Hip Hop',      tag: 'hiphop' },
  { label: 'Folk',         tag: 'folk' },
  { label: 'Lo-fi',        tag: 'lofi' },
  { label: 'World',        tag: 'world' },
  { label: 'Cinematic',    tag: 'cinematic' },
]
```

---

## Rate Limits & Caching

Jamendo free API:
- No documented hard rate limit, but be reasonable (< 1 req/sec per IP)
- Backend proxy allows adding server-side caching (cache trending results for 1 hour in Redis or database)
- For each unique `track/id` request, cache the response for 24h (track metadata doesn't change)

---

## Implementation Order

Status legend: ✅ done, 🟡 partial, ⬜ todo.

| # | Phase | Task | Status |
|---|---|---|---|
| 1 | Backend | Jamendo developer account + `client_id` env var | ✅ |
| 2 | Backend | `JamendoService` + `MusicController` + public routes | ✅ |
| 3 | Backend | `music_favorites`, `music_playlists`, `music_playlist_tracks` migrations | ✅ |
| 4 | Backend | `MusicFavoriteController` + `MusicPlaylistController` + auth routes | ✅ |
| 5 | Frontend | `src/services/musicService.js` wrapping every endpoint | ✅ |
| 6 | Frontend | Add `/music` + library music routes to `src/router/index.js` | ✅ |
| 7 | Frontend | Extend `playerStore` with `contentType`, `isMusic`, `isPodcast` | ✅ |
| 8 | Frontend | `LicenseBadge.vue` component | ✅ |
| 8b | Frontend | `JamendoAttribution.vue` (deferred — `LicenseBadge` is embedded inline directly in track rows / player, no separate wrapper needed yet) | ⬜ |
| 9 | Frontend | `OffcanvasPlayer.vue`: hide speed for music, show attribution row + license badge, music history guards | ✅ |
| 10 | Frontend | Sidebar: Music in Discover, Music favorites + Music playlists in Library | ✅ |
| 11 | Frontend | `MusicHomeView.vue` (trending + genre pills + play) | ✅ |
| 11b | Frontend | `MusicHomeView` extras: featured radios row, Continue listening (music) rail | ⬜ |
| 12 | Frontend | `MusicTrackView.vue` + `MusicAlbumView.vue` + `MusicArtistView.vue` | ⬜ |
| 13 | Frontend | `MusicFavoritesView.vue` (Spotify "Liked songs" — single flat list of `music_favorites`) | ✅ |
| 14 | Frontend | `MusicPlaylistsView.vue` + `MusicPlaylistDetailView.vue` (create / rename / delete / add / remove) | ✅ |
| 14b | Frontend | Drag-to-reorder tracks inside `MusicPlaylistDetailView` (vuedraggable + `reorderPlaylist`) | ⬜ |
| 14c | Frontend | `musicLibraryStore.js` Pinia store — single source of truth for favorites + playlists | ✅ |
| 14d | Frontend | `FavoriteMusicButton.vue` + `AddToPlaylistMenu.vue` reusable components | ✅ |
| 15 | Frontend | `MusicRadiosView.vue` (genre radios + LIVE player mode) | ⬜ |
| 16 | Frontend | `queueStore.js` + autoplay/similar fallback in `OffcanvasPlayer.onEnded` | ⬜ |
| 17 | Frontend | Extend `historyStore` with `type`, mix music + podcast in "Continue listening" | ⬜ |
| 18 | Frontend | `SearchResults.vue` becomes tabbed (Podcasts | Music) with parallel calls | ⬜ |
| 19 | Frontend | Footer: add Jamendo CC disclosure line | ⬜ |
| 20 | Backend (later) | `POST /music/play` analytics endpoint to mirror podcast `add_play_click` | ⬜ |

**Done so far:** Phase 1 (browse + play) shipped first — `musicService`, `playerStore` discriminator, `LicenseBadge`, player adaptations with CC attribution, `MusicHomeView`, navigation entry, SEO. Phase 2 (library) shipped right after — `musicLibraryStore` as single source of truth, `FavoriteMusicButton` and `AddToPlaylistMenu` as drop-in components, `MusicFavoritesView`, `MusicPlaylistsView`, `MusicPlaylistDetailView`, three new auth-gated routes, sidebar entries, SEO entries (`noIndex` for the private pages).

**Next up (recommended PR):** **15 → 16 → 17 → 11b** — radios, then queue + autoplay similar, then mixed continue-listening. After that, **12** (track/album/artist deep pages) and **18** (unified tabbed search). Reorder (14b) and footer disclosure (19) are quick polish items that can ride along any PR.

---

## Resolved Decisions

1. **Music favourites storage** → separate `music_favorites` table. Already deployed. Cleaner schema, no `type` column hack on the podcast `favorites` table.
2. **Library taxonomy** → music uses `music_favorites` (Liked songs, flat) + `music_playlists` (named, ordered, drag-reorderable). Podcasts keep `favorites` + `bookmarks` with section strings. Two models, one Library section in the sidebar.
3. **Unified search** → yes, tabbed `SearchResults` page (Podcasts | Music) with parallel API calls.
4. **Player** → single `OffcanvasPlayer` + single `playerStore`, discriminated via `contentType`. No fork.
5. **Library state** → single `musicLibraryStore` (Pinia) holds favorites + playlists, lazy-hydrated and cached. Components never call `musicService` directly for library state — they go through the store so optimistic updates stay coherent across the app. Per-playlist tracklists stay outside the store and are fetched per view, since they're rarely revisited.
6. **Reusable library actions** → `FavoriteMusicButton.vue` + `AddToPlaylistMenu.vue` are the only entry points for liking / adding to a playlist. Both accept either raw Jamendo shapes or backend rows; both gate on auth; both stop event propagation so they can be dropped into clickable rows. New surfaces (track/album/artist pages, search results) reuse them as-is.
7. **`JamendoAttribution.vue` wrapper** → not built. The bare `LicenseBadge` rendered inline next to the artist name is enough attribution for list rows and the player. Reconsider only when a track/album/artist deep page needs a richer block.
8. **`musicService.checkFavorite(id)`** → kept in the service but unused by the app. The store's `favoriteIds` Set answers the question synchronously; the endpoint stays available for SSR / direct-link scenarios.

## Open Questions

1. **Offline music?** Jamendo allows downloading (with attribution). Could cache a few tracks locally for offline playback — requires significant storage management logic. Out of scope for v1.
2. **Mobile app (future Capacitor build):** Jamendo streams work over HTTPS on mobile browsers without any extra config. No native SDK needed.
3. **Jamendo Radio streams:** Radio `stream` URLs are persistent HLS streams — they work with the existing `<audio>` element, but the player's seek bar and duration must be hidden and a "LIVE" badge shown when `currentItem.isLive === true`.
4. **Music play analytics:** Should we ship a `POST /music/play` endpoint for the dashboard, or is per-track Jamendo telemetry enough? Decide before view #11 ships.
5. **Playlist cover mosaic:** rendering 4-track mosaics client-side for playlist cards — generate at view time from `album_image` URLs, or pre-compute on the backend? Lean towards client-side for v1.
