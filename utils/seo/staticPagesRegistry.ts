import { staticRoutes } from '~/config/static-routes'

type StaticRoute = (typeof staticRoutes)[number]

export const staticPagesRegistry = Object.fromEntries(
  staticRoutes.map((route) => [
    route.seoKey,
    {
      title: route.title,
      description: route.description,
    },
  ])
) as Record<StaticRoute['seoKey'], Pick<StaticRoute, 'title' | 'description'>>
