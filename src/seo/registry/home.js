import { websiteSchema } from '@/seo/schemas/website.js'
import { organizationSchema } from '@/seo/schemas/organization.js'
import { buildFaqSchema } from '@/seo/schemas/faq.js'
import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'
import { staticPageSeo } from './staticPages.shared.js'

const base = staticPageSeo.home
const faq = buildFaqSchema(base.faqItems)

export const homeSeo = {
  title: base.title,
  description: base.description,
  canonical: `https://www.unlistened.me${base.path}`,
  ogType: base.ogType,
  ogImage: base.ogImage,
  ogImageAlt: base.ogImageAlt,
  jsonLd: [
    websiteSchema,
    organizationSchema,
    faq,
    buildBreadcrumbSchema(base.breadcrumbs),
  ],
}
