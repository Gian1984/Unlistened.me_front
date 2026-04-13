import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'
import { buildFaqSchema } from '@/seo/schemas/faq.js'
import { staticPageSeo } from './staticPages.shared.js'

const base = staticPageSeo.terms
const faq = buildFaqSchema(base.faqItems)

export const termsSeo = {
  title: base.title,
  description: base.description,
  canonical: `https://www.unlistened.me${base.path}`,
  ogType: base.ogType,
  ogImage: base.ogImage,
  ogImageAlt: base.ogImageAlt,
  jsonLd: [
    buildBreadcrumbSchema(base.breadcrumbs),
    faq,
  ],
}
