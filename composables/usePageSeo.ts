import { pagesRegistry } from '~/utils/seo/pagesRegistry'

export function usePageSeo(key: string) {
  const entry = pagesRegistry[key]
  if (!entry) {
    if (import.meta.dev) console.warn(`SEO key "${key}" not found in pagesRegistry.`)
    return
  }

  const { seo } = entry

  // Nuxt useHead for title and meta tags
  useHead({
    title: seo.title,
    meta: [
      { name: 'description', content: seo.description },
      { name: 'keywords', content: seo.keywords || '' },
      { name: 'robots', content: seo.robots || 'index,follow' },
      // Open Graph
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:image', content: seo.ogImage ? `https://www.unlistened.me${seo.ogImage}` : 'https://www.unlistened.me/images/ogimage-min.png' },
      // Twitter
      { name: 'twitter:title', content: seo.title },
      { name: 'twitter:description', content: seo.description },
      { name: 'twitter:image', content: seo.ogImage ? `https://www.unlistened.me${seo.ogImage}` : 'https://www.unlistened.me/images/ogimage-min.png' },
    ],
    script: [
      // Inject Structured Data (JSON-LD)
      ...(seo.structuredData ? [{
        type: 'application/ld+json',
        children: JSON.stringify(seo.structuredData)
      }] : []),
      // Inject FAQ Schema if present
      ...(seo.faqSchema ? [{
        type: 'application/ld+json',
        children: JSON.stringify(seo.faqSchema)
      }] : [])
    ]
  })

  return entry
}
