import { ref, watch } from 'vue'
import { getSafeLocalStorage } from '@/utils/browserStorage'

const STORAGE_KEY = 'unlistened-sidebar-collapsed'
const storage = getSafeLocalStorage()

// Shared reactive state (singleton across all components that import this)
const isDesktopCollapsed = ref(false)
let restored = false

function restoreState() {
  if (restored) return
  restored = true
  const saved = storage.getItem(STORAGE_KEY)
  if (saved !== null) {
    isDesktopCollapsed.value = saved === 'true'
  }
}

watch(isDesktopCollapsed, (val) => {
  storage.setItem(STORAGE_KEY, String(val))
})

export function useSidebarState() {
  if (import.meta.client) {
    restoreState()
  }

  const toggleDesktopCollapse = () => {
    isDesktopCollapsed.value = !isDesktopCollapsed.value
    storage.setItem(STORAGE_KEY, String(isDesktopCollapsed.value))
  }

  return {
    isDesktopCollapsed,
    toggleDesktopCollapse,
  }
}
