import { ref, computed, toValue } from 'vue'

export function usePagination(itemsRef, initialPageSize = 12) {
    const visibleCount = ref(initialPageSize)

    const visibleItems = computed(() => {
        const items = toValue(itemsRef)
        if (!items) return []
        return items.slice(0, visibleCount.value)
    })

    function loadMore(pageSize = 12) {
        const items = toValue(itemsRef)
        if (!items) return
        visibleCount.value = Math.min(visibleCount.value + pageSize, items.length)
    }

    function reset() {
        visibleCount.value = initialPageSize
    }

    const hasMore = computed(() => {
        const items = toValue(itemsRef)
        if (!items) return false
        return visibleCount.value < items.length
    })

    return {
        visibleCount,
        visibleItems,
        hasMore,
        loadMore,
        reset
    }
}