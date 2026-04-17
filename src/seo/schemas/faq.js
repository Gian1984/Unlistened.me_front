/**
 * Costruisce uno schema FAQPage.
 * @param {Array<{question: string, answer: string}>} items
 * @returns {Object} JSON-LD FAQPage
 */
export function buildFaqSchema(items) {
  if (!items?.length) return null
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
