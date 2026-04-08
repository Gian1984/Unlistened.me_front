/**
 * Costruisce uno schema PodcastSeries dai dati del feed API.
 * @param {Object} feed — risposta da podcastService.getFeedInfo() → response.data.feed
 * @returns {Object} JSON-LD PodcastSeries
 */
export function buildPodcastSchema(feed) {
  if (!feed) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: feed.title,
    url: `https://www.unlistened.me/feed/${feed.id}`,
    author: {
      '@type': 'Person',
      name: feed.author,
    },
    publisher: {
      '@type': 'Organization',
      name: feed.author,
    },
  }

  if (feed.description) {
    schema.description = feed.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }
  if (feed.image) schema.image = feed.image
  if (feed.language) schema.inLanguage = feed.language
  if (feed.url) schema.webFeed = feed.url

  // Categorie: l'API restituisce { id: name, ... }
  if (feed.categories && typeof feed.categories === 'object') {
    const genres = Object.values(feed.categories)
    if (genres.length) schema.genre = genres
  }

  return schema
}
