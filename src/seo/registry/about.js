import { organizationSchema } from '@/seo/schemas/organization.js'
import { buildFaqSchema } from '@/seo/schemas/faq.js'
import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'
import { staticPageSeo } from './staticPages.shared.js'

const base = staticPageSeo.about
const faq = buildFaqSchema(base.faqItems)

export const aboutSeo = {
  title: base.title,
  description: base.description,
  canonical: `https://www.unlistened.me${base.path}`,
  ogType: base.ogType,
  ogImage: base.ogImage,
  ogImageAlt: base.ogImageAlt,
  jsonLd: [
    organizationSchema,
    faq,
    buildBreadcrumbSchema(base.breadcrumbs),
  ],
}
