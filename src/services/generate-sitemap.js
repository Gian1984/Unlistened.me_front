import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { staticRoutes } from '../../config/static-routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sitemapOutputPath = path.resolve(__dirname, '../../public/sitemap.xml')
const baseUrl = 'https://www.unlistened.me'

// ── Sitemap generation ───────────────────────────────────────────────
function generateSitemap() {
  const lastmod = new Date().toISOString()

  const included = staticRoutes.filter((route) => route.prerender)

  const entries = included.map((route) => {
    return `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
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
  console.log(`  ${included.length} URLs included`)
  console.log(`  Included: ${included.map((route) => route.path).join(', ')}`)
}

generateSitemap()
