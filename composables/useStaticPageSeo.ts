import { staticPagesRegistry } from '~/utils/seo/staticPagesRegistry'

export function useStaticPageSeo(key: keyof typeof staticPagesRegistry) {
  const page = staticPagesRegistry[key]

  useSeoMeta({
    title: page.title,
    description: page.description,
    ogTitle: page.title,
    ogDescription: page.description,
  })
}
