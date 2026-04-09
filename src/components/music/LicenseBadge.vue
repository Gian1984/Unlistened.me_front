<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: { type: String, default: '' },
  size: { type: String, default: 'sm' }, // 'sm' | 'xs'
})

const LICENSE_TABLE = {
  'by':       { code: 'CC BY',       label: 'Attribution' },
  'by-sa':    { code: 'CC BY-SA',    label: 'Attribution, ShareAlike' },
  'by-nc':    { code: 'CC BY-NC',    label: 'Attribution, NonCommercial' },
  'by-nc-sa': { code: 'CC BY-NC-SA', label: 'Attribution, NonCommercial, ShareAlike' },
  'by-nd':    { code: 'CC BY-ND',    label: 'Attribution, NoDerivatives' },
  'by-nc-nd': { code: 'CC BY-NC-ND', label: 'Attribution, NonCommercial, NoDerivatives' },
}

const info = computed(() => {
  if (!props.url) return null
  const match = props.url.match(/licenses\/([a-z-]+)\//)
  const key = match?.[1] ?? ''
  return LICENSE_TABLE[key] || { code: 'CC', label: 'Creative Commons' }
})
</script>

<template>
  <a
    v-if="info"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    :title="info.label + ' — opens creativecommons.org'"
    @click.stop
    :class="[
      'inline-flex items-center rounded-full border border-gray-700 bg-gray-800/60 font-medium tabular-nums uppercase tracking-wide text-gray-300 transition-colors hover:border-indigo-500/50 hover:text-indigo-300',
      size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
    ]"
  >
    {{ info.code }}
  </a>
</template>
