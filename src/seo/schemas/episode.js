/**
 * Converte secondi in durata ISO 8601: PT1H23M45S
 */
function toIsoDuration(seconds) {
  if (!seconds || seconds <= 0) return undefined
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `PT${h ? h + 'H' : ''}${m ? m + 'M' : ''}${s}S`
}

/**
 * Costruisce uno schema PodcastEpisode dai dati dell'episodio API.
 * @param {Object} episode — risposta da podcastService.getEpisode() → response.data.episode
 * @param {Object} [feed]  — dati del podcast padre (opzionale)
 * @returns {Object} JSON-LD PodcastEpisode
 */
export function buildEpisodeSchema(episode, feed = null) {
  if (!episode) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: episode.title,
    url: `https://www.unlistened.me/episode/${episode.id}`,
  }

  if (episode.description) {
    schema.description = episode.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }

  const image = episode.image || feed?.image
  if (image) schema.image = image

  if (episode.newestItemPubdate) {
    schema.datePublished = new Date(episode.newestItemPubdate * 1000).toISOString().split('T')[0]
  }

  const duration = toIsoDuration(episode.duration)

  if (episode.enclosureUrl) {
    schema.associatedMedia = {
      '@type': 'MediaObject',
      contentUrl: episode.enclosureUrl,
      encodingFormat: episode.enclosureType ?? 'audio/mpeg',
    }
    if (duration) schema.associatedMedia.duration = duration
  }

  if (feed) {
    schema.partOfSeries = {
      '@type': 'PodcastSeries',
      name: feed.title,
      url: `https://www.unlistened.me/feed/${feed.id}`,
    }
  } else if (episode.feedTitle && episode.feedId) {
    schema.partOfSeries = {
      '@type': 'PodcastSeries',
      name: episode.feedTitle,
      url: `https://www.unlistened.me/feed/${episode.feedId}`,
    }
  }

  return schema
}
