# Unlistened.me — SEO Strategy

## Situazione attuale

Il router gestisce già `document.title` e meta tag OG tramite DOM manipulation nel `beforeEach` guard. I problemi:

1. **Route dinamiche hanno meta statici** — `/feed/:id` ed `/episode/:id` mostrano titoli e description generici invece dei dati reali del podcast/episodio
2. **`og:url` non funziona per le route dinamiche** — contiene letteralmente `:id` invece del valore reale
3. **Zero structured data** — nessun JSON-LD, nessuna chance di rich result su Google
4. **No canonical URL** — rischio duplicate content se il sito viene raggiunto da più entry point
5. **No Twitter Card** — solo OG (Twitter richiede `twitter:*` separati)
6. **No `robots` meta** — le pagine auth e dashboard dovrebbero essere `noindex`
7. **No sitemap.xml** — Google non ha una mappa crawlabile del sito
8. **Logica SEO dispersa** — tutto nel router, nessun sistema centralizzato

---

## Il problema fondamentale delle SPA

Google crawla le SPA ma con un ritardo (rendering a ondate). Per un'app podcast questo è critico: le pagine `/feed/:id` e `/episode/:id` sono le più preziose per il SEO (contengono contenuto unico), ma attualmente Google vede solo tag generici.

**Soluzione adottata in questa strategia:** nessun SSR, ma sistema SEO reattivo completo che:
- Inietta il meta corretto non appena i dati arrivano dall'API
- Aggiunge JSON-LD strutturato per ogni tipo di pagina
- Gestisce canonical, robots, Twitter Card
- Mantiene tutto centralizzato e facile da aggiornare

---

## Architettura del sistema SEO

```
src/
├── seo/
│   ├── composables/
│   │   └── useSeo.js            # Composable centrale — gestisce title, meta, JSON-LD
│   │
│   ├── schemas/                 # Builder functions per JSON-LD (puri, testabili)
│   │   ├── organization.js      # Schema Organization (statico, globale)
│   │   ├── website.js           # Schema WebSite + SearchAction (statico, globale)
│   │   ├── podcast.js           # Builder: PodcastSeries da dati API
│   │   ├── episode.js           # Builder: PodcastEpisode da dati API
│   │   ├── breadcrumb.js        # Builder: BreadcrumbList da array di items
│   │   └── faq.js               # Builder: FAQPage da array di Q&A
│   │
│   └── registry/                # Configurazioni SEO statiche per pagina
│       ├── index.js             # Re-esporta tutto
│       ├── home.js
│       ├── about.js
│       ├── categories.js
│       ├── search.js
│       ├── favourites.js
│       ├── bookmarks.js
│       ├── login.js
│       ├── signup.js
│       └── terms.js
│
└── components/
    └── SeoHead.vue              # Componente che inietta <script type="application/ld+json">
```

Il router smette di gestire i meta tag (viene ripulito). Ogni view chiama `useSeo(config)` e passa la configurazione giusta — statica per le pagine semplici, reattiva per podcast/episodi.

---

## Il composable `useSeo.js`

```js
// src/seo/composables/useSeo.js
import { watchEffect, isRef } from 'vue'

const SITE_NAME = 'Unlistened.me'
const BASE_URL = 'https://www.unlistened.me'
const DEFAULT_IMAGE = `${BASE_URL}/images/ogimage-min.png`

/**
 * @param {Object|Ref<Object>} config
 * @param {string}  config.title           — Testo completo del <title>
 * @param {string}  config.description     — Meta description (max 155 char)
 * @param {string}  [config.canonical]     — URL canonico assoluto
 * @param {string}  [config.ogType]        — 'website' | 'article' | 'music.song'
 * @param {string}  [config.ogImage]       — URL immagine OG (1200x630)
 * @param {string}  [config.robots]        — 'index,follow' | 'noindex,nofollow'
 * @param {Array}   [config.jsonLd]        — Array di oggetti JSON-LD
 */
export function useSeo(config) {
  watchEffect(() => {
    const cfg = isRef(config) ? config.value : config
    if (!cfg) return

    // Title
    document.title = cfg.title ?? SITE_NAME

    // Helper: upsert un meta tag (evita duplicati)
    const setMeta = (selector, content) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const [attr, val] = selector.replace('[', '').replace(']', '').split('=')
        el.setAttribute(attr.trim(), val.replace(/"/g, '').trim())
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const url = cfg.canonical ?? (BASE_URL + window.location.pathname)
    const image = cfg.ogImage ?? DEFAULT_IMAGE
    const robots = cfg.robots ?? 'index,follow'
    const ogType = cfg.ogType ?? 'website'

    // Standard meta
    setMeta('meta[name="description"]', cfg.description ?? '')
    setMeta('meta[name="robots"]', robots)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    // Open Graph
    setMeta('meta[property="og:title"]', cfg.title ?? SITE_NAME)
    setMeta('meta[property="og:description"]', cfg.description ?? '')
    setMeta('meta[property="og:url"]', url)
    setMeta('meta[property="og:type"]', ogType)
    setMeta('meta[property="og:image"]', image)
    setMeta('meta[property="og:site_name"]', SITE_NAME)

    // Twitter Card
    setMeta('meta[name="twitter:card"]', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', cfg.title ?? SITE_NAME)
    setMeta('meta[name="twitter:description"]', cfg.description ?? '')
    setMeta('meta[name="twitter:image"]', image)

    // JSON-LD
    document.querySelectorAll('script[data-seo-ld]').forEach(el => el.remove())
    if (cfg.jsonLd?.length) {
      cfg.jsonLd.forEach(schema => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-seo-ld', '')
        script.textContent = JSON.stringify(schema)
        document.head.appendChild(script)
      })
    }
  })
}
```

**Caratteristica chiave:** l'uso di `watchEffect` rende il sistema **reattivo**. Se passi una `computed` o un oggetto che cambia quando arrivano i dati API, i meta si aggiornano automaticamente. Niente polling, niente callback manuali.

---

## Registry — configurazioni statiche

Ogni file del registry esporta un oggetto con tutti i campi che `useSeo` accetta:

```js
// src/seo/registry/home.js
export const homeSeo = {
  title: 'Free Podcast Player — No Tracking | Unlistened.me',
  description: 'Discover and stream thousands of podcasts on Unlistened. No cookies, no tracking, completely free. Your private podcast experience starts here.',
  canonical: 'https://www.unlistened.me/',
  ogType: 'website',
}
```

```js
// src/seo/registry/about.js
export const aboutSeo = {
  title: 'About Unlistened.me — Privacy-first Podcast Player',
  description: 'Learn about Unlistened.me, the podcast app built with privacy at its core. No ads, no tracking, open source. Made for listeners, not algorithms.',
  canonical: 'https://www.unlistened.me/about',
  jsonLd: [ /* FAQPage schema, Organization schema */ ]
}
```

```js
// src/seo/registry/index.js
export { homeSeo } from './home.js'
export { aboutSeo } from './about.js'
export { categoriesSeo } from './categories.js'
// ... tutti gli altri
```

Utilizzo in una view statica:
```js
// HomeView.vue
import { useSeo } from '@/seo/composables/useSeo'
import { homeSeo } from '@/seo/registry'
import { websiteSchema, organizationSchema } from '@/seo/schemas/website'

useSeo({
  ...homeSeo,
  jsonLd: [websiteSchema, organizationSchema],
})
```

---

## Schema builders — JSON-LD

### `organization.js` — globale, statico
```js
// src/seo/schemas/organization.js
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Unlistened.me',
  url: 'https://www.unlistened.me',
  logo: 'https://www.unlistened.me/images/logo.png',
  sameAs: [
    // Aggiungi profili social quando disponibili
  ],
  description: 'Free, privacy-first podcast streaming platform. No tracking, no ads.',
}
```

### `website.js` — homepage, con SearchAction
```js
// src/seo/schemas/website.js
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Unlistened.me',
  url: 'https://www.unlistened.me',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.unlistened.me/search-results?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}
```

> Google usa questo per mostrare una **search box direttamente nei risultati** quando qualcuno cerca "unlistened.me".

### `podcast.js` — pagina episodi di un podcast
```js
// src/seo/schemas/podcast.js
/**
 * @param {Object} feed — dati dal podcastService.getFeedInfo()
 * @returns JSON-LD PodcastSeries
 */
export function buildPodcastSchema(feed) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: feed.title,
    description: feed.description,
    url: `https://www.unlistened.me/feed/${feed.id}`,
    image: feed.image,
    author: {
      '@type': 'Person',
      name: feed.author,
    },
    publisher: {
      '@type': 'Organization',
      name: feed.author,
    },
    inLanguage: feed.language ?? 'en',
    genre: feed.categories ?? [],
    webFeed: feed.url, // URL del feed RSS originale
  }
}
```

### `episode.js` — pagina singolo episodio
```js
// src/seo/schemas/episode.js
/**
 * @param {Object} episode — dati dal podcastService.getEpisode()
 * @param {Object} feed    — dati del podcast padre
 * @returns JSON-LD PodcastEpisode
 */
export function buildEpisodeSchema(episode, feed) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: episode.title,
    description: episode.description,
    url: `https://www.unlistened.me/episode/${episode.id}`,
    image: episode.image ?? feed?.image,
    datePublished: episode.datePublished,
    duration: episode.duration ? formatDuration(episode.duration) : undefined,
    associatedMedia: {
      '@type': 'MediaObject',
      contentUrl: episode.enclosureUrl,
      encodingFormat: episode.enclosureType ?? 'audio/mpeg',
      duration: episode.duration ? formatDuration(episode.duration) : undefined,
    },
    partOfSeries: feed ? {
      '@type': 'PodcastSeries',
      name: feed.title,
      url: `https://www.unlistened.me/feed/${feed.id}`,
    } : undefined,
  }
}

// Converte secondi in formato ISO 8601 duration: PT1H23M45S
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `PT${h ? h + 'H' : ''}${m ? m + 'M' : ''}${s}S`
}
```

### `breadcrumb.js` — navigazione gerarchica
```js
// src/seo/schemas/breadcrumb.js
/**
 * @param {Array<{name: string, url: string}>} items
 * @returns JSON-LD BreadcrumbList
 */
export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Esempio per FeedEpisodesView:
// buildBreadcrumbSchema([
//   { name: 'Home', url: 'https://www.unlistened.me/' },
//   { name: feed.title, url: `https://www.unlistened.me/feed/${feed.id}` },
// ])
```

### `faq.js` — domande frequenti (About, Homepage)
```js
// src/seo/schemas/faq.js
/**
 * @param {Array<{question: string, answer: string}>} items
 * @returns JSON-LD FAQPage
 */
export function buildFaqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
```

---

## Implementazione per pagina

### Homepage (`/`)
```js
useSeo({
  title: 'Free Podcast Player — No Tracking | Unlistened.me',
  description: 'Stream thousands of podcasts for free. No cookies, no tracking, no accounts required.',
  canonical: 'https://www.unlistened.me/',
  jsonLd: [
    websiteSchema,          // SearchAction
    organizationSchema,     // Brand
    buildFaqSchema([        // Rich result FAQ
      { question: 'Is Unlistened.me free?', answer: 'Yes, completely free with no ads or subscriptions.' },
      { question: 'Do you track my listening?', answer: 'No. We do not use cookies or track your listening habits.' },
      { question: 'Do I need an account?', answer: 'No account is required to browse and listen. Create one to save favorites and bookmarks.' },
    ]),
  ],
})
```

### Pagina episodi podcast (`/feed/:id`)
```js
// FeedEpisodesView.vue — dati arrivano dall'API
const feed = ref(null)

const seoConfig = computed(() => {
  if (!feed.value) return { title: 'Loading... | Unlistened.me', robots: 'noindex' }
  return {
    title: `${feed.value.title} — Episodes | Unlistened.me`,
    description: truncate(feed.value.description, 155),
    canonical: `https://www.unlistened.me/feed/${feed.value.id}`,
    ogType: 'website',
    ogImage: feed.value.image,
    jsonLd: [
      buildPodcastSchema(feed.value),
      buildBreadcrumbSchema([
        { name: 'Home', url: 'https://www.unlistened.me/' },
        { name: feed.value.title, url: `https://www.unlistened.me/feed/${feed.value.id}` },
      ]),
    ],
  }
})

useSeo(seoConfig) // watchEffect reagisce quando computed cambia
```

> Nota: `robots: 'noindex'` mentre i dati caricano evita che Google indicizzi una pagina vuota.

### Pagina episodio singolo (`/episode/:id`)
```js
const seoConfig = computed(() => {
  if (!episode.value) return { title: 'Loading... | Unlistened.me', robots: 'noindex' }
  return {
    title: `${episode.value.title} | ${feed.value?.title ?? 'Unlistened.me'}`,
    description: truncate(episode.value.description, 155),
    canonical: `https://www.unlistened.me/episode/${episode.value.id}`,
    ogType: 'article',
    ogImage: episode.value.image ?? feed.value?.image,
    jsonLd: [
      buildEpisodeSchema(episode.value, feed.value),
      buildBreadcrumbSchema([
        { name: 'Home', url: 'https://www.unlistened.me/' },
        { name: feed.value?.title, url: `https://www.unlistened.me/feed/${feed.value?.id}` },
        { name: episode.value.title, url: `https://www.unlistened.me/episode/${episode.value.id}` },
      ]),
    ],
  }
})

useSeo(seoConfig)
```

### Pagine auth (login, signup, forgot, reset)
```js
// Noindex: non utile su Google, evita crawl budget sprecato
useSeo({
  ...loginSeo,
  robots: 'noindex,nofollow',
})
```

### Dashboard admin
```js
useSeo({
  title: 'Dashboard | Unlistened.me',
  description: 'Admin dashboard.',
  robots: 'noindex,nofollow',
})
```

---

## Ripulire il router

Una volta che ogni view chiama `useSeo()`, il router può essere semplificato:

1. **Rimuovi** tutti i blocchi `metaTags: [...]` dal `meta` di ogni route
2. **Rimuovi** il blocco DOM manipulation da `router.beforeEach` (le righe che fanno `querySelectorAll` e `createElement`)
3. **Mantieni** solo: `title` (fallback di sicurezza), `requiresAuth`, `requiresAdmin`

Il risultato è un router.js ridotto a ~80 righe invece di 720.

---

## `SeoHead.vue` — componente opzionale

Se preferisci gestire i JSON-LD come componente Vue invece che via DOM imperativo (più esplicito nel template):

```vue
<!-- src/components/SeoHead.vue -->
<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  schemas: { type: Array, default: () => [] }
})

let injected = []

const inject = () => {
  injected.forEach(el => el.remove())
  injected = []
  props.schemas.forEach(schema => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-ld', '')
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    injected.push(script)
  })
}

onMounted(inject)
watch(() => props.schemas, inject, { deep: true })
onUnmounted(() => injected.forEach(el => el.remove()))
</script>

<template><!-- no output --></template>
```

Utilizzo nel template della view:
```html
<SeoHead :schemas="[podcastSchema, breadcrumbSchema]" />
```

Utile se vuoi che il JSON-LD sia visibile nel template invece che nascosto nel `<script setup>`. Entrambi gli approcci sono validi; scegli quello che preferisci per ogni view.

---

## Sitemap.xml

La sitemap deve essere generata **lato server** (Laravel), non lato client. Il backend ha accesso a tutti i feed e gli episodi nel database.

Struttura raccomandata:
```xml
<!-- /sitemap.xml — indice delle sitemap -->
<sitemapindex>
  <sitemap><loc>https://www.unlistened.me/sitemap-static.xml</loc></sitemap>
  <sitemap><loc>https://www.unlistened.me/sitemap-feeds.xml</loc></sitemap>
  <sitemap><loc>https://www.unlistened.me/sitemap-episodes.xml</loc></sitemap>
</sitemapindex>
```

```xml
<!-- sitemap-static.xml -->
<url><loc>https://www.unlistened.me/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
<url><loc>https://www.unlistened.me/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://www.unlistened.me/categories</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
<url><loc>https://www.unlistened.me/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
```

```xml
<!-- sitemap-feeds.xml — un <url> per ogni podcast -->
<url>
  <loc>https://www.unlistened.me/feed/12345</loc>
  <lastmod>2026-04-01</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

Aggiungi a `robots.txt` (nel server Laravel):
```
Sitemap: https://www.unlistened.me/sitemap.xml
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /settings
Disallow: /favourites
Disallow: /bookmarks
```

---

## Rich results — cosa Google può mostrare

| Schema implementato | Rich result attivato |
|---|---|
| `WebSite` + `SearchAction` | Search box nei risultati Google per "unlistened.me" |
| `Organization` | Knowledge panel del brand |
| `FAQPage` | Accordion di domande/risposte nei risultati |
| `PodcastSeries` | Podcast carousel / entity in Google Podcasts |
| `PodcastEpisode` | Episode card con audio player inline |
| `BreadcrumbList` | Breadcrumb navigabile sotto il link nei risultati |

---

## Open Graph — miglioramenti specifici

Aggiungi questi tag che mancano completamente:
```html
<!-- Dimensioni immagine OG (evita layout shift nei link preview) -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">

<!-- Locale -->
<meta property="og:locale" content="en_US">

<!-- Per episodi/podcast: tipo article -->
<meta property="article:published_time" content="2026-04-01T00:00:00Z">
```

---

## Checklist di implementazione

### Fase 1 — Fondamenta (priorità alta)
- [ ] Creare `src/seo/composables/useSeo.js`
- [ ] Creare `src/seo/schemas/organization.js` e `website.js` (statici)
- [ ] Creare `src/seo/schemas/breadcrumb.js` e `faq.js` (builder puri)
- [ ] Creare `src/seo/schemas/podcast.js` e `episode.js` (builder da API)
- [ ] Creare `src/seo/registry/` con configurazioni per tutte le pagine statiche
- [ ] Creare `src/components/SeoHead.vue`
- [ ] Integrare `useSeo` in `HomeView.vue` con `websiteSchema + organizationSchema + FAQPage`
- [ ] Ripulire `router/index.js` (rimuovere metaTags e DOM manipulation)

### Fase 2 — Pagine dinamiche (priorità alta)
- [ ] Integrare `useSeo` + `buildPodcastSchema` in `FeedEpisodesView.vue`
- [ ] Integrare `useSeo` + `buildEpisodeSchema` in `SingleEpisodeView.vue`
- [ ] `robots: 'noindex'` per auth pages e dashboard
- [ ] `og:image` dinamica per podcast/episodio (usa cover art del podcast)

### Fase 3 — Sitemap (richiede lavoro backend)
- [ ] Creare endpoint Laravel `/sitemap.xml` con sitemap index
- [ ] `sitemap-static.xml` per le pagine statiche
- [ ] `sitemap-feeds.xml` generato da DB (tutti i podcast)
- [ ] `sitemap-episodes.xml` generato da DB (tutti gli episodi)
- [ ] Aggiungere `robots.txt` con `Disallow` per pagine private

### Fase 4 — Monitoraggio
- [ ] Google Search Console — verifica sitemap e monitora rich results
- [ ] Test su [Rich Results Test](https://search.google.com/test/rich-results) per ogni schema
- [ ] Test su [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) per OG tags
- [ ] Test su [Twitter Card Validator](https://cards-dev.twitter.com/validator) per Twitter Card

---

## Files da creare/modificare

| File | Azione | Note |
|---|---|---|
| `src/seo/composables/useSeo.js` | Crea | Composable principale |
| `src/seo/schemas/organization.js` | Crea | Schema statico |
| `src/seo/schemas/website.js` | Crea | Schema + SearchAction |
| `src/seo/schemas/podcast.js` | Crea | Builder da feed API |
| `src/seo/schemas/episode.js` | Crea | Builder da episode API |
| `src/seo/schemas/breadcrumb.js` | Crea | Builder generico |
| `src/seo/schemas/faq.js` | Crea | Builder generico |
| `src/seo/registry/index.js` (+ file per pagina) | Crea | Config statiche |
| `src/components/SeoHead.vue` | Crea | Componente JSON-LD opzionale |
| `src/views/HomeView.vue` | Modifica | Aggiunge useSeo + schemi |
| `src/views/FeedEpisodesView.vue` | Modifica | useSeo reattivo con dati API |
| `src/views/SingleEpisodeView.vue` | Modifica | useSeo reattivo con dati API |
| `src/views/CategoriesView.vue` | Modifica | useSeo statico |
| `src/views/AboutView.vue` | Modifica | useSeo + FAQPage |
| `src/views/LoginView.vue` | Modifica | useSeo con noindex |
| `src/views/SignUpView.vue` | Modifica | useSeo con noindex |
| `src/views/DashboardView.vue` | Modifica | useSeo con noindex |
| `src/router/index.js` | Modifica | Rimuove metaTags e DOM manipulation |
| Backend Laravel | Nuovo endpoint | `/sitemap.xml`, `robots.txt` |
