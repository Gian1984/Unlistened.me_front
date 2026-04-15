<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  eyebrowIcon: {
    type: [Object, Function],
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  maxWidthClass: {
    type: String,
    default: 'max-w-3xl',
  },
})
</script>

<template>
  <section class="mb-10">
    <nav v-if="breadcrumbs.length" aria-label="Breadcrumb" class="mb-4">
      <ol class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <li v-for="(item, index) in breadcrumbs" :key="`${item.label}-${index}`" class="flex items-center gap-2">
          <component
            :is="item.to ? 'NuxtLink' : 'span'"
            v-bind="item.to ? { to: item.to } : {}"
            class="transition-colors"
            :class="item.to ? 'hover:text-gray-300' : 'text-gray-400'"
          >
            {{ item.label }}
          </component>
          <span v-if="index < breadcrumbs.length - 1" aria-hidden="true">/</span>
        </li>
      </ol>
    </nav>

    <div
      v-if="eyebrow"
      class="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
    >
      <component :is="eyebrowIcon" v-if="eyebrowIcon" class="h-3.5 w-3.5" />
      <span>{{ eyebrow }}</span>
    </div>

    <h1 class="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
      {{ title }}
    </h1>

    <p v-if="description" :class="['mt-4 text-base leading-7 text-gray-400', maxWidthClass]">
      {{ description }}
    </p>
  </section>
</template>
