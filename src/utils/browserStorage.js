const noopStorage = {
  getItem() {
    return null
  },
  setItem() {},
  removeItem() {},
}

export function getSafeSessionStorage() {
  return import.meta.client ? window.sessionStorage : noopStorage
}

export function getSafeLocalStorage() {
  return import.meta.client ? window.localStorage : noopStorage
}
