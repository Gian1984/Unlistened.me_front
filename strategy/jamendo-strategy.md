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

### 4. New routes in `routes/api.php`

```php
// Music (Jamendo) — public
Route::prefix('music')->group(function () {
    Route::get('/trending',          [MusicController::class, 'trending']);
    Route::get('/search',            [MusicController::class, 'search']);
    Route::get('/track/{id}',        [MusicController::class, 'track']);
    Route::get('/album/{id}',        [MusicController::class, 'album']);
    Route::get('/artist/{id}',       [MusicController::class, 'artist']);
    Route::get('/radios',            [MusicController::class, 'radios']);
    Route::get('/track/{id}/similar', [MusicController::class, 'similar']);
});

// Music user data — auth required
Route::middleware('auth:sanctum')->prefix('music')->group(function () {
    Route::post('/favorites/add',        [MusicFavoriteController::class, 'store']);
    Route::delete('/favorites/{id}',     [MusicFavoriteController::class, 'destroy']);
    Route::get('/favorites',             [MusicFavoriteController::class, 'index']);
});
```

### 5. New database models

**Migration: `music_favorites`**

```php
Schema::create('music_favorites', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('jamendo_track_id');
    $table->string('title');
    $table->string('artist_name');
    $table->string('album_image')->nullable();
    $table->string('audio_url');
    $table->integer('duration')->default(0);
    $table->string('section')->nullable();
    $table->timestamps();
    $table->unique(['user_id', 'jamendo_track_id']);
});
```

This mirrors the existing `favorites` table pattern used for podcast favourites.

### 6. `config/services.php`

```php
'jamendo' => [
    'client_id' => env('JAMENDO_CLIENT_ID'),
],
```

---

## Frontend Changes Required (Vue 3)

### 1. New service: `src/services/musicService.js`

```js
import api from './api.js'

export const musicService = {
  getTrending: ()             => api.get('/music/trending'),
  search: (q, genre, offset)  => api.get('/music/search', { params: { q, genre, offset } }),
  getTrack: (id)              => api.get(`/music/track/${id}`),
  getAlbum: (id)              => api.get(`/music/album/${id}`),
  getArtist: (id)             => api.get(`/music/artist/${id}`),
  getRadios: ()               => api.get('/music/radios'),
  getSimilar: (id)            => api.get(`/music/track/${id}/similar`),
  addFavorite: (track)        => api.post('/music/favorites/add', track),
  removeFavorite: (id)        => api.delete(`/music/favorites/${id}`),
  getFavorites: ()            => api.get('/music/favorites'),
}
```

### 2. Player store update (`src/stores/playerStore.js`)

The existing player already handles any audio URL in `enclosureUrl`. Add a `contentType` field to distinguish podcast episodes from music tracks:

```js
function play(episode) {
  currentEpisode.value = {
    ...episode,
    contentType: episode.contentType || 'podcast', // 'podcast' | 'music'
  }
  isVisible.value = true
}
```

The `OffcanvasPlayer.vue` needs no structural changes — it already plays any URL set in `enclosureUrl`. Minor changes:
- Show a music note icon when `contentType === 'music'` instead of the podcast icon
- Show "Jamendo — CC licensed" attribution link below the track title
- Skip the `trackPlay()` API call (or route it to a music-specific analytics endpoint)

### 3. New routes in `src/router/index.js`

```js
{ path: '/music',              name: 'Music',         component: () => import('@/views/MusicHomeView.vue') },
{ path: '/music/track/:id',    name: 'MusicTrack',    component: () => import('@/views/MusicTrackView.vue') },
{ path: '/music/album/:id',    name: 'MusicAlbum',    component: () => import('@/views/MusicAlbumView.vue') },
{ path: '/music/artist/:id',   name: 'MusicArtist',   component: () => import('@/views/MusicArtistView.vue') },
{ path: '/music/radios',       name: 'MusicRadios',   component: () => import('@/views/MusicRadiosView.vue') },
```

### 4. New views to create

| View | Content |
|---|---|
| `MusicHomeView.vue` | Hero + trending tracks grid + genre filter pills + radio stations |
| `MusicTrackView.vue` | Track detail, artist info, album art, similar tracks, play/favourite |
| `MusicAlbumView.vue` | Album cover, tracklist, play all |
| `MusicArtistView.vue` | Artist bio, discography grid |
| `MusicRadiosView.vue` | Genre radio cards — click plays a Jamendo radio stream |

All views follow the existing dark theme pattern (`bg-gray-950`, `rounded-2xl border border-gray-800`, etc.).

### 5. Navigation sidebar update (`NavigationView.vue`)

Add a new "Music" section to `navigationSections`:

```js
{
  label: 'Music',
  items: [
    { name: 'Browse Music', href: '/music',        icon: MusicalNoteIcon },
    { name: 'Radio',        href: '/music/radios', icon: RadioIcon },
  ],
},
```

### 6. Attribution component

Required by Creative Commons licenses. Create `src/components/JamendoAttribution.vue`:

```html
<template>
  <a
    :href="track.shareurl"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-400 transition-colors"
  >
    <span>{{ track.artist_name }} — {{ track.name }}</span>
    <span class="text-gray-600">· via Jamendo</span>
    <span class="text-gray-600">· {{ licenseShortName }}</span>
  </a>
</template>
```

---

## Player Behaviour for Music vs Podcast

| Feature | Podcasts (PodcastIndex) | Music (Jamendo) |
|---|---|---|
| Icon in player | Podcast icon | Musical note icon |
| Skip buttons | ±15s / ±30s | ±15s / ±30s |
| Speed control | Yes (0.5x – 2x) | Hide (not relevant for music) |
| Attribution | "Saved podcast" | Artist + CC license link |
| History tracking | `historyStore` | Separate `musicHistoryStore` or same store with type flag |
| Track play | `/api/add_play_click` | `/api/music/play` (new endpoint) |
| Queue / next | Episode queue | Album tracklist queue |
| Seek | Yes | Yes |

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

| Phase | Task | Effort |
|---|---|---|
| 1 | Register Jamendo developer account, get `client_id` | 15m |
| 2 | Backend: `JamendoService.php` + `MusicController.php` + routes + migration | 3–4h |
| 3 | Frontend: `musicService.js` + router entries | 1h |
| 4 | `MusicHomeView.vue` (trending + genre filter) | 3h |
| 5 | Player integration (contentType flag + attribution) | 1h |
| 6 | `MusicRadiosView.vue` (genre radios) | 2h |
| 7 | `MusicTrackView.vue` + `MusicAlbumView.vue` + `MusicArtistView.vue` | 4h |
| 8 | Music favourites (frontend + backend) | 2h |
| 9 | Attribution component everywhere | 1h |
| 10 | Sidebar navigation update | 30m |

---

## Open Questions

1. **Unified search?** Should the header search bar search both podcasts AND music simultaneously, or is music search separate? A unified results page with tabs (Podcasts / Music) would be ideal UX.
2. **Music favourites storage:** Store in existing `favorites` table with a `type` column (`podcast`/`music`)? Or a separate `music_favorites` table? Separate table is cleaner and avoids mixing schemas.
3. **Offline music?** Jamendo allows downloading (with attribution). Could cache a few tracks locally for offline playback — requires significant storage management logic. Out of scope for v1.
4. **Mobile app (future Capacitor build):** Jamendo streams work over HTTPS on mobile browsers without any extra config. No native SDK needed.
5. **Jamendo Radio streams:** Radio `stream` URLs are persistent HLS streams — they work with the existing `<audio>` element but the player's seek bar and duration should be hidden for live radio.
