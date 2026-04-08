<template>
  <!-- Matches the episode row in FeedEpisodesView:
       play circle | title + meta | bookmark + download icons -->
  <article class="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
    <div class="shrink-0 w-9 h-9 rounded-full animate-shimmer" />
    <div class="flex-1 min-w-0 space-y-2">
      <div class="h-4 w-3/4 rounded animate-shimmer" />
      <div class="h-3 w-1/3 rounded animate-shimmer" />
    </div>
    <div class="flex items-center gap-1 shrink-0">
      <div class="w-7 h-7 rounded-full animate-shimmer" />
      <div class="w-7 h-7 rounded-full animate-shimmer" />
    </div>
  </article>
</template>
