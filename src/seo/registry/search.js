import { staticPageSeo } from './staticPages.shared.js'

const base = staticPageSeo.search

export const searchSeo = {
  title: base.title,
  description: base.description,
  canonical: `https://www.unlistened.me${base.path}`,
  ogType: base.ogType,
  ogImage: base.ogImage,
  ogImageAlt: base.ogImageAlt,
  robots: base.robots,
}
