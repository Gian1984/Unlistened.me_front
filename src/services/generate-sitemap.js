import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const routesFilePath = path.resolve(__dirname, '../router/index.js')
const sitemapOutputPath = path.resolve(__dirname, '../../dist/sitemap.xml')
const baseUrl = 'https://www.unlistened.me'

// ── Blocklist ────────────────────────────────────────────────────────
// Paths that pass auto-detection but should still be excluded.
// Add any new path here to keep it out of the sitemap.
const EXCLUDE = new Set([
  '/search-results',   // needs query param, no standalone content
  '/login',
  '/signup',
  '/forgot_password',
  '/forbidden',        // error page
])

// ── Priority overrides ───────────────────────────────────────────────
// Any path not listed here gets priority 0.5 / changefreq monthly.
const PRIORITY = {
  '/':              { changefreq: 'daily',   priority: '1.0' },
  '/podcasts':      { changefreq: 'daily',   priority: '0.9' },
  '/music':         { changefreq: 'daily',   priority: '0.9' },
  '/categories':    { changefreq: 'weekly',  priority: '0.8' },
  '/about':         { changefreq: 'monthly', priority: '0.6' },
  '/documentation': { changefreq: 'monthly', priority: '0.5' },
  '/terms':         { changefreq: 'yearly',  priority: '0.3' },
  '/privacy':       { changefreq: 'yearly',  priority: '0.3' },
}

// ── Route extraction ─────────────────────────────────────────────────
function extractRoutes() {
  const src = fs.readFileSync(routesFilePath, 'utf8')

  // Match every { path: '...', ... } block inside the routes array.
  // We look for path + optional redirect / meta fields.
  const routeBlocks = [...src.matchAll(/\{\s*path:\s*['"]([^'"]+)['"]/g)]

  const routes = []
  for (const match of routeBlocks) {
    const routePath = match[1]

    // Grab the full block starting from this match to determine meta/redirect
    const start = match.index
    const blockEnd = src.indexOf('},', start)
    const block = src.slice(start, blockEnd !== -1 ? blockEnd : undefined)

    const hasRedirect = /redirect\s*:/.test(block)
    const requiresAuth = /requiresAuth\s*:\s*true/.test(block)
    const requiresAdmin = /requiresAdmin\s*:\s*true/.test(block)

    routes.push({ path: routePath, hasRedirect, requiresAuth, requiresAdmin })
  }
  return routes
}

// ── Sitemap generation ───────────────────────────────────────────────
function generateSitemap() {
  const routes = extractRoutes()
  const lastmod = new Date().toISOString()

  const included = routes.filter((r) => {
    // Dynamic segments (:id, :token, catch-all *)
    if (r.path.includes(':') || r.path.includes('*')) return false
    // Redirects
    if (r.hasRedirect) return false
    // Auth-protected
    if (r.requiresAuth || r.requiresAdmin) return false
    // Manual blocklist
    if (EXCLUDE.has(r.path)) return false
    return true
  })

  const entries = included.map((r) => {
    const p = PRIORITY[r.path] || { changefreq: 'monthly', priority: '0.5' }
    return `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

  fs.mkdirSync(path.dirname(sitemapOutputPath), { recursive: true })
  fs.writeFileSync(sitemapOutputPath, xml, 'utf8')

  console.log(`Sitemap generated: ${sitemapOutputPath}`)
  console.log(`  ${included.length} URLs included, ${routes.length - included.length} excluded`)
  console.log(`  Included: ${included.map((r) => r.path).join(', ')}`)
}

generateSitemap()
