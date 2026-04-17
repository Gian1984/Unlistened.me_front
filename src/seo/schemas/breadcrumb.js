/**
 * Costruisce uno schema BreadcrumbList.
 * @param {Array<{name: string, url: string}>} items
 * @returns {Object} JSON-LD BreadcrumbList
 */
export function buildBreadcrumbSchema(items) {
  if (!items?.length) return null
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
