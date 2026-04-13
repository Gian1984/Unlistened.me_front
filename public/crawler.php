<?php
/**
 * crawler.php — Serves minimal HTML with correct OG/Twitter meta tags
 * for social-media crawlers (Facebook, Twitter, LinkedIn, Telegram, etc.).
 *
 * Normal users never see this — .htaccess routes only bot user-agents here.
 * For dynamic routes (/feed/:id, /episode/:id) it fetches data from the API.
 * For static routes it uses a built-in registry of meta info.
 */

// ── Configuration ───────────────────────────────────────────────────────
define('API_BASE', 'https://api.unlistened.me/api');
define('SITE_URL', 'https://www.unlistened.me');
define('SITE_NAME', 'Unlistened.me');
define('DEFAULT_IMAGE', SITE_URL . '/images/og/home.png');
define('FALLBACK_IMAGE', SITE_URL . '/images/ogimage-min.png');

// ── Helpers ──────────────────────────────────────────────────────────────

function fetchJson(string $url): ?array
{
    $ctx = stream_context_create([
        'http' => [
            'timeout'       => 5,
            'ignore_errors' => true,
            'header'        => "Accept: application/json\r\n",
        ],
    ]);

    $body = @file_get_contents($url, false, $ctx);
    if ($body === false) return null;

    $data = json_decode($body, true);
    return is_array($data) ? $data : null;
}

function truncate(string $str, int $max = 155): string
{
    $clean = trim(preg_replace('/\s+/', ' ', strip_tags($str)));
    return mb_strlen($clean) <= $max ? $clean : mb_substr($clean, 0, $max - 1) . "\xe2\x80\xa6";
}

function e(string $str): string
{
    return htmlspecialchars($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function loadStaticSeo(): array
{
    $file = __DIR__ . '/seo-static.json';
    if (!is_file($file)) return [];

    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? $data : [];
}

function renderTagList(array $items): string
{
    if (!$items) return '';

    $tags = array_map(
        fn ($item) => '<li>' . e((string) $item) . '</li>',
        array_slice(array_values(array_filter($items)), 0, 8)
    );

    return $tags ? '<ul>' . implode('', $tags) . '</ul>' : '';
}

function renderEpisodeLinks(array $episodes): string
{
    if (!$episodes) return '';

    $items = [];
    foreach (array_slice($episodes, 0, 10) as $episode) {
        if (empty($episode['id']) || empty($episode['title'])) continue;
        $url = SITE_URL . '/episode/' . rawurlencode((string) $episode['id']);
        $items[] = '<li><a href="' . e($url) . '">' . e((string) $episode['title']) . '</a></li>';
    }

    return $items ? '<h2>Recent episodes</h2><ul>' . implode('', $items) . '</ul>' : '';
}

function renderHtml(
    string $title,
    string $description,
    string $image,
    string $url,
    string $type = 'website',
    string $robots = 'index,follow',
    int $status = 200,
    string $bodyHtml = '',
    array $jsonLd = [],
    ?string $imageAlt = null
): void
{
    $t = e($title);
    $d = e(truncate($description));
    $i = e($image);
    $u = e($url);
    $s = e(SITE_NAME);
    $r = e($robots);
    $imageAltTag = $imageAlt ? e($imageAlt) : 'Unlistened.me preview image';
    $jsonLdHtml = '';
    foreach ($jsonLd as $schema) {
        if (!is_array($schema)) continue;
        $json = json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $jsonLdHtml .= "\n    <script type=\"application/ld+json\">" . str_replace('</script', '<\/script', (string) $json) . "</script>";
    }

    http_response_code($status);
    header('Content-Type: text/html; charset=UTF-8');

    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{$t}</title>
    <meta name="description" content="{$d}">
    <meta name="robots" content="{$r}">
    <link rel="canonical" href="{$u}">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Open Graph -->
    <meta property="og:type" content="{$type}">
    <meta property="og:site_name" content="{$s}">
    <meta property="og:title" content="{$t}">
    <meta property="og:description" content="{$d}">
    <meta property="og:image" content="{$i}">
    <meta property="og:image:alt" content="{$imageAltTag}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="{$u}">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{$t}">
    <meta name="twitter:description" content="{$d}">
    <meta name="twitter:image" content="{$i}">
    <meta name="twitter:image:alt" content="{$imageAltTag}">{$jsonLdHtml}
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 32px 20px; color: #111827; line-height: 1.5; background: #fff; }
        main { max-width: 760px; margin: 0 auto; }
        img { max-width: 100%; height: auto; border-radius: 12px; }
        h1 { font-size: 2rem; line-height: 1.2; margin: 0 0 12px; }
        h2 { font-size: 1.15rem; margin: 28px 0 10px; }
        p { margin: 0 0 12px; }
        ul { margin: 0; padding-left: 20px; }
        li { margin: 0 0 8px; }
        .meta { color: #4b5563; font-size: 0.95rem; margin-bottom: 16px; }
        .cover { margin: 0 0 20px; }
        .backlink { display: inline-block; margin-top: 16px; }
    </style>
</head>
<body>
    <main>
        <h1>{$t}</h1>
        <p>{$d}</p>
        {$bodyHtml}
    </main>
</body>
</html>
HTML;
}

// ── Route matching ──────────────────────────────────────────────────────

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = rtrim($path, '/') ?: '/';
$canonicalUrl = SITE_URL . $path;
$staticMeta = loadStaticSeo();

// 1. Static routes
if (isset($staticMeta[$path])) {
    $meta = $staticMeta[$path];
    renderHtml(
        $meta['title'] ?? ('Page | ' . SITE_NAME),
        $meta['description'] ?? '',
        $meta['image'] ?? FALLBACK_IMAGE,
        $canonicalUrl,
        $meta['type'] ?? 'website',
        $meta['robots'] ?? 'index,follow',
        200,
        '',
        $meta['jsonLd'] ?? [],
        $meta['imageAlt'] ?? null
    );
    exit;
}

// 2. Dynamic: /feed/:id — Podcast feed
if (preg_match('#^/feed/(\d+)$#', $path, $m)) {
    $feedId = $m[1];
    $data = fetchJson(API_BASE . '/feed_info/' . $feedId);
    $feed = $data['feed'] ?? $data;
    if (!empty($feed['id']) && !empty($feed['title'])) {
        // API returns feed data directly or nested — adapt to your response shape
        $episodesData = fetchJson(API_BASE . '/search_feed/' . $feedId);
        $episodes = $episodesData['items'] ?? $episodesData['episodes'] ?? [];
        $categories = [];
        if (!empty($feed['categories']) && is_array($feed['categories'])) {
            $categories = array_values($feed['categories']);
        }
        $body = '';
        if (!empty($feed['image']) || !empty($feed['artwork'])) {
            $body .= '<p class="cover"><img src="' . e((string) ($feed['image'] ?? $feed['artwork'])) . '" alt="' . e((string) $feed['title']) . ' cover"></p>';
        }
        $meta = [];
        if (!empty($feed['author'])) $meta[] = 'By ' . e((string) $feed['author']);
        if (!empty($feed['language'])) $meta[] = 'Language: ' . e((string) $feed['language']);
        if (!empty($episodes) && is_array($episodes)) $meta[] = 'Episodes: ' . count($episodes);
        if ($meta) $body .= '<p class="meta">' . implode(' · ', $meta) . '</p>';
        if ($categories) $body .= '<h2>Categories</h2>' . renderTagList($categories);
        $body .= renderEpisodeLinks(is_array($episodes) ? $episodes : []);
        $title       = ($feed['title'] ?? 'Podcast') . ' | ' . SITE_NAME;
        $description = $feed['description'] ?? $feed['title'] ?? '';
        $image       = $feed['image'] ?? $feed['artwork'] ?? FALLBACK_IMAGE;
        renderHtml($title, $description, $image, $canonicalUrl, 'website', 'index,follow', 200, $body);
        exit;
    }

    renderHtml(
        'Podcast Not Found | ' . SITE_NAME,
        'The podcast you are looking for could not be found.',
        FALLBACK_IMAGE,
        $canonicalUrl,
        'website',
        'noindex,nofollow',
        404
    );
    exit;
}

// 3. Dynamic: /episode/:id — Single episode
if (preg_match('#^/episode/(\d+)$#', $path, $m)) {
    $data = fetchJson(API_BASE . '/search_episode/' . $m[1]);
    $ep = $data['episode'] ?? $data;
    if (!empty($ep['id']) && !empty($ep['title'])) {
        $body = '';
        if (!empty($ep['image']) || !empty($ep['feedImage'])) {
            $body .= '<p class="cover"><img src="' . e((string) ($ep['image'] ?? $ep['feedImage'])) . '" alt="' . e((string) $ep['title']) . ' cover"></p>';
        }
        $meta = [];
        if (!empty($ep['feedTitle'])) $meta[] = 'Podcast: ' . e((string) $ep['feedTitle']);
        if (!empty($ep['datePublishedPretty'])) $meta[] = e((string) $ep['datePublishedPretty']);
        if ($meta) $body .= '<p class="meta">' . implode(' · ', $meta) . '</p>';
        if (!empty($ep['feedId'])) {
            $feedUrl = SITE_URL . '/feed/' . rawurlencode((string) $ep['feedId']);
            $body .= '<p><a class="backlink" href="' . e($feedUrl) . '">View podcast page</a></p>';
        }
        $title       = ($ep['title'] ?? 'Episode') . ' | ' . SITE_NAME;
        $description = $ep['description'] ?? $ep['title'] ?? '';
        $image       = $ep['image'] ?? $ep['feedImage'] ?? FALLBACK_IMAGE;
        renderHtml($title, $description, $image, $canonicalUrl, 'article', 'index,follow', 200, $body);
        exit;
    }

    renderHtml(
        'Episode Not Found | ' . SITE_NAME,
        'The episode you are looking for could not be found.',
        FALLBACK_IMAGE,
        $canonicalUrl,
        'website',
        'noindex,nofollow',
        404
    );
    exit;
}

// 4. Known private/error routes
if (in_array($path, [
    '/forgot_password',
    '/settings',
    '/favourites',
    '/bookmarks',
    '/dashboard',
    '/music/favorites',
    '/music/playlists',
    '/forbidden',
], true)) {
    renderHtml(
        'Restricted Page | ' . SITE_NAME,
        'This page is not intended to be indexed by search engines.',
        FALLBACK_IMAGE,
        $canonicalUrl,
        'website',
        'noindex,nofollow'
    );
    exit;
}

// 5. Fallback — unknown route should not look like a valid indexable page
renderHtml(
    'Page Not Found | ' . SITE_NAME,
    'The page you are looking for does not exist.',
    DEFAULT_IMAGE,
    $canonicalUrl,
    'website',
    'noindex,nofollow',
    404
);
