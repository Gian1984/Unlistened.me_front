export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Unlistened.me',
  url: 'https://www.unlistened.me',
  description: 'Free listening platform for podcasts and Creative Commons music. No cookies, no tracking, no account required for listening.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.unlistened.me/search-results?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}
