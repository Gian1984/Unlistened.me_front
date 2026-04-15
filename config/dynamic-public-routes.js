export const dynamicPublicRoutes = [
  {
    key: 'feedDetail',
    pattern: '/feed/**',
    page: '/feed/[id]',
    dataStrategy: 'client-fetch-static-shell',
    prerender: false,
    spaFallbackRequired: true,
    notes: 'Public podcast detail route fetched on the client at runtime.',
  },
  {
    key: 'episodeDetail',
    pattern: '/episode/**',
    page: '/episode/[id]',
    dataStrategy: 'client-fetch-static-shell',
    prerender: false,
    spaFallbackRequired: true,
    notes: 'Public episode detail route fetched on the client at runtime.',
  },
  {
    key: 'musicAlbumDetail',
    pattern: '/music/album/**',
    page: '/music/album/[id]',
    dataStrategy: 'client-fetch-static-shell',
    prerender: false,
    spaFallbackRequired: true,
    notes: 'Public album detail route fetched on the client at runtime.',
  },
]
