export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Unlistened.me',
  url: 'https://www.unlistened.me',
  description: 'Free podcast player. No cookies, no tracking, no accounts required.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.unlistened.me/search-results?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}
