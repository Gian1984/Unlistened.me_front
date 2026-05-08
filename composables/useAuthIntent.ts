import { podcastService } from '@/services/podcastService'

// Intent encoding: `<type>:<encodedArg1>:<encodedArg2>...`
// Each arg is encodeURIComponent'd at build time and decoded here.

type ReplayHandler = (args: string[]) => Promise<unknown>

const replayHandlers: Record<string, ReplayHandler> = {
  // Podcast favorite — args: [feedId, feedTitle]
  async fav([feedId, feedTitle = '']) {
    if (!feedId) return
    await podcastService.addFavorite(feedId, decodeURIComponent(feedTitle))
  },
  // Episode bookmark — args: [episodeId, episodeTitle]
  async bm([episodeId, episodeTitle = '']) {
    if (!episodeId) return
    await podcastService.addBookmark(episodeId, decodeURIComponent(episodeTitle))
  },
}

export function buildIntent(type: string, ...args: (string | number | undefined)[]): string {
  const encoded = args
    .filter((a) => a !== undefined && a !== null)
    .map((a) => encodeURIComponent(String(a)))
  return [type, ...encoded].join(':')
}

export function useAuthIntent() {
  const router = useRouter()
  const route = useRoute()
  const messageStore = useMessageStore()

  function redirectToLogin(opts: { intent?: string; message?: string } = {}) {
    if (opts.message) messageStore.setMessage(opts.message)
    const query: Record<string, string> = { redirect: route.fullPath }
    if (opts.intent) query.intent = opts.intent
    return router.push({ path: '/login', query })
  }

  async function consumeAuthIntent(query: Record<string, any>): Promise<string> {
    const redirect = typeof query.redirect === 'string' ? query.redirect : '/'
    const intent = typeof query.intent === 'string' ? query.intent : null
    if (intent) {
      const [type, ...args] = intent.split(':')
      const handler = replayHandlers[type]
      if (handler) {
        try {
          await handler(args)
        } catch {
          // Best-effort; the user already saw the login succeed.
        }
      }
    }
    return redirect
  }

  return { redirectToLogin, consumeAuthIntent }
}
