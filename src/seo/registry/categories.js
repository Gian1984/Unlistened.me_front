import { buildBreadcrumbSchema } from '@/seo/schemas/breadcrumb.js'
import { staticPageSeo } from './staticPages.shared.js'

const base = staticPageSeo.categories

export const categoriesSeo = {
  title: base.title,
  description: base.description,
  canonical: `https://www.unlistened.me${base.path}`,
  ogType: base.ogType,
  ogImage: base.ogImage,
  ogImageAlt: base.ogImageAlt,
  jsonLd: [
    buildBreadcrumbSchema(base.breadcrumbs),
  ],
}
