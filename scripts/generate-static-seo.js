import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { staticPageSeo } from '../src/seo/registry/staticPages.shared.js'
import { websiteSchema } from '../src/seo/schemas/website.js'
import { organizationSchema } from '../src/seo/schemas/organization.js'
import { buildBreadcrumbSchema } from '../src/seo/schemas/breadcrumb.js'
import { buildFaqSchema } from '../src/seo/schemas/faq.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(__dirname, '../public/seo-static.json')

function buildJsonLd(entryKey, entry) {
  const jsonLd = []

  if (entryKey === 'home') {
    jsonLd.push(websiteSchema, organizationSchema)
  }

  if (entryKey === 'about') {
    jsonLd.push(organizationSchema)
  }

  if (entry.breadcrumbs?.length) {
    jsonLd.push(buildBreadcrumbSchema(entry.breadcrumbs))
  }

  if (entry.faqItems?.length) {
    jsonLd.push(buildFaqSchema(entry.faqItems))
  }

  return jsonLd.filter(Boolean)
}

const payload = Object.fromEntries(
  Object.entries(staticPageSeo).map(([key, entry]) => [
    entry.path,
    {
      title: entry.title,
      description: entry.description,
      image: entry.ogImage,
      imageAlt: entry.ogImageAlt,
      type: entry.ogType ?? 'website',
      robots: entry.robots ?? 'index,follow',
      jsonLd: buildJsonLd(key, entry),
    },
  ]),
)

fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8')
console.log(`Static SEO generated: ${outputPath}`)
