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

// ── Static page meta registry ───────────────────────────────────────────
$staticMeta = [
    '/' => [
        'title'       => 'Free Podcasts & Music — No Tracking | Unlistened.me',
        'description' => 'Discover and stream thousands of podcasts and free Creative Commons music. No cookies, no tracking, no accounts required.',
        'image'       => SITE_URL . '/images/og/home.png',
    ],
    '/podcasts' => [
        'title'       => 'Trending Podcasts — Free Streaming | Unlistened.me',
        'description' => 'Browse and stream thousands of trending podcasts for free. No cookies, no tracking, no accounts required.',
        'image'       => SITE_URL . '/images/og/podcasts.png',
    ],
    '/music' => [
        'title'       => 'Free Creative Commons Music — No Tracking | Unlistened.me',
        'description' => 'Stream thousands of Creative Commons licensed tracks from independent artists. Free, no ads, no tracking.',
        'image'       => SITE_URL . '/images/og/music.png',
    ],
    '/categories' => [
        'title'       => 'Browse Podcast Categories | Unlistened.me',
        'description' => 'Explore podcasts by category on Unlistened.me. From technology and science to arts, comedy, true crime, and personal development.',
        'image'       => SITE_URL . '/images/og/categories.png',
    ],
    '/about' => [
        'title'       => 'About Unlistened.me — Privacy-first Podcast Player',
        'description' => 'Learn about Unlistened.me, the podcast player built with privacy at its core. No ads, no tracking. Made for listeners, not algorithms.',
        'image'       => SITE_URL . '/images/og/about.png',
    ],
    '/documentation' => [
        'title'       => 'User guide | Unlistened.me',
        'description' => 'Learn how to use Unlistened.me — creating an account, discovering podcasts, listening, saving favourites, bookmarking episodes, and more.',
        'image'       => SITE_URL . '/images/og/documentation.png',
    ],
    '/terms' => [
        'title'       => 'Terms and Conditions | Unlistened.me',
        'description' => 'Read the Unlistened.me terms and conditions.',
        'image'       => SITE_URL . '/images/og/terms.png',
    ],
    '/privacy' => [
        'title'       => 'Privacy policy | Unlistened.me',
        'description' => 'How Unlistened.me collects, uses and protects your data. A non-commercial project that respects your privacy.',
        'image'       => SITE_URL . '/images/og/privacy.png',
    ],
    '/login' => [
        'title'       => 'Sign In | Unlistened.me',
        'description' => 'Sign in to Unlistened.me to access your saved podcasts and bookmarks.',
        'image'       => SITE_URL . '/images/og/login.png',
    ],
    '/signup' => [
        'title'       => 'Create Account | Unlistened.me',
        'description' => 'Create a free Unlistened.me account to save your favourite podcasts and pick up where you left off.',
        'image'       => SITE_URL . '/images/og/signup.png',
    ],
    '/search-results' => [
        'title'       => 'Search Results | Unlistened.me',
        'description' => 'Find your next favourite podcast on Unlistened.me.',
        'image'       => SITE_URL . '/images/og/search.png',
    ],
];

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

function renderHtml(string $title, string $description, string $image, string $url, string $type = 'website'): void
{
    $t = e($title);
    $d = e(truncate($description));
    $i = e($image);
    $u = e($url);
    $s = e(SITE_NAME);

    header('Content-Type: text/html; charset=UTF-8');

    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{$t}</title>
    <meta name="description" content="{$d}">

    <!-- Open Graph -->
    <meta property="og:type" content="{$type}">
    <meta property="og:site_name" content="{$s}">
    <meta property="og:title" content="{$t}">
    <meta property="og:description" content="{$d}">
    <meta property="og:image" content="{$i}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="{$u}">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{$t}">
    <meta name="twitter:description" content="{$d}">
    <meta name="twitter:image" content="{$i}">
</head>
<body>
    <!-- Bot-only page. Users are served the Vue SPA. -->
    <h1>{$t}</h1>
    <p>{$d}</p>
</body>
</html>
HTML;
}

// ── Route matching ──────────────────────────────────────────────────────

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = rtrim($path, '/') ?: '/';
$canonicalUrl = SITE_URL . $path;

// 1. Static routes
if (isset($staticMeta[$path])) {
    $meta = $staticMeta[$path];
    renderHtml($meta['title'], $meta['description'], $meta['image'], $canonicalUrl);
    exit;
}

// 2. Dynamic: /feed/:id — Podcast feed
if (preg_match('#^/feed/(\d+)$#', $path, $m)) {
    $data = fetchJson(API_BASE . '/feed_info/' . $m[1]);
    if ($data) {
        // API returns feed data directly or nested — adapt to your response shape
        $feed = $data['feed'] ?? $data;
        $title       = ($feed['title'] ?? 'Podcast') . ' | ' . SITE_NAME;
        $description = $feed['description'] ?? $feed['title'] ?? '';
        $image       = $feed['image'] ?? $feed['artwork'] ?? FALLBACK_IMAGE;
        renderHtml($title, $description, $image, $canonicalUrl);
        exit;
    }
}

// 3. Dynamic: /episode/:id — Single episode
if (preg_match('#^/episode/(\d+)$#', $path, $m)) {
    $data = fetchJson(API_BASE . '/search_episode/' . $m[1]);
    if ($data) {
        $ep = $data['episode'] ?? $data;
        $title       = ($ep['title'] ?? 'Episode') . ' | ' . SITE_NAME;
        $description = $ep['description'] ?? $ep['title'] ?? '';
        $image       = $ep['image'] ?? $ep['feedImage'] ?? FALLBACK_IMAGE;
        renderHtml($title, $description, $image, $canonicalUrl, 'article');
        exit;
    }
}

// 4. Fallback — serve generic meta
renderHtml(
    'Free Podcasts & Music — No Tracking | ' . SITE_NAME,
    'Discover and stream thousands of podcasts and free Creative Commons music. No cookies, no tracking, no accounts required.',
    DEFAULT_IMAGE,
    $canonicalUrl
);
