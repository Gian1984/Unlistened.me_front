import { staticRoutes } from '~/config/static-routes'

type StaticRoute = (typeof staticRoutes)[number]

export const routeRegistry = Object.fromEntries(
  staticRoutes.map((route) => [
    route.key,
    {
      path: route.path,
      label: route.label,
      seoKey: route.seoKey,
      prerender: route.prerender,
    },
  ])
) as Record<StaticRoute['key'], Pick<StaticRoute, 'path' | 'label' | 'seoKey' | 'prerender'>>

export type RouteRegistryKey = keyof typeof routeRegistry
