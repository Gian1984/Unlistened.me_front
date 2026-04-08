<template>
  <!-- Matches the compact horizontal podcast card in HomeView and SearchResultView -->
  <article class="rounded-lg bg-gray-800 border border-gray-700 overflow-hidden">
    <!-- Image + text row -->
    <div class="flex items-center gap-3 p-4">
      <div class="shrink-0 w-16 h-16 rounded-md animate-shimmer" />
      <div class="flex-1 min-w-0 space-y-2">
        <div class="h-4 w-3/4 rounded animate-shimmer" />
        <div class="h-3 w-1/2 rounded animate-shimmer" />
        <div class="h-3 w-full rounded animate-shimmer" />
        <div class="h-3 w-2/3 rounded animate-shimmer" />
      </div>
    </div>
    <!-- Category badges -->
    <div class="px-4 pb-3 flex gap-1.5">
      <div class="h-5 w-14 rounded-full animate-shimmer" />
      <div class="h-5 w-20 rounded-full animate-shimmer" />
    </div>
    <!-- Action row -->
    <div class="flex items-center px-4 pb-3">
      <div class="h-4 w-10 rounded animate-shimmer" />
      <div class="h-4 w-16 rounded animate-shimmer ml-auto" />
    </div>
  </article>
</template>
