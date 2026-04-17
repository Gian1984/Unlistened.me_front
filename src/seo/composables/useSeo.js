import { watchEffect, isRef } from 'vue'

const SITE_NAME = 'Unlistened.me'
const BASE_URL = 'https://www.unlistened.me'
const DEFAULT_IMAGE = `${BASE_URL}/images/ogimage-min.png`
const DEFAULT_OG_IMAGE_ALT = 'Unlistened.me preview image'
const DEFAULT_THEME_COLOR = '#030712'

function truncate(str, max) {
  if (!str) return ''
  const clean = str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : clean.slice(0, max - 1) + '…'
}

function upsertMeta(attrName, attrValue, content) {
  const selector = `meta[${attrName}="${attrValue}"]`
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrName, attrValue)
    el.setAttribute('data-vue-seo', '')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Composable SEO centrale. Reattivo: se `config` è una Ref o computed,
 * i meta si aggiornano automaticamente quando i dati cambiano.
 *
 * @param {import('vue').Ref|Object} config
 * @param {string}   config.title        — Testo completo del <title>
 * @param {string}   config.description  — Meta description (max 155 char consigliato)
 * @param {string}   [config.canonical]  — URL canonico assoluto
 * @param {string}   [config.ogType]     — 'website' | 'article'
 * @param {string}   [config.ogImage]    — URL immagine OG (1200×630)
 * @param {string}   [config.robots]     — 'index,follow' | 'noindex,nofollow'
 * @param {Array}    [config.jsonLd]     — Array di oggetti JSON-LD schema.org
 */
export function useSeo(config) {
  if (import.meta.server) return

  watchEffect(() => {
    const cfg = isRef(config) ? config.value : config
    if (!cfg) return

    const title = cfg.title ?? SITE_NAME
    const description = truncate(cfg.description ?? '', 155)
    const canonical = cfg.canonical ?? (BASE_URL + window.location.pathname)
    const image = cfg.ogImage ?? DEFAULT_IMAGE
    const robots = cfg.robots ?? 'index,follow'
    const ogType = cfg.ogType ?? 'website'
    const ogImageAlt = cfg.ogImageAlt ?? DEFAULT_OG_IMAGE_ALT
    const themeColor = cfg.themeColor ?? DEFAULT_THEME_COLOR

    // <title>
    document.title = title

    // Standard meta
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', robots)
    upsertMeta('name', 'theme-color', themeColor)
    upsertMeta('name', 'apple-mobile-web-app-title', SITE_NAME)

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
    }
    canonicalEl.setAttribute('href', canonical)

    // Open Graph
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:type', ogType)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:image:alt', ogImageAlt)
    upsertMeta('property', 'og:image:width', '1200')
    upsertMeta('property', 'og:image:height', '630')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:locale', 'en_US')

    // Twitter Card
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)
    upsertMeta('name', 'twitter:image:alt', ogImageAlt)

    // JSON-LD — rimuovi i precedenti e inietta i nuovi
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
