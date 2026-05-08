import type { AxiosError } from 'axios'

type UnauthorizedHandler = (error: AxiosError) => unknown

let unauthorizedHandler: UnauthorizedHandler | null = null

export function registerUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler
}

export function handleUnauthorized(error: AxiosError): unknown {
  return unauthorizedHandler?.(error)
}
