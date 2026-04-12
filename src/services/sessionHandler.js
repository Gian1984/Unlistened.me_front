let unauthorizedHandler = null

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export function handleUnauthorized(error) {
  return unauthorizedHandler?.(error)
}
