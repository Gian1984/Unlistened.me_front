import { ref, watch } from 'vue'

const STORAGE_KEY = 'unlistened-sidebar-collapsed'

// Shared reactive state (singleton across all components that import this)
const isDesktopCollapsed = ref(false)
let restored = false

function restoreState() {
  if (restored) return
  restored = true
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    isDesktopCollapsed.value = saved === 'true'
  }
}

watch(isDesktopCollapsed, (val) => {
  localStorage.setItem(STORAGE_KEY, String(val))
})

export function useSidebarState() {
  restoreState()

  const toggleDesktopCollapse = () => {
    isDesktopCollapsed.value = !isDesktopCollapsed.value
  }

  return {
    isDesktopCollapsed,
    toggleDesktopCollapse,
  }
}
